import {useEffect, useState} from "react";
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Avatar from "@mui/material/Avatar";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { PostAllInterface } from "../../models/IPost";
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';

import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import dayjs from "dayjs";



type Dataprops = {
  Data: PostAllInterface;
};

export function Post(prop:Dataprops ) {
  
  const [favorites, setFavorites] = useState("inherit");
 
  
  return (

      <Card 
        component="div"
        sx={{
          padding: 1,
          marginLeft: 1,
          marginRight: 1,
        
          "&:hover": {
            backgroundColor: "#C9DFEC",
            opacity: [0.9, 0.8, 0.7],
          },
        }}
      >
         <CardHeader
        avatar={
          <Avatar alt={String(prop.Data.ID)} src={prop.Data.user.profileURL}>
            
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={prop.Data.topic}
        
        subheader={dayjs(prop.Data.CreatedAt).format('DD MMM, YYYY')}
      />
        <CardMedia
        component="img"
        className="css-o69gx8-MuiCardMedia-root"
        
        image={prop.Data.picture}
        alt="Paella dish"
      />
        <CardContent>
        <Typography variant="h6" >
        ราคา: {prop.Data.price} บาท
        </Typography>
        <br />
        <Typography variant="body1" sx={{ textAlign: "start"}}>
        {prop.Data.detail}
        </Typography>
        </CardContent> 
       <Typography variant="body1" sx={{ textAlign: "start"}}>เวลาเปิดบ้าน: {dayjs(prop.Data.dayTimeOpen).format('DD MMM, YYYY')} ถึง {dayjs(prop.Data.dayTimeClose).format('DD MMM, YYYY')}</Typography>
     
       <CardActions>
        <IconButton aria-label="add to favorites" onClick={() => {
            if (favorites === "red") {
              setFavorites("inherit")
            }else{
              setFavorites("red")
            }
        }}>
          <FavoriteIcon sx={{ color: favorites}} />
        </IconButton>
        <IconButton aria-label="add to location" >
           <LocationOnIcon/>
        </IconButton>
       
       </CardActions>
      </Card >
  
  );
}
