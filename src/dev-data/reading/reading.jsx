import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./reading.css";
function Reading() {
  const [chapter, setChapter] = useState([]);
  const [chapterId, setChapterId] = useState([]);
  const [error, setError] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const resp = await axios({
          method: "GET",
          url: `https://api.mangadex.org/at-home/server/${id}`,
        });
        setChapter(resp.data.chapter.data);
        setChapterId(resp.data.chapter.hash);
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
    <div className="reading-container">
      <h1>Manga Reading</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {chapter.map((url, index) => (
          <img
            className="img-page"
            src={`https://uploads.mangadex.org/data/${chapterId}/${url}`}
            alt={`Page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Reading;
