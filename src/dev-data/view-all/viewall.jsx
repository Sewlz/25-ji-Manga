import React, { useEffect, useState } from "react";
import "./viewall.css";
import useViewAll from "../view-all-hook/useViewAll";
import { useLocation } from "react-router-dom";

function Viewall() {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tagId = queryParams.get("tag");
  const [order, setOrder] = useState({ followedCount: "desc" });
  const [fullParams, setFullParams] = useState(null);
  useEffect(() => {
    const params = new URLSearchParams();
    params.append("limit", limit);
    params.append("offset", offset);
    if (tagId) {
      params.append("includedTags[]", tagId);
      Object.keys(order).forEach((key) => {
        params.append(`order[${key}]`, order[key]);
      });
    }
    setFullParams(params.toString());
  }, [offset, tagId]);

  const { mangaData, error, isLoading } = useViewAll(fullParams);
  const { mangaIds, mangaTitles, mangaDescriptions, mangaAuthor, coverUrls } =
    mangaData;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!mangaIds || mangaIds.length === 0) return <div>No manga available.</div>;

  const sendData = (index) => {
    sessionStorage.setItem("coverUrl", coverUrls[index]);
    sessionStorage.setItem("mangaTitle", mangaTitles[index]);
    sessionStorage.setItem("mangaDescription", mangaDescriptions[index]);
    sessionStorage.setItem("mangaAuthor", mangaAuthor[index]);
  };

  const nextPage = () => setOffset((prevOffset) => prevOffset + limit);
  const previousPage = () =>
    setOffset((prevOffset) => Math.max(0, prevOffset - limit));

  return (
    <>
      <div className="latest-uploads">
        <i className="fas fa-upload"></i> View All
      </div>
      <div className="list-wrapper">
        {mangaIds.map((id, index) => (
          <a href={`/info?id=${id}`} key={id}>
            <div className="listItem" id={id} onClick={() => sendData(index)}>
              <img src={coverUrls[index]} alt={mangaTitles[index]} />
              <div className="listItemText">
                <h3>{mangaTitles[index]}</h3>
                <p>Author: {mangaAuthor[index]}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
      <div className="pagination-wrapper">
        <button onClick={previousPage} aria-label="Previous Page">
          <i className="fa-solid fa-arrow-left"></i> Previous Page
        </button>
        <button onClick={nextPage} aria-label="Next Page">
          Next Page <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </>
  );
}

export default Viewall;
