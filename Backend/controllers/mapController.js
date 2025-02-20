const { validationResult } = require("express-validator");
const mapService = require("../services/mapService");
const { map } = require("../app");

const getCoordinates = async (req,res,next)=>{


    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({error:errors.array()});
    }

    const {address} = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinates(address);
        return res.status(200).json(coordinates);
    } catch(err) {
        return res.status(404).json({message:'Coordinates Not Found!'})
    }
}

const getDistanceTime = async (req,res,next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({error:errors.array()});
        }

        const {origin,destination} = req.query;

        const distanceTime = await mapService.getDistanceTime(origin,destination);
        res.status(200).json(distanceTime);
    } catch(err) {
        return res.status(404).json({message:'Unable to fetch distance and time!'});
    }
}

const getAutoCompleteSuggestions = async (req,res,next)=> {
    try {
        const errors =  validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({error:errors.array()});
        }
        
        const {input} = req.query;
        const suggestions = await mapService.giveSuggestions(input);

        return res.status(200).json(suggestions);
    }catch(err) {
        return res.status(404).json({message:'Unable to give suggestions!'});
    }
}

module.exports = {getCoordinates,getDistanceTime,getAutoCompleteSuggestions};