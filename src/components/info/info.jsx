import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../../styles/info.css";
import ReadMore from "../readmore/readmore";
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
  const apiUrl = `https://api.mangadex.org/manga/${id}/feed`;
  const proxyUrl = `http://localhost:8080/proxy?url=${encodeURIComponent(
    apiUrl
  )}`;
  function sendInfo(index) {
    sessionStorage.setItem("currentNumber", feed[index].attributes.chapter);
    sessionStorage.setItem("chapterTitle", mangaTitle);
    sessionStorage.setItem("feed", JSON.stringify(feed));
  }

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const resp = await axios.get(`${proxyUrl}`);
        const sortedFeed = resp.data.data.sort((a, b) => {
          const chapterA = a.attributes.chapter
            ? parseFloat(a.attributes.chapter)
            : 0;
          const chapterB = b.attributes.chapter
            ? parseFloat(b.attributes.chapter)
            : 0;

          if (chapterA === chapterB) {
            const volumeA = a.attributes.volume
              ? parseFloat(a.attributes.volume)
              : 0;
            const volumeB = b.attributes.volume
              ? parseFloat(b.attributes.volume)
              : 0;
            return volumeA - volumeB;
          }

          return chapterA - chapterB;
        });
        setfeed(sortedFeed);
      } catch (error) {
        console.error("Error fetching chapters:", error);
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
          <ReadMore text={mangaDes} maxHeight={195} />
        </div>
      </div>
      <div className="chapters-wrapper">
        <h1>Manga Chapters</h1>
        <ul>
          {feed.map((chapter, index) => (
            <li key={chapter.id} onClick={() => sendInfo(index)}>
              <a href={`/reading?id=${chapter.id}`}>
                {chapter.attributes.translatedLanguage} - Chapter:
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
