"use client"

import { useLocation, useNavigate } from "react-router-dom"
// import "./Results.css"

const Results = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { score, total, articleNumber, answers } = location.state || {
    score: 0,
    total: 0,
    articleNumber: null,
    answers: [],
  }

  const percentage = Math.round((score / total) * 100)

  const getFeedbackMessage = () => {
    if (percentage >= 90) return "Excellent! You have a strong understanding of this article."
    if (percentage >= 70) return "Good job! You have a solid grasp of this article."
    if (percentage >= 50) return "Not bad! You understand the basics of this article."
    return "Keep studying! You'll get better with practice."
  }

  const handleTryAgain = () => {
    navigate(`/quiz/${articleNumber}`)
  }

  const handleBackToArticle = () => {
    navigate(`/learning/${articleNumber}`)
  }

  const handleBackToSelection = () => {
    navigate("/articleSection")
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          padding: "40px",
          maxWidth: "800px",
          width: "100%",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#4c1d95",
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "30px",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          Quiz Results
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8b5cf6, #a855f7)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
              transform: "scale(1)",
              transition: "transform 0.3s ease",
            }}
          >
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              {score}/{total}
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
              }}
            >
              {percentage}%
            </div>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: "1.2rem",
            color: "#4c1d95",
            marginBottom: "40px",
            fontWeight: "500",
            padding: "15px",
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1))",
            borderRadius: "10px",
            border: "1px solid rgba(139, 92, 246, 0.2)",
          }}
        >
          {getFeedbackMessage()}
        </p>

        <div
          style={{
            marginBottom: "40px",
          }}
        >
          <h3
            style={{
              color: "#4c1d95",
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Review Your Answers
          </h3>

          {answers.map((answer, index) => (
            <div
              key={index}
              style={{
                background: answer.isCorrect
                  ? "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1))"
                  : "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))",
                border: answer.isCorrect ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "15px",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              <p
                style={{
                  fontWeight: "bold",
                  color: "#1f2937",
                  marginBottom: "10px",
                  fontSize: "1.1rem",
                }}
              >
                {index + 1}. {answer.question}
              </p>
              <p
                style={{
                  marginBottom: "5px",
                  color: "#374151",
                }}
              >
                Your answer:{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color: answer.isCorrect ? "#059669" : "#dc2626",
                  }}
                >
                  {answer.selectedOption}
                </span>
              </p>
              {!answer.isCorrect && (
                <p
                  style={{
                    color: "#374151",
                  }}
                >
                  Correct answer:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#059669",
                    }}
                  >
                    {answer.correctOption}
                  </span>
                </p>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #a855f7)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "15px 30px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)",
              minWidth: "150px",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)"
              e.target.style.boxShadow = "0 6px 20px rgba(139, 92, 246, 0.4)"
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)"
              e.target.style.boxShadow = "0 4px 15px rgba(139, 92, 246, 0.3)"
            }}
            onClick={handleTryAgain}
          >
            Try Again
          </button>

          <button
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "15px 30px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
              minWidth: "150px",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)"
              e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)"
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)"
              e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)"
            }}
            onClick={handleBackToArticle}
          >
            Back to Article
          </button>

          <button
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              color: "#4c1d95",
              border: "2px solid #8b5cf6",
              borderRadius: "12px",
              padding: "15px 30px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(139, 92, 246, 0.2)",
              minWidth: "150px",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#8b5cf6"
              e.target.style.color = "white"
              e.target.style.transform = "translateY(-2px)"
              e.target.style.boxShadow = "0 6px 20px rgba(139, 92, 246, 0.3)"
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.9)"
              e.target.style.color = "#4c1d95"
              e.target.style.transform = "translateY(0)"
              e.target.style.boxShadow = "0 4px 15px rgba(139, 92, 246, 0.2)"
            }}
            onClick={handleBackToSelection}
          >
            Choose Another Article
          </button>
        </div>
      </div>
    </div>
  )
}

export default Results
