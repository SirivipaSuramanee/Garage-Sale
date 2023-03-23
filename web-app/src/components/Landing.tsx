import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import POST from "./post";
export default function SimpleContainer() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ bgcolor: "#E0FFFF", padding: 1}}>
     
          <POST />
          <POST />
          <POST />
         
        </Box>
      </Container>
    </React.Fragment>
  );
}
