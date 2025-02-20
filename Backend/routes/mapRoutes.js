const express = require("express");
const mapRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const mapController = require("../controllers/mapController");
const {query} = require("express-validator");

mapRouter.get("/get-coordinates-user",
                query('address').isString().isLength({min:3}).withMessage('Address should be at least 3 characters long'),
                authMiddleware.authUser,mapController.getCoordinates
            );

mapRouter.get("/get-coordinates-captain",
    query('address').isString().isLength({min:3}).withMessage('Address should be at least 3 characters long'),
    authMiddleware.authCaptain,mapController.getCoordinates
);

mapRouter.get("/get-distance-time-user",
                query('origin').isString().isLength({min:3}).withMessage('Origin Address should be at least 3 characters long'),
                query('destination').isString().isLength({min:3}).withMessage('Destination Address should be at least 3 characters long'),
                authMiddleware.authUser,mapController.getDistanceTime);

mapRouter.get("/get-distance-time-captain",
    query('origin').isString().isLength({min:3}).withMessage('Origin Address should be at least 3 characters long'),
    query('destination').isString().isLength({min:3}).withMessage('Destination Address should be at least 3 characters long'),
    authMiddleware.authCaptain,mapController.getDistanceTime);

mapRouter.get("/get-suggestions",
    query('input').isString().isLength({min:1}).withMessage('Address should be at least 3 charcaters long to find suggestions!'),
    authMiddleware.authUser,mapController.getAutoCompleteSuggestions
);

module.exports=mapRouter;