import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
function Info() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [feed, setfeed] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const resp = await axios({
          method: "GET",
          url: `https://api.mangadex.org/manga/${id}/feed`,
        });
        setfeed(resp.data.data);
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
    <div>
      <h1>Manga Chapters</h1>
      <ul>
        {feed.map((chapter) => (
          <li key={chapter.id}>
            <a href={`http://localhost:5173/reading?id=${chapter.id}`}>
              {chapter.attributes.volume} - {chapter.id}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Info;
