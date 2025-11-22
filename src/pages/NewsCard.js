import React from "react";

function NewsCard({ article }) {
  const cardStyle = {
    background: "white",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "18px",
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)", // soft shadow
  };

  const imageStyle = {
    width: "130px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "10px",
  };

  const titleStyle = {
    margin: "0 0 8px 0",
    fontSize: "18px",
    fontWeight: "bold",
    lineHeight: "1.2",
  };

  const descStyle = {
    margin: "0 0 10px 0",
    fontSize: "14px",
    color: "#555",
  };

  const linkStyle = {
    fontSize: "14px",
    color: "#1a73e8",
    textDecoration: "none",
    fontWeight: "bold",
  };

  return (
    <div style={cardStyle}>
      {article.urlToImage && (
        <img src={article.urlToImage} alt="news" style={imageStyle} />
      )}

      <div>
        <h3 style={titleStyle}>{article.title}</h3>
        <p style={descStyle}>{article.description}</p>

        <a href={article.url} target="_blank" rel="noreferrer" style={linkStyle}>
          Read More →
        </a>
      </div>
    </div>
  );
}

export default NewsCard;
