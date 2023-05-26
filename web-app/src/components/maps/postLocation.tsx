import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {
    GoogleMap,
    useLoadScript,
    MarkerF,
    InfoWindowF,
  } from "@react-google-maps/api";
import { type } from "os";

  import React, { useEffect, useState, useCallback } from "react";
import { PostAllInterface } from "../../models/IPost";
  const apikey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;


type props = {
    setOffLocation: () => void;
    Data: PostAllInterface;
}

export default function PostLocation({setOffLocation,Data}:props) {

    
    const [zoom, setZoom] = useState(12);
    const center = {
      lat: Number(Data.lat),
      lng: Number(Data.lng),
    };
   
    const mapContainerStyle = {
      width: "80vh",
      height: "80%",
    };
  
    const option = {
      
      disableDefaultUI: true,
      zoomControl: true,
    };
    const getPosition = async () => {
        navigator.geolocation.getCurrentPosition( 
        (e) => {
                   

        }
      );
    }
    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map: any) => {
      mapRef.current = map;
    }, []);
  
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: String(apikey),
      libraries: ["places"],
    });
  
    if (loadError) return <p>Error loading maps</p>;
    if (!isLoaded)
      return (
        <p>
          loading maps
          <CircularProgress color="success" />
        </p>
      );
  
   
    return (
      <div className="map-pin">
    
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={zoom}
          center={center}
          options={option}
          onLoad={onMapLoad}
         
        >
          <MarkerF 
          
          position={
            center
          }
          ></MarkerF>
        </GoogleMap>
        <button 
        className="button-pin-map"
        onClick={() => {
            setOffLocation()
        }}>
          ปิด
        </button>
      </div>
    );
  }
  
  
  