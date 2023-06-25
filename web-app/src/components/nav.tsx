import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";
import { Stack } from "@mui/system";
import Tooltip from "@mui/material/Tooltip/Tooltip";
import Avatar from "@mui/material/Avatar/Avatar";
import Menu from "@mui/material/Menu/Menu";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import TemporaryDrawer from "./drawer";
import CssBaseline from "@mui/material/CssBaseline";


const settings = ["Profile", "Logout"];
export default function Nav() {
  const [token, setToken] = useState<String | null>(null);
  const [profileURL,setProfileURL] = useState<string | null>(null);

  const getToken = () => {
    const token = localStorage.getItem("token");
    setToken(token);
  };

  const getProfileURL = () => {
    const profileURL = localStorage.getItem("profileURL");
    setProfileURL(profileURL);
  };

  useEffect(() => {
    
    getToken();
    getProfileURL();
  }, [token]);

 
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);


  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (event: React.MouseEvent<HTMLLIElement, MouseEvent> , index : number) => {
    if (index === 1) {
      window.localStorage.clear();
      setToken(null);
      window.location.href = "";
    }
    setAnchorElUser(null);
  };
  return (
    <nav>
    <Box sx={{ flexGrow: 1 ,display: "sticky"}}>
    <CssBaseline />
      <AppBar color="primary" position="sticky">
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
          <Stack
            direction="row"
            sx={{ flexGrow: 1 }}
            justifyContent="space-between"
            >
            <div>
            <Typography variant="h4" component="a" href="/" style={{textDecoration: "none", marginRight: "10px"}} color="pink">
              Garage Sale
            </Typography>

            <Typography variant="h4" component="a" href="/map/post" style={{textDecoration: "none"}} color="pink">
              แสดงบน google map
            </Typography>
            
            </div>

            <Stack spacing={1} direction="row">
              {!token && (
                <>
                  <Button
                    color="inherit"
                    variant="outlined"
                    component={RouterLink}
                    to="/login"
                    >
                    Login
                  </Button>
                  <Button
                    color="inherit"
                    variant="outlined"
                    component={RouterLink}
                    to="/register"
                    >
                    Register
                  </Button>
                </>
              )}

              {token && (
                <>
                  <p>{localStorage.getItem("email")}</p>
                  <Tooltip title="Open settings">
                    <IconButton  onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        alt="Remy Sharp"
                        src={profileURL!}
                        />
                    </IconButton>
                  </Tooltip>
                 
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    
                    open={Boolean(anchorElUser)}
                    >
                    {settings.map((setting, index) => (
                      <MenuItem key={setting} value={setting}  onClick={(e) => {handleCloseUserMenu(e, index)}} >
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>

                
                </>
              )}
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
    </nav>
  );
}
