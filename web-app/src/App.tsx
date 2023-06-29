import { useState } from "react";
import './App.css';
import RegisterCreate from "./components/RegisterCreate";
import Nav from "./components/nav"
import Login from "./components/Login"
import Home from "./components/home"

import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import MapLocation from "./components/maps/allpost";
import { Post } from "./components/post/post";
import { PostAllInterface } from "./models/IPost";
function App() {
  const [post, setPost] = useState<PostAllInterface>()

  return (
    <div className="App">
    
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post" element={<Post Data={post!} backButton={true} />} />
          <Route path="/map/post" element={<MapLocation onViewPost={(v) => {
            setPost(v)
          }} />} />
          <Route path="/register" element={<RegisterCreate />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
