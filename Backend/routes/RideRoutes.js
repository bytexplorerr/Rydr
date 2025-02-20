const express = require("express");
const RideRouter = express.Router();
const {body,query} = require("express-validator");
const rideController = require("../controllers/RideController");
const authMiddleware = require("../middlewares/authMiddleware");

RideRouter.post("/create",authMiddleware.authUser,
    body('pickup').isString().isLength({min:3}).withMessage('Invalid Pickup address'),
    body('drop').isString().isLength({min:3}).withMessage('Invalid Drop address'),
    body('vehicleType').isString().isIn(['car','motorcycle','auto']).withMessage('Invalid Vehicle Type'),
    rideController.createNewRide
)

RideRouter.get("/get-fare",
    query('pickup').isString().isLength({min:3}).withMessage('Pickup Address should be at least 3 characters long'),
    query('drop').isString().isLength({min:3}).withMessage('Drop Address should be at least 3 characters long')
    ,authMiddleware.authUser,rideController.getFareInfo);

RideRouter.delete("/cancel-ride",authMiddleware.authUser,rideController.cancelRide);

RideRouter.delete("/delete-ride",authMiddleware.authUser,rideController.deleteRide);

RideRouter.post("/captain-ride-confirm",authMiddleware.authCaptain,rideController.confirmRide);

RideRouter.post("/distance-from-user",authMiddleware.authCaptain,rideController.distanceFromUser);

RideRouter.post("/captain-cancel-ride",authMiddleware.authCaptain,rideController.captainCancelRide);

RideRouter.post("/chats",rideController.sendMessage);

RideRouter.post("/verify-otp",rideController.verifyOTP);

RideRouter.delete("/ride-completed",rideController.finishRide);

RideRouter.post("/update-captain-location",rideController.updateCaptainLocation)

module.exports = RideRouter;