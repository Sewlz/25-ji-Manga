import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
import "./latest.css";
import useViewAll from "../view-all-hook/useViewAll";
function Latest() {
  const [limit, setLimit] = useState(6);
  const [offset, setOffset] = useState(0);
  const [latestParams, setLatestParams] = useState("");
  useEffect(() => {
    const param = new URLSearchParams();
    param.append("limit", limit);
    param.append("offset", offset);
    setLatestParams(param.toString());
  }, [limit]);
  const { mangaData: latestData, error, isLoading } = useViewAll(latestParams);
  const {
    mangaIds: latestIds,
    mangaTitles: latestTitles,
    mangaDescriptions: latestDescriptions,
    mangaAuthor: latestAuthor,
    coverUrls: latestUrls,
  } = latestData;
  if (error) {
    return <div>{error}</div>;
  }
  function sendData(index) {
    sessionStorage.setItem("coverUrl", latestUrls[index]);
    sessionStorage.setItem("mangaTitle", latestTitles[index]);
    sessionStorage.setItem("mangaDescription", latestDescriptions[index]);
    sessionStorage.setItem("mangaAuthor", latestAuthor[index]);
  }
  return (
    <>
      <div className="latest-uploads">
        <i className="fas fa-upload"></i> Latest Uploads
      </div>
      <div className="list-wrapper">
        {latestIds.map((id, index) => (
          <a href={`/info?id=${id}`}>
            <div
              className="listItem"
              key={id}
              id={id}
              onClick={() => sendData(index)}
            >
              <img src={latestUrls[index]} alt="" />
              <div className="listItemText">
                <h3>{latestTitles[index]}</h3>
                <p>Author: {latestAuthor[index]}</p>
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
