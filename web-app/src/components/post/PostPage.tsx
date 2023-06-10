import {useEffect, useState} from "react";
import { PostAllInterface } from "../../models/IPost";
import { Post } from "./post"

type props = {
  value:number
};
export default function PostPage({value}: props) {
  const [post,setPost] = useState<PostAllInterface[]>([])

  useEffect(() => {
    
    if (value === 2) {
      GetMyPost()
    }else{
      console.log("GetAllPost()")
     GetAllPost();
    }
   
  }, [value]);
  const GetMyPost = async () => {
    const apiUrl = `http://localhost:8080/post`;
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
          console.log(res.data)
          setPost(res.data);
        } else {
          console.log(res.err);
        }
      });
  };

  const GetAllPost = async () => {
    const apiUrl = `http://localhost:8080/post`;
    const requestOptions = {
      method: "GET",
      headers: { //การยืนยันตัวตน
        "Content-Type": "application/json",
      },
    };
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())

      .then((res) => {

        if (res.data) {
          console.log(res.data)
          setPost(res.data);
        } else {
          console.log(res.err);
        }
      });
  };

  return (
  <div className="postPage">
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
  </div>
  )

}
