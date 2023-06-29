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
import CssBaseline from "@mui/material/CssBaseline";
import mapIcon from "../assert/google-maps.png"
import SvgIcon from "@mui/icons-material/Menu";

const settings = ["ออกจากระบบ"];
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
      <AppBar style={{background:'#4E5180'}} position="sticky">
        <Toolbar>
          <Stack
            direction="row"
            sx={{ flexGrow: 1 }}
            justifyContent="space-between"
            >
            <div>
            <Typography variant="h3" component="a" href="/" style={{textDecoration: "none", marginRight: "10px"}} color="white">
              Garage Sale
            </Typography>

            </div>

            <Stack spacing={1} direction="row">
              <IconButton href="/map/post">
                  <img src={mapIcon} alt="mapIcon" style={{width:"33px",height:"33px"}}/>
              </IconButton>
              {!token && (
                <>
                  <Button
                    color="inherit"
                    variant="outlined"
                    component={RouterLink}
                    to="/login"
                    >
                    เข้าสู่ระบบ
                  </Button>
                  <Button
                    color="inherit"
                    variant="outlined"
                    component={RouterLink}
                    to="/register"
                    >
                    ลงทะเบียน
                  </Button>
                </>
              )}

              {token && (
                <>
                  <p style={{ display: "flex", alignItems: "center", height: "100%" }}>{localStorage.getItem("email")} </p>
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
