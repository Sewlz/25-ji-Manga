import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
import "./viewall.css";

function Viewall() {
  //manga datas
  const [mangaIds, setMangaIds] = useState([]);
  const [mangaTitles, setMangaTitles] = useState([]);
  const [mangaAuthor, setMangaAuthor] = useState([]);
  const [mangaDescriptons, setMangaDescriptions] = useState([]);
  const [coverUrls, setCoverUrls] = useState([]);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const fetchManga = async () => {
      //get ids and titles
      try {
        const resp = await axios({
          method: "GET",
          url: `https://api.mangadex.org/manga`,
          params: {
            limit: limit,
            offset: offset,
          },
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
        //get descriptions
        const description = resp.data.data.map((manga) => {
          const desObj = manga.attributes.description;
          const firstDesKey = Object.keys(desObj)[0];
          const firstDes = desObj[firstDesKey];
          return firstDes;
        });
        //set data
        setMangaTitles(titles);
        setMangaIds(ids);
        setMangaAuthor(author);
        setMangaDescriptions(description);
        setCoverUrls(covers.filter(Boolean));
        console.log(titles);
      } catch (error) {
        setError("Error fetching manga.");
        console.error("Error fetching manga:", error);
      }
    };
    fetchManga();
  }, [offset, limit]);
  if (error) {
    return <div>{error}</div>;
  }
  function sendData(index) {
    sessionStorage.setItem("coverUrl", coverUrls[index]);
    sessionStorage.setItem("mangaTitle", mangaTitles[index]);
    sessionStorage.setItem("mangaDescription", mangaDescriptons[index]);
    sessionStorage.setItem("mangaAuthor", mangaAuthor[index]);
  }
  function nextPage() {
    setOffset(offset + limit);
  }
  function previousPage() {
    if (offset > 0) {
      setOffset(offset - limit);
    }
  }
  return (
    <>
      <div className="latest-uploads">
        <i className="fas fa-upload"></i> Latest Uploads
      </div>
      <div className="list-wrapper">
        {mangaIds.map((id, index) => (
          <a href={`/info?id=${id}`}>
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
      <div className="pagination-wrapper">
        <button onClick={previousPage}>
          <i class="fa-solid fa-arrow-left"></i> Previous Page
        </button>
        <button onClick={nextPage}>
          Next Page <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </>
  );
}
export default Viewall;
