import {useEffect, useState} from "react";
import { PostAllInterface } from "../../models/IPost";
import { Post } from "./post"
import { CategoryInterface } from "../../models/ICategory";
import { Tune } from "@mui/icons-material";

type props = {
  value:number
  filter?: string[] ;
};
export default function PostPage({value,filter}: props) {
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
  }, [value]);

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
    const apiUrl = `http://localhost:8080/post?condition=${condition}`;
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
      })
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
      key={item.id}
      Data={item}
      />
      <div className="sizeBox">

      </div>
      </>
    ))
  }
  </div>
  )

}
