import { UserInterface } from "../models/IUser";
import { useState } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React from "react";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function RegisterCreate() {
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
      firstName: register.FirstName ?? "",
      lastName: register.LastName ?? "",
      tel: register.Tel ?? "",
      email: register.Email ?? "",
      userName: register.UserName ?? "",
      password: register.Password ?? "",
    };

    const apiUrl = "http://localhost:8080/registerCreate";
    const requestOptions = {
      method: "POST",
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
  return (
    <>
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
            padding: 4,
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
                Register
              </Typography>
            </Box>
          
            <Grid container spacing={4}>
              <Grid item xs={6}>
                {/* <FormControl fullWidth variant="outlined">
                  <p>Firstname</p> */}
                <TextField
                  id="FirstName"
                  variant="outlined"
                  label="Firstname"
                  type="string"
                  size="medium"
                  value={register.FirstName || ""}
                  onChange={handleInputChange}
                />
                {/* </FormControl> */}
              </Grid>

              <Grid item xs={6}>
                {/* <FormControl fullWidth variant="standard">
                  <p>Lastname</p> */}
                <TextField
                  id="LastName"
                  variant="outlined"
                  label="Lastname"
                  type="string"
                  size="medium"
                  value={register.LastName || ""}
                  onChange={handleInputChange}
                />
                {/* </FormControl> */}
              </Grid>

              <Grid item xs={6}>
                {/* <FormControl fullWidth variant="standard">
                  <p>Tel</p> */}
                <TextField
                  id="Tel"
                  variant="outlined"
                  label="Tel"
                  type="string"
                  size="medium"
                  value={register.Tel || ""}
                  onChange={handleInputChange}
                />
                {/* </FormControl> */}
              </Grid>

              <Grid item xs={6}>
                {/* <FormControl fullWidth variant="standard">
                  <p>Email</p> */}
                <TextField
                  id="Email"
                  variant="outlined"
                  label="Email"
                  type="string"
                  size="medium"
                  value={register.Email || ""}
                  onChange={handleInputChange}
                />
                {/* </FormControl> */}
              </Grid>

              <Grid item xs={6}>
                {/* <FormControl fullWidth variant="standard">
                  <p>Username</p> */}
                <TextField
                  id="UserName"
                  variant="outlined"
                  label="Username"
                  type="string"
                  size="medium"
                  value={register.UserName || ""}
                  onChange={handleInputChange}
                />
                {/* </FormControl> */}
              </Grid>

              <Grid item xs={6}>
                {/* <FormControl fullWidth variant="standard">
                  <p>Password</p> */}
                <TextField
                  id="Password"
                  variant="outlined"
                  label="Password"
                  type="string"
                  size="medium"
                  value={register.Password || ""}
                  onChange={handleInputChange}
                />
                {/* </FormControl> */}
              </Grid>
            </Grid>
            <Divider />
            <Stack spacing={10} padding={5}>
              <Button
                // style={{ float: "right" }}
                onClick={submit}
                variant="contained"
                color="info"
              >
                Register
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}

export default RegisterCreate;
