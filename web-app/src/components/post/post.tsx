import { useEffect, useState } from "react";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { PostAllInterface } from "../../models/IPost";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";

import FavoriteIcon from "@mui/icons-material/Favorite";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import PostLocation from "../maps/postLocation";
import { formatDateTime } from "../util/format";
import { CategoryInterface } from "../../models/ICategory";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

type props = {
  Data: PostAllInterface;
};

export function Post({ Data }: props) {
  const [favorites, setFavorites] = useState("inherit");
  const [onLocation, setOnLocation] = useState(false);

  const likePost = async (id: number) => {
    const data = {
      postId: id,
    };
    console.log(data)
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, //การยืนยันตัวตน
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };



    const apiUrl = "http://localhost:8080/favorite";

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res == "like posted") {
          console.log("like posted")
        } 
      });
  };

  const unlikePost = async (id: number) => {
    const data = {
      postId: id,
    };
    console.log(data)
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, //การยืนยันตัวตน
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };



    const apiUrl = "http://localhost:8080/favorite";

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res == "like posted") {
          console.log("like posted")
        } 
      });
  };
  useEffect(() => {
    if (Data.like){
      setFavorites("red")
    }
  }, []);

  return (
    <>
      <Dialog open={onLocation}>
        <PostLocation Data={Data} setOffLocation={() => setOnLocation(false)} />
      </Dialog>
      <Card
        component="div"
        sx={{
          padding: 1,
          marginLeft: 1,
          marginRight: 1,

          "&:hover": {
            backgroundColor: "#C9DFEC",
            opacity: [0.9, 0.8, 0.7],
          },
        }}
      >
        <CardHeader
          className="topic"
          avatar={
            <Avatar alt={String(Data.id)} src={Data.user.profileURL}></Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={Data.topic}
          subheader={dayjs(Data.CreatedAt).format("DD MMM, YYYY")}
        />
        {/* <CardMedia
        component="img"
        className="css-o69gx8-MuiCardMedia-root"
        image={Data.picture[0].Url}
        alt="Paella dish"
      /> */}

        <ImageList sx={{ height: 350 }} cols={3} rowHeight={164}>
          {Data.picture.map((item) => (
            <ImageListItem key={item.ID}>
              <img
                src={`${item.Url}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${item.Url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                //alt={item.title}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
        <CardContent>
          <Typography variant="body2">
            หมวดหมู่:{" "}
            {Data.category.map((item: CategoryInterface) => (
              <span className="tag">{item.name}</span>
            ))}
          </Typography>
          <br />
          <Typography variant="body1" sx={{ textAlign: "start" }}>
            {Data.detail}
          </Typography>
        </CardContent>
        <Typography variant="body1" sx={{ textAlign: "start" }}>
          เวลาเปิดบ้าน: {formatDateTime(Data.dayTimeOpen)} ถึง{" "}
          {formatDateTime(Data.dayTimeClose)}
        </Typography>

        <CardActions>
          <IconButton
            aria-label="add to favorites"
            onClick={() => {
              if (favorites === "red") {
                setFavorites("inherit");
                unlikePost(Data.id)
              } else {
                likePost(Data.id)
                setFavorites("red");
              }
            }}
          >
            <FavoriteIcon sx={{ color: favorites }} />
          </IconButton>
          <IconButton
            aria-label="add to location"
            onClick={() => setOnLocation(true)}
          >
            <LocationOnIcon />
          </IconButton>
        </CardActions>
      </Card>
    </>
  );
}
