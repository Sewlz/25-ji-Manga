import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
export const HomeContext = createContext();

function Home() {
  const [mangaTitle, setMangaTitle] = useState("");
  const [mangaIds, setMangaIds] = useState([]);
  const [mangaTitles, setMangaTitles] = useState([]);
  const [error, setError] = useState(null);
  const [globId, setGlobId] = useState("");
  useEffect(() => {
    const fetchManga = async () => {
      try {
        const resp = await axios({
          method: "GET",
          url: `https://api.mangadex.org/manga`,
          params: {
            title: mangaTitle,
          },
        });
        const ids = resp.data.data.map((manga) => manga.id);
        const titles = resp.data.data.map((manga) => manga.attributes.title.en);
        setMangaTitles(titles);
        setMangaIds(ids);
        console.log(ids);
      } catch (error) {
        setError("Error fetching manga.");
        console.error("Error fetching manga:", error);
      }
    };

    fetchManga();
  }, [mangaTitle]);
  if (error) {
    return <div>{error}</div>;
  }
  function handleTextChange(event) {
    setMangaTitle(event.target.value);
  }
  const handleClick = (event) => {
    const selectedId = event.currentTarget.id;
    setGlobId(selectedId);
    console.log(selectedId);
  };

  return (
    <HomeContext.Provider value={globId}>
      <div>
        <h1>Manga Search</h1>
        <p>Search for manga by title</p>
        <input type="text" id="titleInput" on onChange={handleTextChange} />
        <ul>
          {mangaIds.map((id) => (
            <li key={id} id={id} onClick={handleClick}>
              <a href={`http://localhost:5173/info?id=${id}`}>
                {mangaTitles} - {id}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </HomeContext.Provider>
  );
}

export default Home;
