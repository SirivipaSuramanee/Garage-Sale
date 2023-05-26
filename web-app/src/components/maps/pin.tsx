import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {
    GoogleMap,
    useLoadScript,
    MarkerF,
    InfoWindowF,
  } from "@react-google-maps/api";

  import React, { useEffect, useState, useCallback } from "react";
  const apikey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

type Dataprops = {
  closeMap: () => void
  setLatLng: (lat: number, lng: number) => void;
};
  function MapPin({ setLatLng, closeMap }: Dataprops) {

    const [lat, setLat] = useState(Number);
    const [lng, setLng] = useState(Number);
    const [cenLat, setCenLat] = useState(Number);
    const [cenLng, setCenLng] = useState(Number);
    const [zoom, setZoom] = useState(12);
    const center = {
      lat: 13.752547578244073,
      lng: 100.49271903050739,
    };
    const onMapClick = (event:google.maps.MapMouseEvent) => {
      setLat(event.latLng?.lat() ?? center.lat)
      setLng(event.latLng?.lng ?? center.lng)
    }
   
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
          setLat(e.coords.latitude) 
          setLng(e.coords.longitude)    
          setCenLat(e.coords.latitude)
          setCenLng(e.coords.longitude)          

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
    useEffect(() => {
      //ทำงานทุกครั้งที่เรารีเฟชหน้าจอ
      //ไม่ให้รันแบบอินฟินิตี้ลูป
      getPosition();

    }, []);
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
          center={new google.maps.LatLng(
            cenLat,
            cenLng
          )}
          options={option}
          onLoad={onMapLoad}
          onClick={onMapClick}
        >
          <MarkerF 
          
          position={
            new google.maps.LatLng(
              lat,
              lng
            )
          }
          ></MarkerF>
        </GoogleMap>
        <button 
        className="button-pin-map"
        onClick={() => {
          setLatLng(lat,lng)
          closeMap()
        }}>
          ตกลง
        </button>
      </div>
    );
  }
  export default MapPin;
  
  
  