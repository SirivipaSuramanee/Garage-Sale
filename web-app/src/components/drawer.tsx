import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import { CategoryInterface } from "../models/ICategory";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import CheckboxesTags from "./post/component/Checkboxes";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const drawerWidth = 300;
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));
type props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  startDate: Dispatch<SetStateAction<Dayjs | null>>;
  endDate: Dispatch<SetStateAction<Dayjs | null | undefined>>;
  filter: (v: string[]) => void;
};
export default function PersistentDrawerRight({ open, setOpen , filter, startDate, endDate}: props) {
  const theme = useTheme();
  const [CloseTime, setCloseTime] = useState<Dayjs | null>();
  const [OpenTime, setOpenTime] = useState<Dayjs | null>(dayjs(new Date()));
  const [category, setCategory] = useState<CategoryInterface[]>([]);

  const handleDrawerClose = () => {
    setOpen(false);
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
    GetAllCategory();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader style={{position:"relative"}}>
          <IconButton  style={{position:"absolute", right:"0"}} onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <div style={{padding: "20px"}}>
          <Typography component="h1" variant="h6" color="primary" gutterBottom>
            หมวดหมู่
          </Typography>
          <CheckboxesTags
            Data={category}
            setCategory={(value) => {
              filter(value.map((v) => v.name))
            }}
          />
          <Typography component="h1" variant="h6" color="primary" gutterBottom>
            วัน
          </Typography>
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
                      startDate(value);
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </span>
            วันที่ปิด
            <span>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    minDate={OpenTime}
                    value={CloseTime}
                    onChange={(value) => {
                      setCloseTime(value);
                      endDate(value);
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </span>
        </div>
      </Drawer>
    </Box>
  );
}
