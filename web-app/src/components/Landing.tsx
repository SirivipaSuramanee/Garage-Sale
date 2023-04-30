import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import PostPage from "./post/PostPage";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import Fab from "@mui/material/Fab";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import HomeIcon from '@mui/icons-material/Home';
import PostCreate from "./postCreate"


export default function IconLabelTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ bgcolor: "#E0FFFF", padding: 1 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="icon label tabs example"
            
          >
            <Tab icon={<HomeIcon />} label="HOME" />
            <Tab icon={<AddBusinessIcon />} label="POST" />
            <Tab icon={<FavoriteIcon />} label="FAVORITES" />
            <Tab icon={<PersonPinIcon />} label="NEARBY" />
          </Tabs>
        {value === 0 &&  <PostPage />}
       {value === 1 && <PostCreate />}
       

        
         
        </Box>
      </Container>
    </React.Fragment>
  );
}

