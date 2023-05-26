import {useEffect, useState} from "react";
import { PostAllInterface } from "../../models/IPost";
import { Post } from "./post"


export default function PostPage() {
  const [post,SetPost] = useState<PostAllInterface[]>([])

  

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, //การยืนยันตัวตน
      "Content-Type": "application/json",
    },
  };
  useEffect(() => {
    //ทำงานทุกครั้งที่เรารีเฟชหน้าจอ
    //ไม่ให้รันแบบอินฟินิตี้ลูป
    GetAllPost();
    
  }, []);
  const GetAllPost = async () => {
    const apiUrl = "http://localhost:8080/post";

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())

      .then((res) => {

        if (res.data) {
          SetPost(res.data);
        } else {
          console.log(res.err);
        }
      });
  };

  return (
  <>
  {post.length == 0 && 
  <>
    <p className="is_no_post">no content</p>
  </>
  }
  {
    post.map((item:PostAllInterface) => (
      <>
      <Post 
      key={item.ID}
      Data={item}
      />
      </>
    ))
  }
  </>
  )

}
