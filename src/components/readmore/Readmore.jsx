import React, { useState, useRef, useEffect } from "react";
import "../../styles/ReadMore.css";

const ReadMore = ({ text, maxHeight }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      setHeight(
        isExpanded ? `${contentRef.current.scrollHeight}px` : `${maxHeight}px`
      );
    }
  }, [isExpanded, maxHeight]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="read-more-container">
      <div
        className="read-more-content"
        ref={contentRef}
        style={{
          maxHeight: height,
          opacity: isExpanded ? "1" : "0.7",
          marginTop: isExpanded ? "10px" : "0",
        }}
      >
        {text}
      </div>
      <button onClick={toggleExpand} className="read-more-button">
        {isExpanded ? "Read Less" : "Read More"}
      </button>
    </div>
  );
};

export default ReadMore;
