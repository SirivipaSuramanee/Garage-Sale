import { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import PostPage from "./post/PostPage";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import HomeIcon from "@mui/icons-material/Home";
import PostCreate from "./post/postCreate";
import Category from "./category";
import { CategoryInterface } from "../models/ICategory";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function IconLabelTabs() {
  const [value, setValue] = useState(0);
  const [token, setToken] = useState<String | null>(null);
  const [category, setCategory] = useState<CategoryInterface[]>([]);
  const [showAll, setShowAll] = useState(true);

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
  if (token)
    return (
      <>
        <CssBaseline />
        <div className="filterBar">
          <p>หมวดหมู่</p>
          <ul className="filterCategories">
            <dd>
              <FormControlLabel
                key={"all"}
                control={<Checkbox 
                checked={showAll} 
                inputProps={{ 'name': 'all' }}
                onChange={(e) => {
                  setShowAll(e.target.checked)
                }}/>}
                label={"แสดงทั้งหมด"}
              />
            </dd>
            {!showAll && category.map((item: CategoryInterface, index: number) => (
              <dd>
                <FormControlLabel
                  key={item.ID}
                  control={<Checkbox 
                  checked={ item.check} 
                  onChange={(e) => {
                    setCategory((prev) =>
                    prev.map((v,i) => i === index ? {...v, check : e.target.checked} : v)
                    )
                  }} />}
                  label={item.name}
                />
              </dd>
            ))}
          </ul>
          <p>วันที่</p>
          <ul className="filterCategories">
            <dd>วันที่เปิด</dd>
            <dd>วันที่ปิด</dd>
          </ul>
        </div>
        <Container maxWidth="md">
          <Box sx={{ bgcolor: "#E0FFFF", padding: 1 }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="icon label tabs example"
            >
              <Tab icon={<HomeIcon />} label="หน้าหลัก" />
              <Tab icon={<AddBusinessIcon />} label="สร้างโพสต์" />
              <Tab icon={<AddBusinessIcon />} label="โฟสต์ของฉัน" />
              <Tab icon={<AddBusinessIcon />} label="โพสต์ที่สนใจ" />
            </Tabs>

            {value === 0 && <PostPage value={value} />}
            {value === 1 && <PostCreate />}
            {value === 2 && <PostPage value={value} />}
            {value === 3 && <PostPage value={value} />}
          </Box>
        </Container>
      </>
    );

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
            <Tab icon={<HomeIcon />} label="หน้าหลัก" />
          </Tabs>

          <PostPage value={value} />
        </Box>
      </Container>
    </>
  );
}
