import React, { useState, useEffect } from "react";
import "../../styles/latest.css";
import useViewAll from "../../hooks/view-all-hook/useViewAll";
function Latest() {
  const [limit, setLimit] = useState(6);
  const [offset, setOffset] = useState(0);
  const [latestParams, setLatestParams] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append("limit", limit);
    params.append("offset", offset);
    setLatestParams(params.toString());
  }, [limit, offset]);

  const { mangaData, error, isLoading } = useViewAll(latestParams);
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
