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
  width?: string;
    setOffLocation: () => void;
    lat: string;
    lng: string;
}

export default function PostLocation({setOffLocation ,lat ,lng ,width}:props) {

    
    const [zoom, setZoom] = useState(12);
    const center = {
      lat: Number(lat),
      lng: Number(lng),
    };
   
    const mapContainerStyle = {
      width: width ?? "80vw",
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
      <div className="map-location">
    
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
       {!width &&
       <div >
       <button 
        className="button-pin-map"
        onClick={() => {
            setOffLocation()
        }}>
          ปิด
        </button>
       </div>}
      </div>
    );
  }
  
  
  