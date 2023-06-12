import { useEffect, useState } from "react";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { PostAllInterface } from "../../models/IPost";
import CardActions from "@mui/material/CardActions";

import FavoriteIcon from "@mui/icons-material/Favorite";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import PostLocation from "../maps/postLocation";
import { formatDateTime } from "../util/format";
import { CategoryInterface } from "../../models/ICategory";

type props = {
  Data: PostAllInterface;
};

export function Post({ Data }: props) {
  const [favorites, setFavorites] = useState("inherit");
  const [onLocation, setOnLocation] = useState(false);
  const [selectImgIndex, setSelectImgIndex] = useState(0);

  const likePost = async (id: number) => {
    const data = {
      postId: id,
    };
    console.log(data);
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
          console.log("like posted");
        }
      });
  };

  const unlikePost = async (id: number) => {
    const data = {
      postId: id,
    };
    console.log(data);
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
          console.log("like posted");
        }
      });
  };
  useEffect(() => {
    if (Data.like) {
      setFavorites("red");
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

        <div className="slideshow-container">
          {Data.picture.map((item, index) => (
            <div
              className="mySlides fade"
              style={{ display: selectImgIndex == index ? "block" : "none" }}
            >
              <div className="numbertext">
                {index + 1} / {Data.picture.length}
              </div>
              <img className="postImg" src={item.Url} />
            </div>
          ))}

          <a
            className="prev"
            onClick={() => {
              if (selectImgIndex == 0) {
                setSelectImgIndex(Data.picture.length - 1);
              } else {
                setSelectImgIndex((prev) => prev - 1);
              }
            }}
          >
            &#10094;
          </a>
          <a
            className="next"
            onClick={() => {
              if (selectImgIndex == Data.picture.length - 1) {
                setSelectImgIndex(0);
              } else {
                setSelectImgIndex((prev) => prev + 1);
              }
            }}
          >
            &#10095;
          </a>
        </div>
        <br />

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
      
        <ul>
        <Typography variant="body1" sx={{ textAlign: "start" }}>
             รายละเอียด
            </Typography>
          <dd>
            <Typography variant="body1" sx={{ textAlign: "start" }}>
              เวลาเปิดบ้าน: {formatDateTime(Data.dayTimeOpen)} ถึง{" "}
              {formatDateTime(Data.dayTimeClose)}
            </Typography>
          </dd>
          <dd>
            <Typography variant="body1" sx={{ textAlign: "start" }}>
              {"เบอร์โทรศัพท์: " + Data.user.tel}
            </Typography>
          </dd>
        </ul>

        <CardActions>
          <IconButton
            aria-label="add to favorites"
            onClick={() => {
              if (favorites === "red") {
                setFavorites("inherit");
                unlikePost(Data.id);
              } else {
                likePost(Data.id);
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
