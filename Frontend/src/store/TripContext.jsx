import React, { useState } from 'react'
import { createContext } from 'react'

export const TripInfoContext = createContext();

const TripContext = ({children}) => {

    const [pickupLocation, setPickupLocation] = useState("");
    const [dropoffLocation, setDropoffLocation] = useState("");
    const [showVehicles,setShowVehicles] = useState(false);
    const [serachCaptain,setSearchCaptain] = useState(false);
    const [tripInfo,setTripInfo] = useState(null);
    const [availableRides,setAvailableRides] = useState([]);
    const [rideConfirmed,setRideConfirmed] = useState(false);
    const [showChats,setShowChats] = useState(false);

    const [pickupCoordinates,setPickupCoordinates] = useState(null);
    const [destinationCoordinates,setDestinationCoordinates] = useState(null);
    const [captainCoordinates,setCaptainCoordinates] = useState(null);

  return (
    <TripInfoContext.Provider 
        value={{pickupLocation,setPickupLocation,
                dropoffLocation,setDropoffLocation,
                showVehicles,setShowVehicles,
                serachCaptain,setSearchCaptain,
                tripInfo,setTripInfo,
                availableRides,setAvailableRides,
                rideConfirmed,setRideConfirmed,
                showChats,setShowChats,
                pickupCoordinates,setPickupCoordinates,
                destinationCoordinates,setDestinationCoordinates,
                captainCoordinates,setCaptainCoordinates,
                }}>
        {children}
    </TripInfoContext.Provider>
  )
}

export default TripContext
