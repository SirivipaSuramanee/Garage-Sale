import React from "react";
import './App.css';
import RegisterCreate from "./components/RegisterCreate";
import Nav from "./components/nav"
import Login from "./components/Login"
import LandingPage from "./components/Landing"
import PostCreate from "./components/postCreate"
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
function App() {

  return (
    <div className="App">

      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterCreate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/postCreate" element={<PostCreate />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
