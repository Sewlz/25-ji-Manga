import React, { useContext } from "react";
import "./latest.css";
import { HomeContext } from "../home/home";
function Latest() {
  const { coverUrls, mangaTitles, mangaIds } = useContext(HomeContext);
  const handleClick = (event) => {
    const selectedId = event.currentTarget.id;
    setGlobId(selectedId);
  };
  return (
    <>
      <div className="latest-uploads">
        <i className="fas fa-upload"></i> Latest Uploads
      </div>
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
    </>
  );
}
export default Latest;
