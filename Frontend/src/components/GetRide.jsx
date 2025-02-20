import React, { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { TripInfoContext } from "../store/TripContext";
import axios from "axios";

const GetRide = ({setScrollTriggers}) => {

      const [activeInput, setActiveInput] = useState(null);
      const [suggestionsList, setSuggestionsList] = useState([]);
      const containerRef = useRef(null);
      const {pickupLocation,setPickupLocation,dropoffLocation,setDropoffLocation,setShowVehicles,setSearchCaptain,setTripInfo,setRideConfirmed} = useContext(TripInfoContext);


      // Fetch locations from backend
      const fetchLocations = async (query) => {
        if (!query) {
          setSuggestionsList([]);
          return;
        }
        try {
          //extracting the token from cookie
          const token = document.cookie.split('; ').find((row)=> row.startsWith('token=')).split('=')[1];

          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions?input=${query}`,{
            headers:{
              Authorization:`Bearer ${token}`,
            },
            withCredentials:true,
          });

          if(response.status === 200) {
            setSuggestionsList(response.data.map(item=> item.description));
          } else {
            setSuggestionsList([]);
          }
        } catch (error) {
          console.error("Error fetching locations:", error);
          setSuggestionsList([]);
        }
      };
        
    
      useEffect(() => {
        if (activeInput === "pickup") {
          fetchLocations(pickupLocation);
        } else if (activeInput === "dropoff") {
          fetchLocations(dropoffLocation);
        }
      }, [pickupLocation, dropoffLocation, activeInput]);
    
      // Close suggestions when clicking outside
      useEffect(() => {
        const handleClickOutside = (event) => {
          if (containerRef.current && !containerRef.current.contains(event.target)) {
            setSuggestionsList([]);
            setActiveInput(null);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);
    
      const handleSelectSuggestion = (value) => {
        if (activeInput === "pickup") {
          setPickupLocation(value);
        } else if (activeInput === "dropoff") {
          setDropoffLocation(value);
        }

        // Immedately clear the sugesstions before the input updates
        setSuggestionsList([]);

        // Delay clearing the suggestions to allow click event to process
        setTimeout(() => setActiveInput(null), 0);
      };
    
      const handleSubmit = (event)=>{
        event.preventDefault();
        setShowVehicles(true);
        setTripInfo(null);
        setSearchCaptain(false);
        setRideConfirmed(false);

        setScrollTriggers((prev)=> !prev);
      }

  return (
    <div className="w-[25%] max-md:w-[90%]">
        <aside ref={containerRef} className="m-1 rounded-2xl p-1 bg-gray-900 shadow-sm shadow-gray-200">
            <h1 className="text-3xl font-semibold text-center my-4">Get a Ride</h1>
            <form className="p-4 rounded-2xl flex flex-col items-center" onSubmit={handleSubmit}>
            {/* Pickup Location */}
            <div
                className="relative flex border border-white rounded-md my-2 p-1 shadow-sm shadow-gray-200 focus-within:border-[#8136E2] focus-within:shadow-[#8136E2]"
                onClick={() => setActiveInput("pickup")}
            >
                <img src={assets.pickup} alt="pickup_image" />
                <input
                type="text"
                placeholder="Pickup location"
                className="outline-0 px-1.5 p-0.5 w-full bg-transparent"
                value={pickupLocation}
                onChange={(event) => setPickupLocation(event.target.value)}
                required
                />
                {activeInput === "pickup" && suggestionsList.length > 0 && (
                <div className="absolute left-0 w-full bg-gray-950 border border-[#8136E2] rounded-md shadow-sm shadow-gray-200 top-12 z-10 max-h-[500px] overflow-y-auto">
                    {suggestionsList.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleSelectSuggestion(item)}
                        className="flex gap-x-2 mx-1 my-3 p-2 items-center cursor-pointer rounded-sm hover:bg-[#8136E2] transition"
                    >
                        <img src={assets.location_on} alt="location_icon" />
                        <p>{item}</p>
                    </div>
                    ))}
                </div>
                )}
            </div>

            {/* Dropoff Location */}
            <div
                className="relative flex border border-white rounded-md my-6 p-1 shadow-sm shadow-gray-200 focus-within:border-[#8136E2] focus-within:shadow-[#8136E2]"
                onClick={() => setActiveInput("dropoff")}
            >
                <img src={assets.drop} alt="drop_image" />
                <input
                type="text"
                placeholder="Dropoff location"
                className="outline-0 px-1.5 p-0.5 w-full bg-transparent"
                value={dropoffLocation}
                onChange={(event) => setDropoffLocation(event.target.value)}
                required
                />
                {activeInput === "dropoff" && suggestionsList.length > 0 && (
                <div className="absolute left-0 w-full bg-gray-950 border border-[#8136E2] rounded-md shadow-sm shadow-gray-200 top-12 z-10 max-h-[500px] overflow-y-auto">
                    {suggestionsList.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleSelectSuggestion(item)}
                        className="flex gap-x-2 mx-1 my-3 p-2 items-center cursor-pointer rounded-sm hover:bg-[#8136E2] transition"
                    >
                        <img src={assets.location_on} alt="location_icon" />
                        <p>{item}</p>
                    </div>
                    ))}
                </div>
                )}
            </div>

            {/* Search Button */}
            <button type="submit" className="bg-[#8136E2] py-2 px-4 font-semibold rounded-2xl cursor-pointer">
                Search
            </button>
            </form>
        </aside>
    </div>
  )
}

export default GetRide