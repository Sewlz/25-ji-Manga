import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/reading.css";
function Reading() {
  const proxyUrl = `http://localhost:8080/proxy?url=`;

  const [chapterData, setChapterData] = useState([]);
  const [chapterHash, setChapterHash] = useState("");
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const title = sessionStorage.getItem("chapterTitle");
  const chapterNumber = sessionStorage.getItem("currentNumber");
  const feed = JSON.parse(sessionStorage.getItem("feed"));
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const resp = await axios({
          method: "GET",
          url: `${proxyUrl}${encodeURIComponent(
            `https://api.mangadex.org/at-home/server/${id}`
          )}`,
        });
        setChapterData(resp.data.chapter.data);
        setChapterHash(resp.data.chapter.hash);
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
  //prtefetching the next chapter
  useEffect(() => {
    const prefetchNextChapter = async () => {
      if (feed && feed.length > 0) {
        const currentIndex = feed.findIndex((ch) => ch.id === id);
        if (currentIndex !== -1 && currentIndex < feed.length - 1) {
          const nextChapterId = feed[currentIndex + 1].id;
          const nextChapterUrl = `${proxyUrl}${encodeURIComponent(
            `https://api.mangadex.org/at-home/server/${nextChapterId}`
          )}`;
          await axios.get(nextChapterUrl);
        }
      }
    };
    prefetchNextChapter();
  }, [id, feed]);
  const handleChange = (event) => {
    const selectedChapterId = event.target.value;
    const selectedChapter = feed.find(
      (chapter) => chapter.id === selectedChapterId
    );

    if (selectedChapter) {
      sessionStorage.setItem(
        "currentNumber",
        selectedChapter.attributes.chapter
      );
      navigate(`?id=${selectedChapterId}`);
    }
  };
  return (
    <div className="reading-container">
      <h1>
        {title} Chapter: {chapterNumber}
      </h1>
      <select value={id} onChange={handleChange} id="">
        {feed.map((chapter) => {
          const url = chapter.id;
          return (
            <option key={chapter.id} value={url}>
              {chapter.attributes.translatedLanguage} - Chapter:
              {chapter.attributes.chapter}
            </option>
          );
        })}
      </select>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {chapterData.map((url, index) => (
          <img
            className="img-page"
            src={`https://uploads.mangadex.org/data/${chapterHash}/${url}`}
            alt={`Page ${index + 1}`}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

export default Reading;
