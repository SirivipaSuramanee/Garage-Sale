import { UserInterface } from "../models/IUser";
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Alert, { AlertProps } from "@mui/material/Alert";
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
import { Navigate } from "react-router-dom";



export default function Login() {
  const [register, setRegister] = useState<Partial<UserInterface>>({}); //Partial ชิ้นส่วนเอาไว้เซทข้อมูลที่ละส่วน
  const [success, setSuccess] = useState(false); //จะยังไม่ให้แสดงบันทึกข้อมูล
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }> //ชื่อคอมลัมน์คือ id และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
  ) => {
    const id = event.target.id as keyof typeof register; //
  

    const { value } = event.target;

    setRegister({ ...register, [id]: value });
    console.log(value)
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: any }> //ชื่อคอมลัมน์คือ name และค่าที่จะเอามาใส่ไว้ในคอมลัมน์นั้นคือ value
  ) => {
    const name = event.target.name as keyof typeof register; //
    console.log("name", event.target.name);
    console.log("value", event.target.value);

    const { value } = event.target;

    setRegister({ ...register, [name]: value });
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
      userName: register.UserName ?? "",
      password: register.Password ?? "",
    };
   

    const apiUrl = "http://localhost:8080/login";
    const requestOptions ={
      method: "POST",
      body: JSON.stringify(data), 
    };
    let active = false;
     fetch(apiUrl,requestOptions)
    .then((res) => res.json())
    .then((res) => {
      if (res.data) {
        localStorage.setItem("token", res.data.Token)
        localStorage.setItem("email", res.data.Email)
        setSuccess(true)
        active = true;
      }else{
        setError(true)
        setErrorMessage(res.error)
      }
    }).finally(() => {
      console.log(active)
      console.log(localStorage.getItem("token"))
      if (active && localStorage.getItem("email") && localStorage.getItem("token")) {
        window.location.href = "/";
      }
    })

   
 
  }

  

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

        <Paper
          sx={{      
            padding: 13,
          }}
        >
          <img
            src="https://www.immihelp.com/assets/cms/yard-sale-garage-sale-shopping-tips.jpg"
            alt=""
            width="80%"
            height="80%"
          />
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Box
              display="flex"
              sx={{
                padding: 3,
                alignItems: "center",

                textAlign: "center",
              }}
            >
              <Typography variant="h4" color="#1976d2">
                Login
              </Typography>
            </Box>
            <Divider />
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  id="UserName"
                  variant="outlined"
                  label="Username"
                  type="string"
                  size="medium"
                  value={register.UserName || ""}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  id="Password"
                  variant="outlined"
                  label="Password"
                  type="string"
                  size="medium"
                  value={register.Password || ""}
                  onChange={handleInputChange}
                />
                
              </Grid>
            </Grid>
            <Divider />
            <Stack spacing={10} padding={5}>
              <Button onClick={submit} variant="contained" color="info">
                LOGIN
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}


