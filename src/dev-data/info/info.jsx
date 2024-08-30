import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./info.css";
function Info() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [feed, setfeed] = useState([]);
  const [error, setError] = useState(null);

  const coverUrl = sessionStorage.getItem("coverUrl");
  const mangaDes = sessionStorage.getItem("mangaDescription");
  const mangaTitle = sessionStorage.getItem("mangaTitle");
  const mangaAuthor = sessionStorage.getItem("mangaAuthor");

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const resp = await axios({
          method: "GET",
          url: `https://api.mangadex.org/manga/${id}/feed`,
        });
        const sortedFeed = resp.data.data.sort((a, b) => {
          const chapterA = parseFloat(a.attributes.chapter);
          const chapterB = parseFloat(b.attributes.chapter);
          return chapterA - chapterB;
        });

        setfeed(sortedFeed);
      } catch (error) {
        setError("Error fetching chapters.");
        console.error("Error fetching manga:", error);
      }
    };
    fetchChapters();
  }, [id]);
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="info-container">
      <div
        className="info-wrapper"
        style={{
          backgroundImage: `url(${coverUrl})`,
          backgroundSize: "cover",
        }}
      >
        <img src={coverUrl} alt="" />
        <div className="manga-info">
          <h1>{mangaTitle}</h1>
          <p>{mangaAuthor}</p>
          <p>{mangaDes}</p>
        </div>
      </div>
      <div className="chapters-wrapper">
        <h1>Manga Chapters</h1>
        <ul>
          {feed.map((chapter) => (
            <li key={chapter.id}>
              <a href={`http://localhost:5173/reading?id=${chapter.id}`}>
                {chapter.attributes.translatedLanguage} - Chapter:{" "}
                {chapter.attributes.chapter}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Info;
