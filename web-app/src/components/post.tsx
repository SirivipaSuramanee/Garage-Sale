import * as React from "react";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Button from '@mui/material/Button';
export default function POST() {
    const [like, setlike] = React.useState(0);
  const itemData = [
    {
      img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
      title: "Breakfast",
    },
    {
      img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      title: "Burger",
    },
    {
      img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
      title: "Camera",
    },
    {
      img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
      title: "Coffee",
    },
    {
      img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
      title: "Hats",
    },
    {
      img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
      title: "Honey",
    },
    // {
    //   img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    //   title: "Basketball",
    // },
    // {
    //   img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    //   title: "Fern",
    // },
    // {
    //   img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    //   title: "Mushrooms",
    // },
    // {
    //   img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    //   title: "Tomato basil",
    // },
    // {
    //   img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    //   title: "Sea star",
    // },
    // {
    //   img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    //   title: "Bike",
    // },
  ];
  return (
    <>
      <Box
      component="div"
        sx={{
          marginLeft: 1,
          marginRight: 1,
          height: 500,
          // backgroundColor: "#B0CFDE",
          "&:hover": 
          {
            backgroundColor: "#C9DFEC",
            opacity: [0.9, 0.8, 0.7],
          },
        }}
      >
        <Stack
          sx={{ padding: 1 }}
          direction="row"
          justifyContent="space-between"
         
        >
          <h2>หัวข้อ</h2>
          <Stack 
           sx={{ padding: 1 }}       
           spacing={1}
          direction="row"
            alignItems="flex-start"
          >
           
             <h5 >FAH007</h5>
            <Avatar>A</Avatar>
          </Stack>
        </Stack>

        <Stack direction="row" sx={{ padding: 2 }}>
          <ImageList
            sx={{ width: "100%", height: 250 }}
            cols={3}
            rowHeight={164}
          >
            {itemData.map((item) => (
              <ImageListItem key={item.img}>
                <img
                  src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                  srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  // alt={item.title}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
          <div style={{ width: "100%", padding: "20px" }}>
            <p>รายละเอียด</p>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into

            </p>
          </div>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          sx={{ padding: 2 }}
          spacing={2}
        >
         <Button variant="contained" color="info" onClick={()=> {
            
            setlike(like+1)
         }}>{like}❤️</Button>
          <h5>โลเคชั่น</h5>
        </Stack>
      </Box>
    </>
  );
}
