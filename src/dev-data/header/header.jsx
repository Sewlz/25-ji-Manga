import React, { useState, useEffect } from "react";
import "./header.css";
import logo from "../../assets/og-image.webp";
import useViewAll from "../view-all-hook/useViewAll";
const Header = () => {
  const [searchTitle, setSearchTitle] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [queryParams, setQueryParams] = useState("");
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTitle) {
      params.append("title", searchTitle);
    }
    setQueryParams(params.toString());
  }, [searchTitle]);
  const { mangaData, error, isLoading } = useViewAll(queryParams);
  const { mangaIds, mangaTitles, mangaDescriptions, mangaAuthor, coverUrls } =
    mangaData;
  function handleTextChange(event) {
    setSearchTitle(event.target.value);
    setShowResults(event.target.value !== "");
  }
  function sendData(index) {
    sessionStorage.setItem("coverUrl", coverUrls[index]);
    sessionStorage.setItem("mangaTitle", mangaTitles[index]);
    sessionStorage.setItem("mangaDescription", mangaDescriptions[index]);
    sessionStorage.setItem("mangaAuthor", mangaAuthor[index]);
  }
  return (
    <header className="manga-header">
      <div className="logo">
        <a href="/">
          <img src={logo} alt="Logo" />
        </a>
      </div>
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search manga..."
            on
            onChange={handleTextChange}
          />
          <button type="submit">
            <span>Search</span>
          </button>
        </div>
        <div
          className="search-results"
          style={{ display: showResults ? "block" : "none" }}
        >
          <ul>
            {mangaIds.map((id, index) => (
              <li key={id} onClick={() => sendData(index)}>
                <a href={`/info?id=${id}`}>{mangaTitles[index]}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
