import CircularProgress from "@mui/material/CircularProgress";
import {
    GoogleMap,
    useLoadScript,
    MarkerF,
    InfoWindowF,
  } from "@react-google-maps/api";
import meLocation from "../../assert/placeholder.png"
import React, { useEffect, useState, useCallback } from "react";
import { PostAllInterface } from "../../models/IPost";
import { Token } from "@mui/icons-material";
  const apikey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;


export default function MapLocation() {
    const [post,setPost] = useState<PostAllInterface[]>([])
    const [zoom, setZoom] = useState(12);
    const [lat, setLat] = useState(Number);
    const [lng, setLng] = useState(Number);
    const [cenLat, setCenLat] = useState(Number);
    const [cenLng, setCenLng] = useState(Number);
   const [loadLocation, setLoadLoacation] = useState(true)
    const mapContainerStyle = {
      width: "100vw",
      height: "90vh",
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
            setLoadLoacation(false);       
        }
      );
    }

    const GetAllPost = async (condition: string) => {
        const apiUrl = `http://localhost:8080/post?condition=${condition}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, //การยืนยันตัวตน
            "Content-Type": "application/json",
          },
        };
        fetch(apiUrl, requestOptions)
          .then((response) => response.json())
    
          .then((res) => {
    
            if (res.data) {
              setPost(res.data);
            } else {
              console.log(res.err);
            }
          });
      };
    useEffect(() => {
        //ทำงานทุกครั้งที่เรารีเฟชหน้าจอ
        //ไม่ให้รันแบบอินฟินิตี้ลูป
        var Token = window.localStorage.getItem("token")
        if (Token) {
          GetAllPost("notMe");
        } else {
          GetAllPost("all");
        }
        getPosition();
  
      }, []);
    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map: any) => {
      mapRef.current = map;
    }, []);
  
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: String(apikey),
      libraries: ["places"],
    });
  
    if (loadError) return <p>Error loading maps</p>;
    if (!isLoaded || loadLocation)
      return (
        <center >
          <p>loading maps</p>
          <CircularProgress color="success" />
        </center>
      );
  
   
    return (
      <div className="mapAllPost">
    
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={zoom}
          center={new google.maps.LatLng(
            cenLat,
            cenLng
          )}
          options={option}
          onLoad={onMapLoad}
         
        >
          <MarkerF 
          zIndex={10}
          icon={{
            url: meLocation,
           scaledSize: new window.google.maps.Size(60, 60),
            origin: new window.google.maps.Point(0, 0),

          }}
          position={
            new google.maps.LatLng(
                cenLat,
                cenLng
              )
          }
          ></MarkerF>

          {post.map((item:PostAllInterface) => (
             <MarkerF 
             icon={{
              url: item.user.profileURL,
              scaledSize: new window.google.maps.Size(60, 60),
               origin: new window.google.maps.Point(0, 0),
             }}
             position={
               new google.maps.LatLng(
                Number(item.lat),
                Number(item.lng)
                 )
             }
             ></MarkerF>
          ))}
        </GoogleMap>
      </div>
    );
  }
  
  
  