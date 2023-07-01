import {useEffect, useState} from "react";
import { PostAllInterface } from "../../models/IPost";
import { Post } from "./post"
import { Dayjs } from "dayjs";

type props = {
  value:number;
  filter?: string[] ;
  startDate?: Dayjs | null; 
  endDate?: Dayjs | null;
};
export default function PostPage({value,filter,startDate,endDate}: props) {
  const [post,setPost] = useState<PostAllInterface[]>([])
  const [postTemp,setPostTemp] = useState<PostAllInterface[]>([])
  useEffect(() => {
    
    if (value === 2) {
      GetAllPost("myPost");
    }
   else if (value === 3) {
      GetMyFavorite()
    }else{
     GetAllPost("all");
    }
  }, [value,startDate,endDate]);

  function filterCategories(p: PostAllInterface, categoryList: string[]) {
   for (var i of p.category) {
    if (categoryList.includes(i.name)){
      return true
    }
   }
   return false
  }
  useEffect(() => {
    if (filter && filter.length > 0) {
     
      var ft = postTemp.filter((p) => filterCategories(p, filter))
      setPost(ft)
    }else {
      setPost(postTemp)
    }
   
   
  }, [filter]);

  const GetMyFavorite = async () => {
    const apiUrl = `http://localhost:8080/favorite`;
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
          setPostTemp(res.data)
          setPost(res.data);
        } else {
          console.log(res.err);
        }
      });
  };

  const GetAllPost = async (condition: string) => {
    var start_date = startDate?.startOf("day").toISOString();
    var end_date = endDate?.endOf("day").toISOString()
    const apiUrl = `http://localhost:8080/post?condition=${condition}&startDate=${start_date ?? ""}&endDate=${end_date ?? ""}`;
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
          setPostTemp(res.data)
          setPost(res.data);
        } else {
          setPostTemp([])
          setPost([]);
        }
      })
  };

  const isOwnPost = (email: string) => {
    return email === window.localStorage.getItem("email")
  }

  return (
  <div className="postPage">
  {post.length == 0 && 
  <>
    <p  style={{ textAlign: "center", color: "#728FCE" }} className="is_no_post">ไม่มีโพสต์แสดง</p>
  </>
  }
  {
    post.map((item:PostAllInterface) => (
      <>
      <Post 
      key={item.id}
      Data={item}
      isOwn={isOwnPost(item.user.email)}
      />
      <div className="sizeBox">

      </div>
      </>
    ))
  }
  </div>
  )

}
