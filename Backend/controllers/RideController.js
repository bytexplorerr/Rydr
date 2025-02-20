const rideModel = require("../models/rideModel");
const rideService = require("../services/rideService");
const { validationResult } = require("express-validator");
const mapService = require("../services/mapService");
const socket = require("../socket");
const { default: mongoose } = require("mongoose");
const userModel = require("../models/userModel");

const createNewRide = async (req,res,next)=> {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({error:errors.array()});
    }
    try {
        const {pickup,drop,vehicleType} = req.body;

        const ride = await rideService.createRide({user:req.user._id,pickup,drop,vehicleType})

        // pickupCoordinates for finding the 'captains' near the 'pickup' location.
        const pickupCoordinates = await mapService.getAddressCoordinates(pickup);

        // 5000 m = 5 K.M. (so return the captains within 5 K.M> radius of 'pickup' location of the user).
        const captaInRadius = await mapService.getCaptainsInRadius(pickupCoordinates.lat,pickupCoordinates.lng,5000);

        ride.notifiedCaptains = captaInRadius.map((captain)=>  new mongoose.Types.ObjectId(captain._id));
        await ride.save();

        ride.otp = "";


        // to fetch all the information of user and display it to captain , we need to 'populate' 'user' by 'user._id

        const rideWithUser = await rideModel.findOne({_id:ride._id}).populate('user');


        // now we need to send the message to all the captain via their 'socket-id'. we are not sending 'otp' to captain.

        captaInRadius.map((captain)=>{
            const messageObject = {
                event:'new-ride',
                data:rideWithUser
            }
            socket.sendMessageToSocketID(captain.socketId,messageObject);
        })

        return res.status(201).json(ride);

    } catch(err) {
        console.log(err);
        return res.status(500).json({message:'Error in creating a ride, Try Again!'});
    }
}

const getFareInfo = async (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({error:errors.array()});
    }

    try {
        const {pickup,drop} = req.query;
        const fare = await rideService.getFare(pickup,drop);

        if(fare) {
            return res.status(200).json(fare);
        } else {
            return res.status(404).json({message:'Unable to find Fare, Try Again!'});
        }
    } catch(err) {
        return res.status(500).json({message:'Internal Server Error!'});
    }
}

const cancelRide = async (req,res,next)=>{

    try{
        const {user} = req;

        const ride = await rideModel.findOne({user:user._id}).populate('notifiedCaptains','socketId');

        if(!ride) {
            return res.status(404).json({message:'Ride Not Found!'});
        }

        // Notify all captains who received the ride
        ride.notifiedCaptains.forEach((captain) => {
            if(captain.socketId) {
                socket.sendMessageToSocketID(captain.socketId, { event: 'ride-cancelled', data: ride._id });
            }
        });

        await rideModel.deleteOne({user:user._id});

        return res.status(200).json({message:'Ride Canclled Sucessfully!'});
        
    } catch(err) {
        console.log(err);
        return res.status(500).json({message:'Internal Server Error!'});
    }
}


const deleteRide = async(req,res,next)=>{
    try {
        const {user} = req;
        const ride = await rideModel.findOne({user:user._id}).populate('notifiedCaptains','socketId');

        if(!ride) {
            return res.status(400).json({message:'Ride Not Found!'});
        }

        //Notify all the captains who recevied the ride request
        ride.notifiedCaptains.forEach((captain)=>{
            if(captain.socketId) {
                socket.sendMessageToSocketID(captain.socketId,{event:'ride-delete',data:ride._id});
            }
        });

        await rideModel.deleteOne({user:user._id});

        return res.status(200).json({message:'Ride Deleted Sucessfully!'});
    } catch(err) {
        console.log(err);
        return res.status(500).json({message:'Internal server Error!'});
    }
}

const confirmRide = async (req,res,next) => {

    try {
        const {captain} = req;
        const {rideInfo} = req.body;

        if(!captain || !rideInfo) {
            return res.status(401).json({message:'Unauthorized!'});
        }

        // Fetch the ride including the `otp` field (because `select:false` hides it by default)
        const ride = await rideModel.findById(rideInfo._id).select('+otp').populate('notifiedCaptains','socketId');

        if (!ride) {
            return res.status(400).json({ message: 'Ride Not Found!' });
        }
        
        ride.notifiedCaptains.forEach((captain) => {
            if(captain.socketId) {
                socket.sendMessageToSocketID(captain.socketId, { event: 'ride-delete', data: ride._id });
            }
        });

        const pickupCoordinates = await mapService.getAddressCoordinates(ride.pickup);

        await rideModel.updateOne({_id:rideInfo._id},{$set:{status:'accepted',notifiedCaptains:[new mongoose.Types.ObjectId(captain._id)]}});

        const user = await userModel.findOne({_id:rideInfo.user});

        if(!user) {
            return res.status(400).json({message:'Ride Not Found!'});
        }

        const captainCoorinates = {
            lat:captain.location.ltd,
            lng:captain.location.lng,
        };

        const distanceTime = await mapService.getDistanceTime(captainCoorinates,rideInfo.pickup);
        let distance = distanceTime.distance.value;

        if(distance < 1000) {
            distance += ' m';
        } else {
            distance = (distance / 1000).toFixed(2) + ' Km';
        }

        const data = {
            rideInfo:{
                ...rideInfo,
                distance:distance,
                otp:ride.otp, // Adding 'otp' to response
            },
            captain,
            captainCoorinates,
            pickupCoordinates
        };

        socket.sendMessageToSocketID(user.socketId,{event:'ride-confirmed',data:data});

        return res.status(200).json({ride,rideInfo:data});

    } catch(err) {
        return res.status(500).json({message:'Internal Server Error!'});
    }

}

