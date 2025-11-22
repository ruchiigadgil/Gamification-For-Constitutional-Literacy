import React, { useEffect, useState } from "react";

function News() {
  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [tickerIndex, setTickerIndex] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const categories = [
    "All",
    "Fundamental Rights",
    "Supreme Court",
    "Articles",
    "Amendments",
  ];

  // Fetch News
  useEffect(() => {
    fetch("http://localhost:5000/constitution-news")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.articles);
        setFiltered(data.articles);
      });
  }, []);

  // Filtering
  useEffect(() => {
    let result = articles;

    if (category !== "All") {
      result = result.filter((a) =>
        a.title?.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (searchQuery.trim() !== "") {
      result = result.filter((a) =>
        a.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFiltered(result);
    setCurrentPage(1);
  }, [category, searchQuery, articles]);

  // News Ticker
  useEffect(() => {
    if (filtered.length === 0) return;

    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % filtered.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [filtered]);

  // Pagination
  const lastIndex = currentPage * articlesPerPage;
  const firstIndex = lastIndex - articlesPerPage;
  const currentArticles = filtered.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filtered.length / articlesPerPage);

  // ----------------------------- LAVENDER UI STYLES -----------------------------

  const pageStyle = {
    fontFamily: "Segoe UI, sans-serif",
    padding: "20px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f3eaff 0%, #e3d6ff 50%, #f0e6ff 100%)",
  };

  const headerStyle = {
    padding: "25px",
    textAlign: "center",
    borderRadius: "16px",
    color: "#4b326b",
    background: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(8px)",
    marginBottom: "25px",
    fontSize: "32px",
    fontWeight: 700,
    letterSpacing: 0.7,
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  };

  const tickerStyle = {
    background: "rgba(255,255,255,0.6)",
    padding: "12px",
    borderRadius: "12px",
    color: "#4b326b",
    fontWeight: 600,
    marginBottom: "20px",
    textAlign: "center",
    backdropFilter: "blur(6px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  };

  const categoryContainer = {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
  };

  const categoryBtn = (active) => ({
    padding: "10px 18px",
    borderRadius: "25px",
    cursor: "pointer",
    border: active ? "2px solid #8156c6" : "2px solid #c9b3f2",
    background: active ? "#dcd0ff" : "rgba(255,255,255,0.5)",
    color: "#4b326b",
    fontWeight: 600,
    transition: "0.25s",
    boxShadow: active ? "0 4px 12px rgba(129,86,198,0.3)" : "none",
  });

  const searchStyle = {
    width: "100%",
    maxWidth: "520px",
    padding: "14px",
    margin: "0 auto 25px",
    display: "block",
    fontSize: "16px",
    borderRadius: "12px",
    border: "2px solid #d8c7ff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
  };

  const card = {
    background: "rgba(255,255,255,0.7)",
    padding: "18px",
    borderRadius: "14px",
    marginBottom: "18px",
    display: "flex",
    gap: "15px",
    backdropFilter: "blur(6px)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
    transition: "0.3s",
  };

  const imgStyle = {
    width: "150px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "12px",
  };

  const paginationStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "22px",
    gap: "10px",
  };

  const pageBtn = (active) => ({
    padding: "8px 14px",
    borderRadius: "8px",
    border: "2px solid #c9b3f2",
    cursor: "pointer",
    background: active ? "#d8c7ff" : "rgba(255,255,255,0.6)",
    color: "#4b326b",
    fontWeight: 600,
    transition: "0.25s",
    boxShadow: active ? "0 4px 10px rgba(0,0,0,0.1)" : "none",
  });

  // ---------------------------------------------------------------------------

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>📰 Constitution News Portal</div>

      {/* TICKER */}
      {filtered.length > 0 && (
        <div style={tickerStyle}>
          🔔 {filtered[tickerIndex]?.title?.slice(0, 120)}...
        </div>
      )}

      {/* CATEGORIES */}
      <div style={categoryContainer}>
        {categories.map((c) => (
          <button
            key={c}
            style={categoryBtn(category === c)}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search news..."
        style={searchStyle}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* ARTICLE CARDS */}
      {currentArticles.map((a, i) => (
        <div key={i} style={card}>
          {a.urlToImage && <img src={a.urlToImage} style={imgStyle} alt="" />}
          <div>
            <h3 style={{ color: "#3d2559" }}>{a.title}</h3>
            <p style={{ fontSize: "14px", opacity: 0.8 }}>{a.description}</p>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#7a52b3", fontWeight: 600 }}
            >
              Read full article →
            </a>
          </div>
        </div>
      ))}

      {/* PAGINATION */}
      <div style={paginationStyle}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            style={pageBtn(currentPage === i + 1)}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default News;
