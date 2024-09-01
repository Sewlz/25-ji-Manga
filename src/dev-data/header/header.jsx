import React, { useState, useEffect } from "react";
import axios from "axios";
import "./header.css";
import logo from "../../assets/og-image.webp";
const Header = () => {
  const baseDomain = window.location.origin;
  const [searchTitle, setSearchTitle] = useState("");
  const [mangaIds, setMangaIds] = useState([]);
  const [mangaTitle, setMangaTitle] = useState([]);
  const [mangaDescriptons, setMangaDescriptions] = useState([]);
  const [mangaAuthor, setMangaAuthor] = useState([]);
  const [coverUrls, setCoverUrls] = useState([]);
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
        //get descriptions
        const description = resp.data.data.map((manga) => {
          const desObj = manga.attributes.description;
          const firstDesKey = Object.keys(desObj)[0];
          const firstDes = desObj[firstDesKey];
          return firstDes;
        });
        //get author
        const author = await Promise.all(
          resp.data.data.map(async (manga) => {
            const authorRel = manga.relationships.find(
              (rel) => rel.type === "author"
            );
            if (authorRel) {
              const authorResp = await axios.get(
                `https://api.mangadex.org/author/${authorRel.id}`
              );
              const authorName = authorResp.data.data.attributes.name;
              return authorName;
            }
            return null;
          })
        );
        //get cover arts
        const covers = await Promise.all(
          resp.data.data.map(async (manga) => {
            const coverArtRel = manga.relationships.find(
              (rel) => rel.type === "cover_art"
            );
            if (coverArtRel) {
              const coverResp = await axios.get(
                `https://api.mangadex.org/cover/${coverArtRel.id}`
              );
              const coverFileName = coverResp.data.data.attributes.fileName;
              return `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}`;
            }
            return null;
          })
        );
        setMangaIds(ids);
        setMangaTitle(titles);
        setMangaDescriptions(description);
        setMangaAuthor(author);
        setCoverUrls(covers.filter(Boolean));
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
  function sendData(index) {
    sessionStorage.setItem("coverUrl", coverUrls[index]);
    sessionStorage.setItem("mangaTitle", mangaTitle[index]);
    sessionStorage.setItem("mangaDescription", mangaDescriptons[index]);
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
