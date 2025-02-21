const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blackListTokenModel = require("../models/blackListTokensModel");
const captainModel = require("../models/captainModel");
const blackListTokensModel = require("../models/blackListTokensModel");

const authUser = async  (req,res,next) => {

    // token mainly will be in either 'cookies' or in 'header'.
    try
    {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];


        if(!token){
            return res.status(401).json({message:'Unauthorized!'});
        }

        // it may be possible that user can store the token in there local storage , so deal with this situation we are adding this
        // if user 'token' is present in 'blacklist tokens' collection then user is unauthorized. 
        const isBlackListedToken = await blackListTokenModel.findOne({token:token});

        if(isBlackListedToken){
            return res.status(401).json({message:'Unauthorized!'});
        }

        // decode the token
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        let decodeId = decode.id;

        if(decode.id === undefined) {
            decodeId = decode._id;
        }
        // after decoding we will get the 'id' of the user which we have added while creating the token.
        const user = await userModel.findById(decodeId);

        if(!user){
            return res.status(404).json({message:'User not Found!'});
        }

        req.user = user;

        next();
    }
    catch(err)
    {
        return res.status(401).json({message:'Unauthorized!'});
    }
}

const authCaptain = async (req,res,next) => {

    try
    {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if(!token){
            return res.status(401).json({message:'Unauthorized!'});
        }

        const isMatch = await blackListTokensModel.findOne({token});

        if(isMatch){
            return res.status(401).json({message:'Unauthorized!'});
        }

        // decode the token
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        const captain = await captainModel.findById(decode._id);

        req.captain = captain;
        next();
    }
    catch(err)
    {
        return res.status(401).json({message:'Unauthorized!'});
    }
}

module.exports = {authUser,authCaptain}