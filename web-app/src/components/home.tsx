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
import { CategoryInterface } from "../models/ICategory";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import CheckboxesTags from "./post/component/Checkboxes";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';

export default function IconLabelTabs() {
  const [CloseTime, setCloseTime] = useState<Dayjs | null>();
  const [OpenTime, setOpenTime] = useState<Dayjs | null>(dayjs(new Date()));
  const [value, setValue] = useState(0);
  const [token, setToken] = useState<String | null>(null);
  const [category, setCategory] = useState<CategoryInterface[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<CategoryInterface[]>([]);


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
      <div>
        <div
          className="filterBar"
          style={{ visibility: value == 0 ? "visible" : "hidden" }}
        >
          <Typography component="h1" variant="h6" color="primary" gutterBottom>
            หมวดหมู่
          </Typography>
          <CheckboxesTags
            Data={category}
            setCategory={(value) => {
              setCategoryFilter(value);
            }}
          />
          <Typography component="h1" variant="h6" color="primary" gutterBottom>
            วัน
          </Typography>

          <dd>
            วันที่เปิด
            <span>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    minDate={dayjs(new Date())}
                    maxDate={CloseTime}
                    value={OpenTime}
                    onChange={(value) => {
                      setOpenTime(value);
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </span>
          </dd>
          <dd>
            วันที่ปิด
            <span>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    minDate={OpenTime}
                    value={CloseTime}
                    onChange={(value) => {
                      setCloseTime(value);
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </span>
          </dd>
        </div>
        <Container maxWidth="md">
          <Box sx={{ bgcolor: "#DBE9FA", padding: 1 }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
            >
              <Tab icon={<HomeIcon />} label="หน้าหลัก" />
              <Tab icon={<AddBusinessIcon />} label="สร้างโพสต์" />
              <Tab icon={<FaceRetouchingNaturalIcon />} label="โพสต์ของฉัน" />
              <Tab icon={<FavoriteIcon />} label="โพสต์ที่สนใจ" />
            </Tabs>
            {value === 0 && (
              <PostPage
                value={value}
                startDate={OpenTime}
                endDate={CloseTime}
                filter={categoryFilter.map((v) => v.name)}
              />
            )}
            {value === 1 && <PostCreate />}
            {value === 2 && (
              <PostPage
                value={value}
              />
            )}
            {value === 3 && <PostPage value={value} />}
          </Box>
        </Container>
      </div>
    );

  return (
    <>
      <div
        className="filterBar"
      >
        <Typography component="h1" variant="h6" color="primary" gutterBottom>
          หมวดหมู่
        </Typography>
        <CheckboxesTags
          Data={category}
          setCategory={(value) => {
            setCategoryFilter(value);
          }}
        />
        <Typography component="h1" variant="h6" color="primary" gutterBottom>
          วัน
        </Typography>

        <dd>
          วันที่เปิด
          <span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  minDate={dayjs(new Date())}
                  maxDate={CloseTime}
                  value={OpenTime}
                  onChange={(value) => {
                    setOpenTime(value);
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </span>
        </dd>
        <dd>
          วันที่ปิด
          <span>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  minDate={OpenTime}
                  value={CloseTime}
                  onChange={(value) => {
                    setCloseTime(value);
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </span>
        </dd>
      </div>
      <Container maxWidth="md">
        <Box sx={{ bgcolor: "#E0FFFF", padding: 1 }}>
          <PostPage
            startDate={OpenTime}
            endDate={CloseTime}
            filter={categoryFilter.map((v) => v.name)}
            value={0}
          />
        </Box>
      </Container>
    </>
  );
}
