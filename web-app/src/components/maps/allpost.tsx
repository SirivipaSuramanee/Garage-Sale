import CircularProgress from "@mui/material/CircularProgress";
import {
    GoogleMap,
    useLoadScript,
    MarkerF,
  } from "@react-google-maps/api";
  import dayjs, { Dayjs } from "dayjs";
import meLocation from "../../assert/placeholder.png"
import React, { useEffect, useState, useCallback } from "react";
import { PostAllInterface } from "../../models/IPost";
import { useNavigate } from 'react-router-dom';
import TemporaryDrawer from "./fillterMap";
const apikey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

type MapLocationProps = {
  onViewPost: (value: PostAllInterface) => void;
};
export default function MapLocation({ onViewPost } : MapLocationProps) {
    const [post,setPost] = useState<PostAllInterface[]>([])
    const [postTemp,setPostTemp] = useState<PostAllInterface[]>([])
    const [zoom, setZoom] = useState(12);
    const [cenLat, setCenLat] = useState(Number);
    const [cenLng, setCenLng] = useState(Number);
    const [loadLocation, setLoadLoacation] = useState(true)
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState<string[]>([])
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(new Date()));
    const [endDate, setEndDate] = useState<Dayjs | null>();
  const handleDrawerOpen = () => {
    setOpen(true);
  };
    const mapContainerStyle = {
      width: "100vw",
      height: "90vh",
    };
    const navigate = useNavigate();
  
    const option = {
      
      disableDefaultUI: true,
      zoomControl: true,
    };
    const getPosition = async () => {
        navigator.geolocation.getCurrentPosition( 
        (e) => {   
            setCenLat(e.coords.latitude)
            setCenLng(e.coords.longitude)  
            setLoadLoacation(false);       
        }
      );
    }

    const GetAllPost = async (condition: string) => {

    var start_date = startDate?.endOf("day").toISOString();
    var end_date = endDate?.endOf("day").toISOString()
    const apiUrl = `http://localhost:8080/post?condition=${condition}&startDate=${start_date ?? ""}&endDate=${end_date ?? ""}`;
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
              setPostTemp(res.data);
            } else {
              setPostTemp([])
              setPost([]);
            }
          });
      };

      function filterCategories(p: PostAllInterface, categoryList: string[]) {
        for (var i of p.category) {
         if (categoryList.includes(i.name)){
           return true
         }
        }
        return false
       }
       useEffect(() => {
         if (filter && filter.length > 0) {
          
           var ft = postTemp.filter((p) => filterCategories(p, filter))
           setPost(ft)
         }else {
           setPost(postTemp)
         }
        
        
       }, [filter]);
    useEffect(() => {
        //ทำงานทุกครั้งที่เรารีเฟชหน้าจอ
        //ไม่ให้รันแบบอินฟินิตี้ลูป
        getPosition();
        var Token = window.localStorage.getItem("token")
        if (Token) {
          GetAllPost("notMe");
        } else {
          GetAllPost("all");
        }
      }, []);

      useEffect(() => {
        var Token = window.localStorage.getItem("token")
        if (Token) {
          GetAllPost("notMe");
        } else {
          GetAllPost("all");
        }
      }, [startDate, endDate]);
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
        <div className="filterMap">
          <button onClick={handleDrawerOpen}>filter</button>
        </div>
        <TemporaryDrawer open={open} setOpen={setOpen} filter={(v) =>{setFilter(v)} 
        }
        startDate={setStartDate}
        endDate={setEndDate}
       ></TemporaryDrawer>
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
             onClick={() => {
              onViewPost(item)
              navigate('/post', { replace: false });
             }}
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
  
  
  