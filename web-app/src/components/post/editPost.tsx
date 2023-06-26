import { useEffect, useState } from "react";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { PostAllInterface, PostInterface } from "../../models/IPost";
import Dialog from "@mui/material/Dialog";
import PostLocation from "../maps/postLocation";
import { formatDateTime } from "../util/format";
import { CategoryInterface } from "../../models/ICategory";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import CheckboxesTags from "./component/Checkboxes";
import Button from "@mui/material/Button";
import MapPin from "../maps/pin";

type props = {
  Data: PostAllInterface;
  onChange: (v: boolean) => void;
};
export default function EditPost({ Data,onChange }: props) {
  const [favorites, setFavorites] = useState("inherit");
  const [CloseTime, setCloseTime] = useState<Dayjs | null>(dayjs(new Date()));
  const [onLocation, setOnLocation] = useState(false);
  const [selectImgIndex, setSelectImgIndex] = useState(0);
  const [post, setPost] = useState<Partial<PostInterface>>({});
  const [category, setCategory] = useState<CategoryInterface[]>([]);
  const [onPinMap, setOnPinMap] = useState(false);
  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }> //ชื่อคอมลัมน์คือ id และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
  ) => {
    const id = event.target.id as keyof typeof post; //

    const { value } = event.target;

    setPost({ ...post, [id]: value });
  };
  function initData() {
    var p: PostInterface = {
      ID: Data.id,
      Topic: Data.topic,
      Detail: Data.detail,
      lat: Data.lat,
      lng: Data.lng,
      category: Data.category,
    };
    setPost(p);
  }
  const GetAllCategory = async () => {
    const apiUrl = "http://localhost:8080/category";
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
          setCategory(res.data);
        } else {
          console.log(res.err);
        }
      });
  };

  const save = () => {
    const data = {
      ID: post.ID,
      topic: post.Topic ?? "",
      detail: post.Detail ?? "",
      lat: String(post.lat) ?? "",
      lng: String(post.lng) ?? "",
      category: post.category
    };

    const requestOptions = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, //การยืนยันตัวตน
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };



    const apiUrl = "http://localhost:8080/post";

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res == "update") {

          onChange(false)
        } 
      });
  }

  useEffect(() => {
    GetAllCategory();
    initData();
  }, []);
  return (
    <>
      <Dialog
        fullScreen
        open={onPinMap}
        onClose={(_, r) => {
          if (r === "backdropClick") setOnPinMap(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <MapPin
          lati={Number(post.lat)}
          lngi={Number(post.lng)}
          closeMap={() => {
            setOnPinMap(false);
          }}
          setLatLng={(lat, lng) => {
            setPost((prevPost) => ({
              ...prevPost,
              ["lat" as keyof typeof post]: lat,
              ["lng" as keyof typeof post]: lng,
            }));
          }}
        />
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
            <>
              <IconButton
                aria-label="settings"
                onClick={() => {
                  save()
                }}
              >
                <Typography variant="body1" sx={{ textAlign: "start" }}>
                   บันทึก
                </Typography>
              </IconButton>
            </>
          }
          title={post.Topic}
          subheader={dayjs(Data.CreatedAt).format("DD MMM, YYYY")}
        />
          <FormControl fullWidth variant="outlined">
            <TextField
              style={{ marginLeft: "10px" }}
              id="Topic"
              variant="outlined"
              type="string"
              size="medium"
              placeholder="กรุณากรอกหัวข้อ"
              value={post.Topic || ""}
              onChange={handleInputChange}
            />
          </FormControl>
        <div className="sizeBox"></div>
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
            {post.category?.map((item: CategoryInterface) => (
              <span className="tag">{item.name}</span>
            ))}
          </Typography>
          <div className="sizeBox"></div>
            <CheckboxesTags
              Data={category}
              setCategory={(value) =>
                setPost({ ...post, ["category" as keyof typeof post]: value })
              }
            />
          <br />
          <Typography variant="body1" sx={{ textAlign: "start" }}>
            {post.Detail}
          </Typography>
           
            <FormControl fullWidth variant="outlined">
              <TextField
                style={{ marginLeft: "10px" }}
                id="Detail"
                variant="outlined"
                type="string"
                size="medium"
                placeholder="กรุณากรอกหัวข้อ"
                value={post.Detail || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          
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
            <FormControl fullWidth variant="outlined">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateTimePicker"]}>
                  <DateTimePicker
                    value={CloseTime}
                    onChange={(value) => {
                      setCloseTime(value);
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </FormControl>
            <FormControl fullWidth variant="outlined">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateTimePicker"]}>
                  <DateTimePicker
                    value={CloseTime}
                    onChange={(value) => {
                      setCloseTime(value);
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </FormControl>
          </dd>
          <dd>
            <Typography variant="body1" sx={{ textAlign: "start" }}>
              {"เบอร์โทรติดต่อ: " + Data.user.tel}
            </Typography>
          </dd>
        </ul>
        <Button
          onClick={() => {
            setOnPinMap(true);
          }}
        >
          {post.lat ? "ปักหมุด📍(แก้ไขโลเคชั่น คลิกที่นี่!!)" : "ปักหมุด📍"}
        </Button>
        <div className="editMap">
          <PostLocation
            width={"70vh"}
            setOffLocation={() => {}}
            lat={post.lat!}
            lng={post.lng!}
          ></PostLocation>
        </div>
      </Card>
    </>
  );
}
