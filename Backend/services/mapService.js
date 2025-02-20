const axios = require("axios");
const captainModel = require("../models/captainModel");

const getAddressCoordinates = async (address)=>{

    const API_KEY = process.env.GOOGLE_MAP_API_KEY;
    console.log(API_KEY);
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;

    try {
        const response = await axios.get(URL);
        if(response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                lat:location.lat,
                lng:location.lng
            };
        } else {
            throw new Error('Unable to Fetch Coordinates');
        }
    } catch(err) {
        console.log(err);
        throw err;
    }
}

const getDistanceTime = async (origin,destination)=>{
    if(!origin || !destination) {
        throw new Error('Origin and Destination are required!');
    }

    if(typeof origin === 'object') {
        origin = `${origin.lat},${origin.lng}`;
    } 

    if(typeof destination === 'object') {
        destination = `${destination.lat},${destination.lng}`;
    }

    const API_KEY = process.env.GOOGLE_MAP_API_KEY;
    const URL = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${API_KEY}`;

    try {
        const response = await axios.get(URL);
        if(response.data.status === 'OK') {

            if(response.data.rows[0].elements[0].status === 'ZERO_RESULTS') {
                throw new Error('No Routes Found!');
            }
            return response.data.rows[0].elements[0];
        } else {
            throw new Error('Unable to fetch distance and time!');
        }
    } catch(err) {
        console.log(err);
        throw err;
    }
}

const giveSuggestions = async (inputAddress) => {
    if(!inputAddress) {
        throw new Error('Address field is required!');
    }
     
    try {

        const API_KEY = process.env.GOOGLE_MAP_API_KEY;
        const URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(inputAddress)}&types=address&key=${API_KEY}`;

        const response = await axios.get(URL);
        if(response.data.status === 'OK') {
            return response.data.predictions;
        } else {
            throw new Error('Unable to fetch suggestions!');
        }

    } catch(err) {
        console.log(err);
        throw err;
    }
}

const getCaptainsInRadius = async (ltd,lng,radius)=>{

    // radius in K.M.
    try {
        const captains = await captainModel.find({
            location:{
                $geoWithin:{
                    $centerSphere:[[ltd,lng],radius / 6731]
                }
            }
        });
    
        return captains;
    } catch(err) {
        console.log('Error in fetching in radius : ',err);
        throw err;
    }

}

module.exports = {getAddressCoordinates,getDistanceTime,giveSuggestions,getCaptainsInRadius}