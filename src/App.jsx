import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./dev-data/sidebar/sidebar.jsx";
import Home from "./dev-data/home/home.jsx";
import Info from "./dev-data/info/info.jsx";
import Reading from "./dev-data/reading/reading.jsx";
import "./App.css";
import axios from "axios";
import Header from "./dev-data/header/header.jsx";

function App() {
  return (
    <Router>
      <Header />
      <div className="app">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/info" element={<Info />} />
            <Route path="/reading" element={<Reading />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
