import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";
import { Stack } from "@mui/system";
export default function Nav() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="primary"position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Stack direction="row" sx={{ flexGrow: 1 }}
            
            justifyContent="space-between"
          >
            <Typography variant="h4" component="div">
              Garage Sale
            </Typography>

            <Stack spacing={1}direction="row">
              <Button color="inherit" component={RouterLink} to="/">
                feed
              </Button>
              <Button color="inherit" variant="outlined"component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" variant="outlined"component={RouterLink} to="/register">
                Register
              </Button>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
