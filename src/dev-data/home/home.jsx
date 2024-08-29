import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";

import "./home.css";
export const HomeContext = createContext();

function Home() {
  //manga search
  const [mangaTitle, setMangaTitle] = useState("");
  //manga datas
  const [mangaIds, setMangaIds] = useState([]);
  const [mangaTitles, setMangaTitles] = useState([]);
  const [coverUrls, setCoverUrls] = useState([]);
  const [error, setError] = useState(null);
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
        //set data
        setMangaTitles(titles);
        setMangaIds(ids);
        setCoverUrls(covers.filter(Boolean));
        console.log(titles);
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
  };

  return (
    <div>
      <div className="newest-wrapper">
        <Swiper slidesPerView={3} spaceBetween={30} className="mySwiper">
          <SwiperSlide>
            <img src="https://via.placeholder.com/300" alt="" />
          </SwiperSlide>
          <SwiperSlide>
            {" "}
            <img src="https://via.placeholder.com/300" alt="" />
          </SwiperSlide>
          <SwiperSlide>
            {" "}
            <img src="https://via.placeholder.com/300" alt="" />
          </SwiperSlide>
          <SwiperSlide>
            {" "}
            <img src="https://via.placeholder.com/300" alt="" />
          </SwiperSlide>
          <SwiperSlide>
            {" "}
            <img src="https://via.placeholder.com/300" alt="" />
          </SwiperSlide>
          <SwiperSlide>
            {" "}
            <img src="https://via.placeholder.com/300" alt="" />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="latest-uploads">
        <i className="fas fa-upload"></i> Latest Uploads
      </div>
      <p>Search for manga by title</p>
      <input type="text" id="titleInput" on onChange={handleTextChange} />
      <div className="list-wrapper">
        {mangaIds.map((id, index) => (
          <div className="listItem" key={id} id={id} onClick={handleClick}>
            <img src={coverUrls[index]} alt="" />
            <a href={`http://localhost:5173/info?id=${id}`}>
              {mangaTitles[index]}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
