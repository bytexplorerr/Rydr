const userModel = require("../models/userModel");
const userService = require("../services/userService");
const {validationResult} = require("express-validator"); // if there is any error then we need to perform action using this dependency
const blackListTokenModel = require("../models/blackListTokensModel");
const { SignupMailService, ForgotPasswordMailService } = require("../services/mailService");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { decode } = require("punycode");

const registerUser = async (req,res,next) => {
    
    try
    {
        const errors = validationResult(req);

        if(!errors.isEmpty()){ // if any kind of error is there 
            return res.status(400).json({error:errors.array()});
        }

        const {fullName,email,password} = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const verificationToken = crypto.randomBytes(32).toString("hex");

        const hashedPassword = await userModel.hashPassword(password);

        const user = await userService.createUser({
            firstName:fullName.firstName,
            lastName:fullName.lastName,
            email,
            password:hashedPassword,
            verificationToken,
            expiresAt:new Date(Date.now() + 10 * 60 * 1000)
        });

        SignupMailService({
            emailId:email,
            userName:fullName.firstName,
            role:"user",
            verificationToken
        })
        
        res.status(201).json({user});
    }
    catch(err)
    {
        next(err);
    }
}

const loginUser = async (req,res,next) =>{
    try
    {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({error:errors.array()});
        }

        const {email,password} = req.body;

        // when we are using any query on user then 'by default' 'password' will not come as we have mentionded 'select:false' it in 'userModel'.
        const user = await userModel.findOne({email:email}).select('+password'); // it means that when your are findding the user also take the password for authentication.

        if(!user){
            return res.status(401).json({message:'Invalid email or password'});
        }

        if(user.verificationToken) {
            return res.status(401).json({message:'Verify your Email First!'});
        }
        
        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            return res.status(401).json({message:'Invalid email or password'});
        }

        const token = user.generateAuthToken();

        res.cookie('token',token);
        res.status(200).json({token,user});
    }
    catch(err)
    {
        next(err);
    }
}

const getUserProfile = async (req,res,next) => {
    return res.status(200).json(req.user);
}

const logoutUser = async (req,res,next) => {

    try
    {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if(!token){
            return res.status(400).json({ message: "No token found, already logged out!" });
        }

        await blackListTokenModel.create({token});

        // clear the token from cookies
        res.clearCookie('token');

        return res.status(200).json({message:"Logout Successfully!"});
    }
    catch(err)
    {
        console.error("Logout Error:", err);
        return res.status(500).json({ message: "Error during logout!" });
    }
}

const VerifyUser = async (req,res) => {
    try {
        const {token} = req.params;

        const user = await userModel.findOne({
            verificationToken:token,
            verificationToken: { $exists: true } // check only if 'key' exist, if we didn't mention this and if key is not present then it returns 'null'.
        });

        if(!user) {
            return res.status(400).json({message:'Invalid or expired token'});
        }

        res.redirect(`http://localhost:5173/login?verificationToken=${token}`);

    } catch(err) {
        res.status(500).json({ message: "Error verifying email", err });
    }
}

const VerifyUserToken = async (req,res)=>{
    try{
        const {token} = req.params;

        const user = await userModel.findOne({
            verificationToken:token,
            verificationToken:{$exists:true}
        });

        if(!user) {
            return res.status(400).json({message:'Invalid or expired token!'});
        }

        await userModel.updateOne(
            { _id: user._id },
            { $unset: { verificationToken: 1, expiresAt: 1 } } // Correct value for $unset
        );

        return res.status(200).json({verified:true});
    }
    catch(err) {

        await userModel.deleteOne({verificationToken:req.params.token});

        return res.status(500).json({message:'Error in verifying the token!'},err);
    }
}

const ForgotPassword = async (req,res,next) => {
    try {

        const {emailId} = req.body;

        const user = await userModel.findOne({email:emailId});

        if(!user) {
            return res.status(404).json({message:'User Not Found!'});
        }

        const token = userModel.generateChangePasswordToken(user._id);

        ForgotPasswordMailService({
            emailId:emailId,
            userName:user.fullName.firstName,
            verificationToken:token,
            role:'user'
        });

        return res.status(200).json({ message: 'Password reset email sent successfully!' });

    } catch(err) {
        return res.status(500).json({message:'Internal Server Error!'},err);
    }
}

const VerifyPasswordResetToken = async (req,res,next) => {
    try {
        const {token} = req.params;

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await userModel.findById(decoded._id);

        if(!user) {
            return res.status(404).json({message:'User Not Found!'});
        }

        res.status(200).json({verified:true});

    } catch(err) {
        return res.status(400).json({message:'Invalid or expired token!'});
    }
}

const ResetPassword = async (req,res,next) => {
    try {

        const {token,newPassword} = req.body;

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await userModel.findById(decoded._id);

        if(!user) {
            return res.status(404).json({message:'User Not Found!'});
        }

        const hashedPassword = await userModel.hashPassword(newPassword);
        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({message:'Password change sucessfully!'});

    } catch(err) {
        return res.status(400).json({message:'Invalid or expired token!'});
    }
}



module.exports = {registerUser,loginUser,getUserProfile,logoutUser,VerifyUser,VerifyUserToken,VerifyPasswordResetToken,ForgotPassword,ResetPassword};