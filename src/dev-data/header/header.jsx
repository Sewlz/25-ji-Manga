import React from "react";
import "./header.css";
import logo from "../../assets/og-image.webp";
const Header = () => {
  return (
    <header className="manga-header">
      <div className="logo">
        <a href="/">
          <img src={logo} alt="Logo" />
        </a>
      </div>
      {/* <nav className="nav-menu">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/popular">Popular</a>
          </li>
          <li>
            <a href="/latest">Latest</a>
          </li>
          <li>
            <a href="/genres">Genres</a>
          </li>
          <li>
            <a href="/favorites">Favorites</a>
          </li>
        </ul>
      </nav> */}
      <div className="search-bar">
        <input type="text" placeholder="Search manga..." />
        <button type="submit">
          <img src="/path/to/search-icon.png" alt="Search" />
        </button>
      </div>
    </header>
  );
};

export default Header;
