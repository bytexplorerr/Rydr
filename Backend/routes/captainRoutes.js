const express = require("express");
const captainRouter = express.Router();
const {body} = require("express-validator");
const captainController = require("../controllers/captainController");
const authMiddleware = require("../middlewares/authMiddleware");

captainRouter.post("/register",[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullName.firstName').isLength({min:3}).withMessage('First Name should be at least 3 characters long'),
    body('password').isLength({min:6}).withMessage('Password should be at least 6 characters long'),
    body('vehicle.color').isLength({min:3}).withMessage('Color of vehicle should be at least 3 characters long'),
    body('vehicle.plate').isLength({min:3}).withMessage('Number Plate should be at least 3 characters long'),
    body('vehicle.capacity').isInt({min:1}).withMessage('Vehicle capacity should be at least 1'),
    body('vehicle.vehicleType').isIn(['auto','car','motorcycle']).withMessage('Invalid Vehicle Type'),
],captainController.registerCaptain);

captainRouter.post("/login",[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password should be at least 6 characters long')
],captainController.loginCaptain);

captainRouter.get("/captain-profile",authMiddleware.authCaptain,captainController.getCaptainProfile);

captainRouter.post("/logout",authMiddleware.authCaptain,captainController.logoutCaptain);

captainRouter.get("/verify/:token",captainController.VerifyCaptain);

captainRouter.get("/verify-token/:token",captainController.VerifyCaptainToken);

captainRouter.post("/forgot-password",captainController.ForgotPassword);

captainRouter.get("/verify-reset-token/:token",captainController.VerifyPasswordResetToken);

captainRouter.post("/reset-password",captainController.ResetPassword);

module.exports = captainRouter;