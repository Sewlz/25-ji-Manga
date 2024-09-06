import React, { useState, useEffect } from "react";
import axios from "axios";
import "./popbygernes.css";
import useViewAll from "../view-all-hook/useViewAll";
function PopularByGernes() {
  //Tags Virables
  const [selectedGern, setSelectedGern] = useState(null);
  const [tagIds, setTagIds] = useState([]);
  const [tagNames, setTagNames] = useState([]);
  //Params Virables
  const [limit, setLimit] = useState(6);
  const [order, setOrder] = useState({ followedCount: "desc" });
  const [queryParams, setQueryParams] = useState("");
  //Fetching Tags From Local
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const storedIds = localStorage.getItem("tagIds");
        const storedNames = localStorage.getItem("tagNames");

        if (storedIds && storedNames) {
          setTagIds(JSON.parse(storedIds));
          setTagNames(JSON.parse(storedNames));

          if (!selectedGern && JSON.parse(storedIds).length > 0) {
            setSelectedGern(JSON.parse(storedIds)[0]);
          }
        } else {
          const resp = await axios.get("../dev-data/tags.json");
          const ids = resp.data.data.map((tag) => tag.id);
          const names = resp.data.data.map((tag) => tag.attributes.name.en);

          setTagIds(ids);
          setTagNames(names);

          localStorage.setItem("tagIds", JSON.stringify(ids));
          localStorage.setItem("tagNames", JSON.stringify(names));

          if (!selectedGern && ids.length > 0) {
            setSelectedGern(ids[0]);
          }
        }
      } catch (error) {
        setError("Error fetching tags.");
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);
  //Params constructing
  useEffect(() => {
    const params = new URLSearchParams();

    params.append("limit", limit);

    if (selectedGern) {
      params.append("includedTags[]", selectedGern);
    }
    Object.keys(order).forEach((key) => {
      params.append(`order[${key}]`, order[key]);
    });

    setQueryParams(params.toString());
  }, [limit, selectedGern, order]);
  //Manga Fetching Through Custom Hook
  const { mangaData, error, isLoading } = useViewAll(queryParams);
  const { mangaIds, mangaTitles, mangaDescriptions, mangaAuthor, coverUrls } =
    mangaData;
  //Send Data To Session Storage
  function sendData(index) {
    sessionStorage.setItem("coverUrl", coverUrls[index]);
    sessionStorage.setItem("mangaTitle", mangaTitles[index]);
    sessionStorage.setItem("mangaDescription", mangaDescriptions[index]);
    sessionStorage.setItem("mangaAuthor", mangaAuthor[index]);
  }
  function getGerns(event) {
    setSelectedGern(event.target.value);
  }
  //Rendering Components
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <>
      <div className="latest-uploads">
        <span>
          <i class="fa-solid fa-list"></i> Popular By Gernes
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
        <a href={`/viewall?tag=${selectedGern}`}>
          <button>View More</button>
        </a>
      </div>
    </>
  );
}
export default PopularByGernes;
