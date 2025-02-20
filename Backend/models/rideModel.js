const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    captain:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'captains',
    },
    pickup:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    fare:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['pending','accepted','ongoing','completed','cancelled'],
        default:'pending'
    },
    duration:{ // in seconds
        type:Number
    },
    distance:{ // in meters
        type:Number
    },
    paymentID:{
        type:String,
    },
    orderID:{
        type:String,
    },
    signature:{
        type:String,
    },
    otp:{
        type:String,
        select:false,
    },
    notifiedCaptains:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'captains'
    }],
    expiresAt: { type: Date, 
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
        index: { expires: 86400 } }, // Ride automatically expires after 24 hours (600 seconds)
        
});

rideSchema.index({expiresAt:1},{expireAfterSeconds:86400});

const rideModel = mongoose.models.rides || mongoose.model('rides',rideSchema);

module.exports = rideModel;