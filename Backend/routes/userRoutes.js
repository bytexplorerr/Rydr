const express = require("express");
const userRouter = express.Router();
const {body} = require("express-validator"); // only checks whether data is correct or not 
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// we have to validate the data which will come in this particular route
userRouter.post("/register",[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullName.firstName').isLength({min:3}).withMessage('First Name should be of at least 3 characters'),
    body('password').isLength({min:6}).optional({checkFalsy:true}).withMessage('Password should be of at least 6 characters')
    // allow password to be empty for OAuth users
],userController.registerUser);


userRouter.post("/login",[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password should be of at least 6 characters')
],userController.loginUser);

userRouter.get("/user-profile",authMiddleware.authUser,userController.getUserProfile);

userRouter.post("/logout",authMiddleware.authUser,userController.logoutUser);

userRouter.get("/verify/:token",userController.VerifyUser);

userRouter.get("/verify-token/:token",userController.VerifyUserToken);

userRouter.post("/forgot-password",userController.ForgotPassword);

userRouter.get("/verify-reset-token/:token",userController.VerifyPasswordResetToken);

userRouter.post("/reset-password",userController.ResetPassword);


module.exports = userRouter;