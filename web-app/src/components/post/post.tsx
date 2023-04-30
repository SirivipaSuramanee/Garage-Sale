import {useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Button from "@mui/material/Button";
import { PostAllInterface } from "../../models/IPost";

type Dataprops = {
  Data: PostAllInterface;
};

export function Post(prop:Dataprops ) {
  const [post,SetPost] = useState<PostAllInterface[]>([])
  const [like, setlike] = useState(0);
 
  
  return (
    <>
      <Box
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
        <Stack
          sx={{ padding: 1 }}
          direction="column"
          justifyContent="space-between"
        >
          <h2>หัวข้อ: {prop.Data.topic}</h2>
          
          <h2>หมวดหมู่ {prop.Data.category?.name}</h2>
          <Stack
            sx={{ padding: 1 }}
            spacing={1}
            direction="row"
            alignItems="flex-start"
          >
            <h5>FAH007</h5>
            <Avatar>A</Avatar>
          </Stack>
        </Stack>

        <ImageList sx={{ width: "100%", height: 250 }} cols={3} rowHeight={164}>
          
            <ImageListItem key={prop.Data.ID}>
              <img
                src={`${prop.Data.picture}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${prop.Data.picture}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                // alt={item.title}
                loading="lazy"
              />
            </ImageListItem>
        
        </ImageList>
        <div style={{ width: "100%", padding: "20px" }}>
          <p>รายละเอียด: {prop.Data.detail}</p>
          <p>ราคา: {prop.Data.price}</p>
        </div>
        <p>เวลาเปิดบ้าน: {prop.Data.dayTimeOpen.toString()}</p>
        <p>เวลาปิดบ้าน: {prop.Data.dayTimeClose.toString()}</p>
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          
          <Button>LIKE</Button>
          <Button>LOCATION</Button>
        </Stack>
      </Box>
    </>
  );
}
