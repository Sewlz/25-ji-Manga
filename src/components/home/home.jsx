import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css/autoplay";
import "swiper/css";
import "../../styles/home.css";
import useViewAll from "../../hooks/view-all-hook/useViewAll";
function Home() {
  const [limit, setLimit] = useState(5);
  const [order, setOrder] = useState({ followedCount: "desc" });
  const [queryParams, setQueryParams] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append("limit", limit);
    Object.keys(order).forEach((key) => {
      params.append(`order[${key}]`, order[key]);
    });
    setQueryParams(params.toString());
  }, [limit, order]);

  const { mangaData, error, isLoading } = useViewAll(queryParams);
  const { mangaIds, mangaTitles, mangaDescriptions, mangaAuthor, coverUrls } =
    mangaData;

  if (error) {
    return <div>{error}</div>;
  }
  function sendData(index) {
    sessionStorage.setItem("coverUrl", coverUrls[index]);
    sessionStorage.setItem("mangaTitle", mangaTitles[index]);
    sessionStorage.setItem("mangaDescription", mangaDescriptions[index]);
    sessionStorage.setItem("mangaAuthor", mangaAuthor[index]);
  }
  return (
    <>
      <div className="title-wrapper">
        <span>
          <i className="fas fa-star"></i> Popular Titles
        </span>
      </div>

      <div className="popular-wrapper">
        <Swiper
          slidesPerView={1}
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
            <SwiperSlide key={index} onClick={() => sendData(index)}>
              <a href={`/info?id=${mangaIds[index]}`}>
                <div
                  className="popular-card"
                  style={{
                    backgroundImage: `url(${coverUrls[index]})`,
                    backgroundSize: "cover",
                  }}
                >
                  <img className="popular-img" src={url} alt="" />
                  <div className="popular-info">
                    <h3>{mangaTitles[index]}</h3>
                    <p>{mangaDescriptions[index]}</p>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}

export default Home;