const distanceFromUser = async (req,res,next)=>{
    try {

        const {captain} = req;
        const {pickup} = req.body;

        if(!pickup) {
            return res.status(404).json({message:'Location Not Found!'});
        }

        if(!captain || !captain.location) {
            return res.status(404).json({message:'Location of Captain Not Found!'});
        }

        // compute distance
        const captainCoorinates = {
            lat:captain.location.ltd,
            lng:captain.location.lng
        }

        const distanceTime = await mapService.getDistanceTime(captainCoorinates,pickup);

        const distance = distanceTime.distance.value;

        return res.status(200).json({distance});

    } catch(err) {
        console.log(err);
        return res.status(500).json({message:'Internal server error!'});
    }
}

const captainCancelRide = async (req,res,next)=>{

    try {
        const {rideId} = req.body;

        const ride = await rideModel.findById(rideId).populate('user');

        if(!ride) {
            return res.status(404).json({message:'Ride Not Found!'});
        }

        const userSocketId = ride.user?.socketId; 

        await rideModel.findByIdAndDelete(rideId);

        socket.sendMessageToSocketID(userSocketId,{event:'captain-ride-cancelled',data:rideId});

        return res.status(200).json({message:'Ride Cancelled Successfully!'});

    } catch(err) {
        console.log(err);
        return res.status(500).json({message:'Internal server Error!'});
    }

}

const sendMessage = async (req,res,next)=>{

    try {

        const {tripInfo,role,data} = req.body;

        if(role === 'user') {

            let ride = await rideModel.findById(tripInfo.rideInfo._id);

            if(!ride) {
                return res.status(404).json({message:'Ride Not Found!'});
            }

            ride = await ride.populate('notifiedCaptains','socketId');

            ride.notifiedCaptains.forEach((captain)=>{
                if(captain.socketId) {
                    socket.sendMessageToSocketID(captain.socketId,{event:'received-chat',data:data});
                }
            });
        } 

        if(role === 'captain') {

            let ride = await rideModel.findById(tripInfo._id);

            if(!ride) {
                return res.status(404).json({message:'Ride Not Found!'});
            }
            ride = await ride.populate('user');
            const userSocketId = ride.user?.socketId;
            socket.sendMessageToSocketID(userSocketId,{event:'received-chat',data:data});
        }

        return res.status(200).json({message:'Message sent sucessfully!'});

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({message:'Internal server error!'});
    }
}

const verifyOTP = async (req,res,next)=>{
    try {
        const {rideId,otp} = req.body;

        let ride = await rideModel.findById(rideId).select('+otp').populate('user');

        if(!ride) {
            return res.status(404).json({message:'Ride Not Found!'});
        }

        if(ride.otp !== otp) {
            return res.status(401).json({message:'Invalid OTP!'});
        }

        ride.status = 'ongoing';
        await ride.save();
    
        const destinationCoordinates = await mapService.getAddressCoordinates(ride.destination);

        ride = ride.toObject(); // Convert to a plain object
        ride.destinationCoordinates = destinationCoordinates;


        const userSocketId = ride.user?.socketId;
        socket.sendMessageToSocketID(userSocketId,{event:'ride-started',data:ride});

        return res.status(200).json({ride});

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({message:'Internal server error!'});
    }
}

const finishRide = async (req,res,next)=>{
    try {

        const {rideId} = req.query;

        const ride = await rideModel.findById(rideId).populate('user');

        if(!ride) {
            return res.status(404).json({message:'Ride Not Found!'});
        }

        const userSocketId = ride.user?.socketId;
        socket.sendMessageToSocketID(userSocketId,{event:'ride-completed',data:rideId});

        await rideModel.findByIdAndDelete(rideId);

        return res.status(200).json({message:'Ride completed sucessfully!'});

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({message:'Internal server error!'});
    }
}

const updateCaptainLocation = async (req,res,next)=>{
    try {
        const {rideId,location} = req.body;

        const ride = await rideModel.findById(rideId).populate('user');

        if(!ride) {
            return res.status(404).json({message:'Ride Not Found!'});
        } 

        const userSocketId = ride.user?.socketId;
        socket.sendMessageToSocketID(userSocketId,{event:'updated-captain-location',data:location});

        return res.status(200).json({message:'Location updated successfully!'});

    } catch(err) {
        console.log(err.message);
        return res.status(500).json({message:'Internal server error!'});
    }
}

module.exports = {createNewRide,getFareInfo,cancelRide,confirmRide,deleteRide,distanceFromUser,captainCancelRide,sendMessage,verifyOTP,finishRide,updateCaptainLocation};