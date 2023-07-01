import { useEffect, useState } from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { SelectChangeEvent } from "@mui/material/Select";
import React from "react";
import { PostInterface } from "../../models/IPost";
import { CategoryInterface } from "../../models/ICategory";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import MapPin from "../maps/pin";
import Dialog from "@mui/material/Dialog";
import CheckboxesTags from "./component/Checkboxes";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,

  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function PostCreate() {
  const [post, setPost] = useState<Partial<PostInterface>>({}); //Partial ชิ้นส่วนเอาไว้เซทข้อมูลที่ละส่วน
  const [category, setCategory] = useState<CategoryInterface[]>([]);
  const [success, setSuccess] = useState(false); //จะยังไม่ให้แสดงบันทึกข้อมูล
  const [error, setError] = useState(false);
  const [OpenTime, setOpenTime] = useState<Dayjs | null>(dayjs(new Date()));
  const [CloseTime, setCloseTime] = useState<Dayjs | null>(dayjs(new Date()));
  const [errorMessage, setErrorMessage] = useState("");
  const [onPinMap, setOnPinMap] = useState(false);

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }> //ชื่อคอมลัมน์คือ id และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
  ) => {
    const id = event.target.id as keyof typeof post; //

    const { value } = event.target;

    setPost({ ...post, [id]: value });
  };

  const handleChange = (event: SelectChangeEvent<String>) => {
    const name = event.target.name as keyof typeof post; //
    

    const { value } = event.target;

    setPost({ ...post, [name]: value });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = [];
    if (event.target.files && event.target.files.length > 0) {
      for (let index = 0; index < event.target.files.length; index++) {
        files.push(event.target.files[index]);
      }
    }
    setPost({ ...post, ["Picture" as keyof typeof post]: files });
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,

    reason?: string
  ) => {

    if (reason === "clickaway") {
      return;
    }
    if (success){
      setSuccess(false);
      window.location.href = "/"
    }
    

    setError(false);
  };

  function submit() {
   
    if (post.Picture) {
      const formData = new FormData();
      post.Picture.forEach((value,index)=> {
        formData.append(`img${index+1}`, value);
      }) 

      const apiUrl = `http://localhost:8080/uploads?len=${post.Picture.length.toString()}`;
      const requestOptions = {
        method: "POST", //เอาข้อมูลไปเก็บไว้ในดาต้าเบส
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, //การยืนยันตัวตน
        },
        body: formData,
      };
      fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          if (res.data) {
            PostSavePost(res.data);
          } else {
            setError(true);
            setErrorMessage(res.error);
          }

        });
    }else {
      setError(true);
      setErrorMessage("กรุณาอัพโหลดรูปภาพสินค้า");
    }
  }
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, //การยืนยันตัวตน
      "Content-Type": "application/json",
    },
  };

  const PostSavePost = async (picURL: string[]) => {
    const data = {
      topic: post.Topic ?? "",
      picture: picURL ?? "",
      dayTimeOpen: OpenTime?.toISOString(),
      dayTimeClose: CloseTime?.toISOString(),
      detail: post.Detail ?? "",
      email: localStorage.getItem("email"),
      lat: String(post.lat) ?? "",
      lng: String(post.lng) ?? "",
      category: post.category
    };
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, //การยืนยันตัวตน
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };



    const apiUrl = "http://localhost:8080/postCreate";

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res == "posted") {
          setSuccess(true);          
        } else {
          setError(true);
          setErrorMessage(res.error);
        }
      });
  };
  const GetAllCategory = async () => {
    const apiUrl = "http://localhost:8080/category";

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
  
  useEffect(() => {
    //ทำงานทุกครั้งที่เรารีเฟชหน้าจอ
    //ไม่ให้รันแบบอินฟินิตี้ลูป
    GetAllCategory();
  }, []);

 
  const ClearImage = () => {
    setPost({ ...post, ["Picture" as keyof typeof post]: undefined });
  };

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
        closeMap={
          () => {
            setOnPinMap(false)
          }
        }
        setLatLng={
          (lat,lng)=>{
            setPost((prevPost) => ({
              ...prevPost,
              ["lat" as keyof typeof post]: lat,
              ["lng" as keyof typeof post]: lng,
            }));
          }
        }
        ></MapPin>
      </Dialog>

      <Snackbar
        id="success"
        open={success}
        autoHideDuration={1000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success">
          เปิดบ้านสำเร็จ
        </Alert>
      </Snackbar>
      <Snackbar
        id="error"
        open={error}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error">
          Failure: {errorMessage}
        </Alert>
      </Snackbar>

      <Paper  style={{textAlign:"center"}}>
        <Box
          display="flex"
          sx={{
            marginTop: 2,
          }}
        >
          <Box sx={{ paddingX: 2, paddingY: 1 }}>
            <Typography
              component="h1"
              variant="h6"
              color="primary"
              gutterBottom
            >
              สร้างโพสต์เปิดบ้าน
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography
                  component="h1"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                  หัวข้อ
                </Typography>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    id="Topic"
                    variant="outlined"
                    type="string"
                    size="medium"
                    placeholder="กรุณากรอกหัวข้อ"
                    value={post.Topic || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <Typography
                  component="h1"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                  หมวดหมู่
                </Typography>
                <CheckboxesTags
                Data={category}
                setCategory={(value) =>
                  setPost({ ...post, ["category" as keyof typeof post]: value })
                }
                />

              </Grid>

              <Grid item xs={12}>
                <Typography
                  component="h1"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                  รายละเอียด
                </Typography>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    id="Detail"
                    variant="outlined"
                    type="string"
                    size="medium"
                    placeholder="กรุณากรอกรายละเอียดเพิ่มเติม เช่น สภาพการใช้งาน เบอร์โทรติดต่อ และอื่น ๆ เป็นต้น"
                    value={post.Detail || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <Typography
                    component="h1"
                    variant="h6"
                    color="primary"
                    gutterBottom
                  >
                    วันที่และเวลาเปิดบ้าน
                  </Typography>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateTimePicker"]}>
                      <DateTimePicker
                        value={OpenTime}
                        minDate={dayjs(new Date())}
                        maxDate={CloseTime}
                        onChange={(value) => {
                          setOpenTime(value);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <Typography
                    component="h1"
                    variant="h6"
                    color="primary"
                    gutterBottom
                  >
                    วันที่และเวลาปิดบ้าน
                  </Typography>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateTimePicker"]}>
                      <DateTimePicker
                        value={CloseTime}
                        minDate={OpenTime}
                        onChange={(value) => {
                          setCloseTime(value);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </FormControl>

                <br />
              </Grid>
              <Grid item xs={6}>
                <Typography
                  component="h1"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                  รูปภาพสินค้า
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  multiple={true}
                  onChange={handleImageChange}
                />
                {post.Picture && (
                  <>
                    <Grid item xs={12}>
                     
                      {post.Picture.map((item) => (
                        <img
                        src={URL.createObjectURL(item)}
                        alt={item.name}
                        style={{ height: 200 }}
                      />
                      ))}
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        onClick={() => {
                          ClearImage();
                        }}
                      >
                        ลบรูป
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
              <Grid item xs={6}>
                <Typography
                  component="h1"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                  ที่อยู่
                </Typography>
                <Button
                  onClick={() => {
                    setOnPinMap(true);
                  }}
                >
                  {post.lat ? "ปักหมุด📍(ปักหมุดแล้ว)" : "ปักหมุด📍"}
                </Button>
              </Grid>
            </Grid>
            <br />
            <Divider />
            <Button  onClick={submit}>SUBMIT</Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
}
export default PostCreate;
