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

const settings = ["Profile", "Logout"];
export default function Nav() {
  const [token, setToken] = useState<String | null>(null);

  const getToken = () => {
    const token = localStorage.getItem("token");
    setToken(token);
  };

  useEffect(() => {
    getToken();
  }, [token]);

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);


  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (event: React.MouseEvent<HTMLLIElement, MouseEvent> , index : number) => {
    if (index === 1) {
      window.localStorage.clear();
      setToken(null);
    }
    setAnchorElUser(null);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
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
            <Typography variant="h4" component="div">
              Garage Sale
            </Typography>

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
                        src="/static/images/avatar/2.jpg"
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
  );
}
