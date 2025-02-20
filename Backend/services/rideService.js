const rideModel = require("../models/rideModel");
const mapService = require("./mapService");
const crypto = require("crypto");

const getFare = async (pickup,drop) => {

    if(!pickup || !drop) {
        throw new Error('Pickup and Destination Addresses are required!');
    }

    const distanceTime = await mapService.getDistanceTime(pickup,drop);

    const baseFare = {
        auto:30,
        car:50,
        motorcycle:20
    };

    const perKMRate = {
        auto:10,
        car:15,
        motorcycle:8
    };

    const perMinuteRate = {
        auto:2,
        car:3,
        motorcycle:1.5
    };

    const fare = {
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKMRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKMRate.car) + ((distanceTime.duration.value / 60)  * perMinuteRate.car)),
        motorcycle: Math.round(baseFare.motorcycle + ((distanceTime.distance.value / 1000) * perKMRate.motorcycle) + ((distanceTime.duration.value / 60)  * perMinuteRate.motorcycle)),
    };

    return fare;
}


function generateOTP() {
    const OTP = crypto.randomInt(1000,10000).toString();
    return OTP;
}

const createRide = async ({user,pickup,drop,vehicleType}) =>{

    if(!user || !pickup || !drop || !vehicleType) {
        throw new Error('All fields are required!');
    }

    const fare = await getFare(pickup,drop);

    const ride = await rideModel.create({
        user,
        pickup,
        destination:drop,
        fare:fare[vehicleType],
        otp:generateOTP()
    });
    return ride;
}

module.exports = {createRide,getFare};