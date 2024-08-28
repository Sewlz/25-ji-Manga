import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";

function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {/* <li>
          <Link to="/info">Info</Link>
        </li>
        <li>
          <Link to="/reading">Reading</Link>
        </li> */}
      </ul>
    </nav>
  );
}

export default Sidebar;
