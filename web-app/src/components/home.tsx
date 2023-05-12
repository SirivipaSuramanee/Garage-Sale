import {useState, useEffect} from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import PostPage from "./post/PostPage";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import HomeIcon from '@mui/icons-material/Home';
import PostCreate from "./post/postCreate"
import Category from "./category";
import { CategoryInterface } from "../models/ICategory";


export default function IconLabelTabs() {
  const [value, setValue] = useState(0);
  const [token, setToken] = useState<String | null>(null);
  const [category, setCategory] = useState<CategoryInterface[]>([]);
  

  const getToken = () => {
    const token = localStorage.getItem("token");
    setToken(token);
  };

  const GetAllCategory = async () => {
    const apiUrl = "http://localhost:8080/category";

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, //การยืนยันตัวตน
        "Content-Type": "application/json",
      },
    };

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())

      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setCategory(res.data);
        } else {
          console.log(res.err);
        }
      });
  };


  useEffect(() => {
    //ทำงานทุกครั้งที่เรารีเฟชหน้าจอ
    //ไม่ให้รันแบบอินฟินิตี้ลูป
    getToken();
    GetAllCategory();
  }, []);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ bgcolor: "#E0FFFF", padding: 1 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="icon label tabs example"
            
          >
            <Tab icon={<HomeIcon />} label="HOME" />
           {token && <Tab icon={<AddBusinessIcon />} label="POST" />} 
            {/* <Tab icon={<FavoriteIcon />} label="FAVORITES" />
            <Tab icon={<PersonPinIcon />} label="NEARBY" /> */}
          </Tabs>

          {category.map((item: CategoryInterface) =>  (
            <Category Data={item} />
          )

          )}
          
       {value === 0 &&  <PostPage />}
       {value === 1 && <PostCreate />}
       

        
         
        </Box>
      </Container>
    </>
  );
}

