const captainModel = require("../models/captainModel");
const {validationResult} = require("express-validator");
const createCaptain = require("../services/captainService");
const blackListTokensModel = require("../models/blackListTokensModel");
const crypto = require("crypto");
const { SignupMailService, ForgotPasswordMailService } = require("../services/mailService");
const jwt = require("jsonwebtoken");
const { json } = require("stream/consumers");


const registerCaptain = async (req,res,next) => {
    try
    {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({error:errors.array()});
        }

        const {fullName,email,password,vehicle} = req.body;

        const existingCaptain = await captainModel.findOne({ email });
        if (existingCaptain) {
            return res.status(400).json({ message: "Email already exists" });
        }


        const verificationToken = crypto.randomBytes(32).toString("hex");

        const hashPassword = await captainModel.hashPassword(password);

        const captain = await createCaptain.captainService({
            fullName,
            email,
            password:hashPassword,
            vehicle,
            verificationToken,
            expiresAt:new Date(Date.now() + 10 * 60 * 1000)
        });

        SignupMailService({
            emailId:email,
            userName:fullName.firstName,
            role:"captain",
            verificationToken
        })

        return res.status(201).json({captain});

    }
    catch(err)
    {
        return res.status(400).json({message:'Unable to create user, Try Again!'});
    }

}

const loginCaptain = async (req,res,next) => {
    try
    {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({error:errors.array()});
        }

        const {email,password} = req.body;

        const captain = await captainModel.findOne({email}).select('+password');

        if(!captain){
            return res.status(401).json({message:'Invalid email or password'});
        }

        if(captain.verificationToken) {
            return res.select(401).json({message:'Verify your Email First!'});
        }

        const isMatch = await captain.comparePassword(password);

        if(!isMatch){
            return res.status(401).json({message:'Invalid email or password'});
        }

        const token = captain.generateAuthToken();

        res.cookie('token',token);
        res.status(200).json({token,captain});
    }
    catch(err)
    {
        return res.status(400).json({message:'Unable to login, Try Again!'});
    }
}

const getCaptainProfile = async (req,res,next) => {
    return res.status(200).json(req.captain);
}

const logoutCaptain = async (req,res,next) => {
    try
    {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if(!token){
            return res.status(400).json({message:'No token found, already logout!'});
        }

        await blackListTokensModel.create({token});

        //clear the cookie
        res.clearCookie('token');

        return res.status(200).json({message:'Logout Succesfully!'});

    }
    catch(err)
    {
        return res.status(500).json({message:'Error during logout!'});
    }
}

const VerifyCaptain = async (req,res) =>{
    try {

        const {token} = req.params;

        const captain = await captainModel.findOne({
            verificationToken:token,
            verificationToken: { $exists: true } // check only if 'key' exist, if we didn't mention this and if key is not present then it returns 'null'.
        });

        if(!captain) {
            return res.status(400).json({message:'Invalid or expired token!'});
        }

        res.redirect(`http://localhost:5173/captain-login?verificationToken=${token}`);

    } catch(err) {
        res.status(500).json({ message: "Error verifying email", err });
    }
}

const VerifyCaptainToken = async (req,res,next) =>{
    try
    {
        const {token} = req.params;

        const captain = await captainModel.findOne({
            verificationToken:token,
            verificationToken:{$exists:true}
        });

        if(!captain) {
            return res.status(400).json({message:'Invalid or expired token!'});
        }

        await captainModel.updateOne(
            { _id: captain._id },
            { $unset: { verificationToken: 1, expiresAt: 1 } } // Correct value for $unset
        );

        return res.status(200).json({verified:true});
    }
    catch(err) 
    {
        await captainModel.deleteOne({verificationToken:req.params.token});

        return res.status(500).json({message:'Error in verifying the token!'},err);
    }
}

const ForgotPassword = async (req,res,next) => {
    try {

        const {emailId} = req.body;

        const captain = await captainModel.findOne({email:emailId});

        if(!captain) {
            return res.status(404).json({message:'User Not Found!'});
        }

        const token = captainModel.generateChangePasswordToken(captain._id);

        ForgotPasswordMailService({
            emailId:emailId,
            userName:captain.fullName.firstName,
            verificationToken:token,
            role:'captain'
        });

        return res.status(200).json({message:'Password reset Email sent sucessfully!'});

    } catch(err) {
        return res.status(500).json({message:'Internal Server Error!'});
    }
}

const VerifyPasswordResetToken = async (req,res,next) => {
    try {

        const {token} = req.params;

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const captain = await captainModel.findById(decoded._id);

        if(!captain) {
            return res.status(404).json({message:'User Not Found!'});
        }

        return res.status(200).json({verified:true});

    } catch(err) {
        return res.status(400).json({message:'Invalid or expired token!'});
    }
}

const ResetPassword = async (req,res,next) => {
    try {

        const {token,newPassword} = req.body;

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const captain = await captainModel.findById(decoded._id);

        if(!captain) {
            return res.status(404).json({message:'User Not Found!'});
        }


        const hashedPassword = await captainModel.hashPassword(newPassword);
        captain.password = hashedPassword;

        await captain.save();

        return res.status(200).json({message:'Password Changed Successfully!'});

    } catch (err) {
        return res.status(400).json({message:'Invalid or expired token!'});
    }
}

module.exports = {registerCaptain,loginCaptain,getCaptainProfile,logoutCaptain,VerifyCaptain,VerifyCaptainToken,ForgotPassword,ResetPassword,VerifyPasswordResetToken};