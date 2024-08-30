import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
export const HomeContext = createContext();

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css/autoplay";
import "swiper/css";
import "./home.css";
import Latest from "../latest-upload/latest";

function Home() {
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
  }, []);
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <HomeContext.Provider value={{ coverUrls, mangaTitles, mangaIds }}>
      <div>
        <div className="newest-wrapper">
          <Swiper
            slidesPerView={5}
            // spaceBetween={30}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            className="mySwiper"
          >
            {coverUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <a href={`http://localhost:5173/info?id=${mangaIds[index]}`}>
                  <img className="newest-img" src={url} alt="" />
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <Latest />
      </div>
    </HomeContext.Provider>
  );
}

export default Home;
