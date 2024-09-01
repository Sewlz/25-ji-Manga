import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
import "./popbygernes.css";

function PopularByGernes() {
  //manga datas
  const [mangaIds, setMangaIds] = useState([]);
  const [mangaTitles, setMangaTitles] = useState([]);
  const [tagIds, setTagIds] = useState([]);
  const [tagNames, setTagNames] = useState([]);
  const [mangaAuthor, setMangaAuthor] = useState([]);
  const [coverUrls, setCoverUrls] = useState([]);
  const [error, setError] = useState(null);
  const [selectedGern, setSelectedGern] = useState(
    "0234a31e-a729-4e28-9d6a-3f87c4966b9e"
  );
  useEffect(() => {
    const fetchManga = async () => {
      //get ids and titles
      try {
        const resp = await axios({
          method: "GET",
          params: {
            limit: 10,
            includedTags: [selectedGern],
            order: {
              followedCount: "desc",
            },
          },
          url: `https://api.mangadex.org/manga`,
        });
        const ids = resp.data.data.map((manga) => manga.id);
        //get titles
        const titles = resp.data.data.map((manga) => {
          const titleObj = manga.attributes.title;
          // Access the first title in the object
          const firstTitleKey = Object.keys(titleObj)[0]; // Get the first language key
          const firstTitle = titleObj[firstTitleKey]; // Get the title associated with that key
          return firstTitle;
        });
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
        //set data
        setMangaTitles(titles);
        setMangaIds(ids);
        setMangaAuthor(author);
        setCoverUrls(covers.filter(Boolean));
        console.log(titles);
      } catch (error) {
        setError("Error fetching manga.");
        console.error("Error fetching manga:", error);
      }
    };
    const fetchTags = async () => {
      try {
        const resp = await axios({
          method: "GET",
          url: "https://api.mangadex.org/manga/tag",
        });
        const ids = resp.data.data.map((manga) => manga.id);
        const name = resp.data.data.map((manga) => manga.attributes.name.en);
        setTagIds(ids);
        setTagNames(name);
      } catch (error) {
        setError("Error fetching tags.");
        console.error("Error fetching tags:", error);
      }
    };
    fetchManga();
    fetchTags();
  }, [selectedGern]);
  if (error) {
    return <div>{error}</div>;
  }
  function sendData(index) {
    sessionStorage.setItem("coverUrl", coverUrls[index]);
    sessionStorage.setItem("mangaTitle", mangaTitles[index]);
    sessionStorage.setItem("mangaDescription", mangaDescriptons[index]);
    sessionStorage.setItem("mangaAuthor", mangaAuthor[index]);
  }
  function getGerns(event) {
    setSelectedGern(event.target.value);
    console.log(selectedGern);
  }
  return (
    <>
      <div className="latest-uploads">
        <span>
          <i className="fas fa-upload"></i> Popular By Gernes
        </span>
        <select id="gernSelect" onChange={getGerns} values={selectedGern}>
          {tagIds.map((id, index) => (
            <option key={id} value={id}>
              {tagNames[index]}
            </option>
          ))}
        </select>
      </div>
      <div className="list-wrapper">
        {mangaIds.map((id, index) => (
          <a href={`http://localhost:5173/info?id=${id}`}>
            <div
              className="listItem"
              key={id}
              id={id}
              onClick={() => sendData(index)}
            >
              <img src={coverUrls[index]} alt="" />
              <div className="listItemText">
                <h3>{mangaTitles[index]}</h3>
                <p>Author: {mangaAuthor[index]}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
export default PopularByGernes;
