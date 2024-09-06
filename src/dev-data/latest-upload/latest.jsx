import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
import "./latest.css";
import useViewAll from "../view-all-hook/useViewAll";
function Latest() {
  const [limit, setLimit] = useState(6);
  const [queryParams, setQueryParams] = useState("");
  useEffect(() => {
    const params = new URLSearchParams();
    params.append("limit", limit);
    setQueryParams(params.toString());
  }, [limit]);
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
      <div className="view-all-wrapper">
        <a href="/viewall">
          <button className="view-all-button">View All</button>
        </a>
      </div>
    </>
  );
}
export default Latest;
