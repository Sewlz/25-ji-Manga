import { useState, useEffect } from "react";
import axios from "axios";

const useViewAll = (params) => {
  const [mangaData, setMangaData] = useState({
    mangaIds: [],
    mangaTitles: [],
    mangaDescriptions: [],
    mangaAuthor: [],
    coverUrls: [],
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMangaData = async (retryCount = 0) => {
    try {
      setIsLoading(true);
      console.log("Request Params:", params);
      const resp = await axios.get(`https://api.mangadex.org/manga`, {
        params,
      });
      const ids = resp.data.data.map((manga) => manga.id);

      const titles = resp.data.data.map((manga) => {
        const titleObj = manga.attributes.title;
        const firstTitleKey = Object.keys(titleObj)[0];
        return titleObj[firstTitleKey];
      });

      const descriptions = resp.data.data.map((manga) => {
        const desObj = manga.attributes.description;
        const firstDesKey = Object.keys(desObj)[0];
        return desObj[firstDesKey];
      });

      const authors = await Promise.all(
        resp.data.data.map(async (manga) => {
          const authorRel = manga.relationships.find(
            (rel) => rel.type === "author"
          );
          if (authorRel) {
            const authorResp = await axios.get(
              `https://api.mangadex.org/author/${authorRel.id}`
            );
            return authorResp.data.data.attributes.name;
          }
          return null;
        })
      );

      const covers = await Promise.all(
        resp.data.data.map(async (manga) => {
          const coverArtRel = manga.relationships.find(
            (rel) => rel.type === "cover_art"
          );
          if (coverArtRel) {
            const coverResp = await axios.get(
              `https://api.mangadex.org/cover/${coverArtRel.id}`
            );
            return `https://uploads.mangadex.org/covers/${manga.id}/${coverResp.data.data.attributes.fileName}`;
          }
          return null;
        })
      );

      setMangaData({
        mangaIds: ids,
        mangaTitles: titles,
        mangaDescriptions: descriptions,
        mangaAuthor: authors,
        coverUrls: covers,
      });
    } catch (error) {
      if (error.response?.status === 429 && retryCount < 5) {
        const retryAfter = (retryCount + 1) * 2000; // Increase delay with exponential backoff
        setTimeout(() => fetchMangaData(retryCount + 1), retryAfter);
      } else if (error.response?.status === 403) {
        setError(
          "Access forbidden: Ensure you have the necessary permissions."
        );
      } else {
        setError("Error fetching manga.");
      }
      console.error("Error fetching manga:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMangaData();
  }, [JSON.stringify(params)]);

  return { mangaData, error, isLoading };
};

export default useViewAll;
