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
import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";
import { PostInterface } from "../models/IPost";
import { CategoryInterface } from "../models/ICategory";

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
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }> //ชื่อคอมลัมน์คือ id และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
  ) => {
    const id = event.target.id as keyof typeof post; //

    const { value } = event.target;

    setPost({ ...post, [id]: value });
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: any }> //ชื่อคอมลัมน์คือ name และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
  ) => {
    const name = event.target.name as keyof typeof post; //
    console.log("name", event.target.name);
    console.log("value", event.target.value);

    const { value } = event.target;

    setPost({ ...post, [name]: value });
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
    let data = {
      //เก็บข้อมูลที่จะเอาไปเก็บในดาต้าเบส
      Topic: post.Topic ?? "",
      CategoryID: Number(post.CategoryID),
      Price: Number(post.Price) ?? "",
      Picture: post.Picture ?? "", //###############
      DayTime_Open: Date,
      DayTime_Close: Date,
      Detail: post.Detail ?? "",
    };
    console.log(data);

    const apiUrl = "http://localhost:8080/postCreate";
    const requestOptions = {
      method: "POST", //เอาข้อมูลไปเก็บไว้ในดาต้าเบส
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, //การยืนยันตัวตน
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    };

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.msg) {
          setSuccess(true);
        } else {
          setError(true);
          setErrorMessage(res.error);
        }
      });
  }
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, //การยืนยันตัวตน
      "Content-Type": "application/json",
    },
  };

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

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
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
                Create a post
              </Typography>
            </Box>
          </Box>
          {/* <Divider> */}
            <Grid container spacing={3} sx={{ padding: 2 }}>
              <Grid item xs={12}>
                <FormControl fullWidth variant="standard">
                  <p>หัวข้อ</p>
                  <TextField
                    id="Topic"
                    variant="outlined"
                    type="string"
                    size="medium"
                    value={post.Topic || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="standard">
                  <p>หมวดหมู่</p>
                  <TextField
                    id="Topic"
                    variant="outlined"
                    type="string"
                    size="medium"
                    value={post.Topic || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Grid>
            </Grid>
          {/* </Divider> */}
        </Paper>
      </Container>
    </>
  );
}
export default PostCreate;
