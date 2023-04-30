import { UserInterface } from "../models/IUser";
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
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
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React from "react";
import { PostInterface } from "../models/IPost";
import { CategoryInterface } from "../models/ICategory";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from 'dayjs';

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
  const [OpenTime, setOpenTime] = useState<Dayjs | null>(dayjs(new Date));
  const [CloseTime, setCloseTime] = useState<Dayjs | null>(dayjs(new Date));
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }> //ชื่อคอมลัมน์คือ id และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
  ) => {
    const id = event.target.id as keyof typeof post; //

    const { value } = event.target;

    setPost({ ...post, [id]: value });
  };

  const handleChange = (event: SelectChangeEvent<String>) => {
    const name = event.target.name as keyof typeof post; //
    console.log("name", event.target.name);
    console.log("value", event.target.value);

    const { value } = event.target;

    setPost({ ...post, [name]: value });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let file;
    if (event.target.files && event.target.files.length > 0) {
      file = event.target.files[0];
    }
    setPost({ ...post, ["Picture" as keyof typeof post]: file });
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,

    reason?: string
  ) => {
    console.log(reason);
    if (reason === "clickaway") {
      return;
    }

    setSuccess(false);

    setError(false);
  };


  function submit() {
    const formData = new FormData(); 
    if (post.Picture) {
      formData.append("img", post.Picture);
      const apiUrl = "http://localhost:8080/upload";
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
            PostSavePost(res.data)
          } else {
            setError(true);
            setErrorMessage(res.error);
          }
          console.log(res);
        });
    }
  }
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, //การยืนยันตัวตน
      "Content-Type": "application/json",
    },
  };

  const PostSavePost = async (picURL: string) => {
    const data = {
      Topic: post.Topic ?? "",
      Price: Number(post.Price) ?? 0,
      Picture: picURL ?? "", 
      dayTimeOpen: OpenTime?.toISOString(),
      dayTimeClose: CloseTime?.toISOString(),
      Detail: post.Detail ?? "",
      CatetagoryID: Number(post.CategoryID) ?? 0,
    }
    
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, //การยืนยันตัวตน
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    };

    console.log(data)
  
    const apiUrl = "http://localhost:8080/postCreate";

    fetch(apiUrl , requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data){
        setSuccess(true);
      }else{
        setError(true);
        setErrorMessage(res.error);
      }
     
    })
  }
  const GetAllCategory = async () => {
    const apiUrl = "http://localhost:8080/category";

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);
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
      <Snackbar
        id="success"
        open={success}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success">
          Successfully
        </Alert>
      </Snackbar>
      <Snackbar
        id="error"
        open={error}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error">
          Failure !!!: {errorMessage}
        </Alert>
      </Snackbar>

      <Paper>
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
                    placeholder="wsdas"
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

                <FormControl fullWidth variant="outlined">
                  <Select
                    native
                    value={String(post.CategoryID) || ""}
                    inputProps={{
                      name: "CategoryID", //เอาไว้เข้าถึงข้อมูล
                    }}
                    onChange={handleChange}
                  >
                    <option>none</option>
                    {category.map((item: CategoryInterface) => (
                      <option value={item.ID} key={item.ID}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
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
                    placeholder="wsdas"
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
                      onChange={(value) => {
                        setOpenTime(value);
                      }} />
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
                      onChange={(value) => {
                        setCloseTime(value);
                      }} />
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
                  onChange={handleImageChange}
                />
                {post.Picture && (
                  <>
                    <Grid item xs={12}>
                      <img
                        src={URL.createObjectURL(post.Picture)}
                        alt=""
                        style={{ height: 200 }}
                      />
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
                <Button>ปักหมุด📍</Button>
              </Grid>
              <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                  <TextField
                    id="Price"
                    variant="outlined"
                    type="number"
                    size="medium"
                    placeholder="ราคา"
                    value={post.Price || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Divider />
            <Button onClick={submit}>SUBMIT</Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
}
export default PostCreate;
