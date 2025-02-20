const captainModel = require("../models/captainModel");

const captainService = async ({fullName,email,password,vehicle,verificationToken,expiresAt}) =>{
    try
    {

        if(!fullName.firstName || !email || !password || 
            !vehicle.color || !vehicle.plate || !vehicle.vehicleType || !vehicle.capacity || !verificationToken)
            {
                throw new Error('All fileds are required!');
            }
        
        const captain = await captainModel.create({
            fullName:fullName,
            email:email,
            password:password,
            vehicle:vehicle,
            verificationToken:verificationToken,
            expiresAt:expiresAt
        });

        return captain;
    }
    catch(err)
    {
        throw new Error('Error in creating a captain');
    }
}

module.exports = {captainService}