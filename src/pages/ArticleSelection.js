"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

const ArticleSelection = () => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState("")

  // Generate article numbers from 1 to 448
  const articleNumbers = Array.from({ length: 448 }, (_, i) => i + 1)

  const handleArticleSelect = (articleNumber) => {
    navigate(`/learning/${articleNumber}`)
  }

  const filteredArticles = articleNumbers.filter((num) => num.toString().includes(searchValue))

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            marginBottom: "30px",
          }}
        >
          <input
            type="text"
            placeholder="Search article number..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              width: "100%",
              padding: "15px 20px",
              fontSize: "16px",
              border: "none",
              borderRadius: "15px",
              background: "rgba(255, 255, 255, 0.9)",
              color: "#333",
              outline: "none",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.target.style.transform = "translateY(-2px)"
              e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.15)"
            }}
            onBlur={(e) => {
              e.target.style.transform = "translateY(0)"
              e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)"
            }}
          />
        </div>

        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              color: "white",
              fontSize: "2.5rem",
              fontWeight: "bold",
              margin: "0 0 10px 0",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
              background: "linear-gradient(45deg, #ffffff, #e0e0ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Select an Article to Learn
          </h2>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "1.1rem",
              margin: "0",
              textShadow: "0 1px 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            Choose from Articles 1-448 of the Indian Constitution
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
            gap: "15px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {filteredArticles.map((num) => (
            <button
              key={num}
              onClick={() => handleArticleSelect(num)}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "15px",
                padding: "15px 10px",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                minHeight: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px) scale(1.05)"
                e.target.style.background = "rgba(255, 255, 255, 0.3)"
                e.target.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.2)"
                e.target.style.borderColor = "rgba(255, 255, 255, 0.5)"
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0) scale(1)"
                e.target.style.background = "rgba(255, 255, 255, 0.2)"
                e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)"
                e.target.style.borderColor = "rgba(255, 255, 255, 0.3)"
              }}
              onMouseDown={(e) => {
                e.target.style.transform = "translateY(-1px) scale(0.98)"
              }}
              onMouseUp={(e) => {
                e.target.style.transform = "translateY(-3px) scale(1.05)"
              }}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ArticleSelection
