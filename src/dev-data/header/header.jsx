import React, { useState, useEffect } from "react";
import axios from "axios";
import "./header.css";
import logo from "../../assets/og-image.webp";
const Header = () => {
  const [searchTitle, setSearchTitle] = useState("");
  const [mangaIds, setMangaIds] = useState([]);
  const [mangaTitle, setMangaTitle] = useState([]);
  const [showResults, setShowResults] = useState(false);
  useEffect(() => {
    const fetchManga = async () => {
      try {
        const resp = await axios({
          method: "GET",
          url: "https://api.mangadex.org/manga",
          params: {
            title: searchTitle,
          },
        });
        const ids = resp.data.data.map((manga) => manga.id);
        const titles = resp.data.data.map((manga) => {
          const titleObj = manga.attributes.title;
          const titleKey = Object.keys(titleObj)[0];
          const firstTitle = titleObj[titleKey];
          return firstTitle;
        });
        setMangaIds(ids);
        setMangaTitle(titles);
      } catch (error) {
        console.log("Error fetching manga:" + error);
      }
    };

    fetchManga();
  }, [searchTitle]);
  function handleTextChange(event) {
    setSearchTitle(event.target.value);
    setShowResults(event.target.value !== "");
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
            <img src="/path/to/search-icon.png" alt="Search" />
          </button>
        </div>
        <div
          className="search-results"
          style={{ display: showResults ? "block" : "none" }}
        >
          <ul>
            {mangaIds.map((id, index) => (
              <li key={id}>
                <a href={`/info?id=${id}`}>{mangaTitle[index]}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
