import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import "./home.css";
export const HomeContext = createContext();

function Home() {
  const [mangaTitle, setMangaTitle] = useState("");
  const [mangaIds, setMangaIds] = useState([]);
  const [mangaTitles, setMangaTitles] = useState([]);
  const [coverUrls, setCoverUrls] = useState([]);
  const [error, setError] = useState(null);
  const [globId, setGlobId] = useState("");
  useEffect(() => {
    const fetchManga = async () => {
      //get ids and titles
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
        //set data
        setMangaTitles(titles);
        setMangaIds(ids);
        setCoverUrls(covers.filter(Boolean));
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
        <div className="list-wrapper">
          {mangaIds.map((id, index) => (
            <div className="listItem" key={id} id={id} onClick={handleClick}>
              <img src={coverUrls[index]} alt="" />
              <a href={`http://localhost:5173/info?id=${id}`}>
                {mangaTitles} - {id}
              </a>
            </div>
          ))}
        </div>
      </div>
    </HomeContext.Provider>
  );
}

export default Home;
