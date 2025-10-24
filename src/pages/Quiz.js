"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { fetchArticleData } from "../services/api"

const Quiz = () => {
  const { articleNumber } = useParams()
  const navigate = useNavigate()
  const [articleData, setArticleData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])

  useEffect(() => {
    const getArticleData = async () => {
      try {
        setLoading(true)
        const data = await fetchArticleData(articleNumber)
        setArticleData(data)
        setLoading(false)
      } catch (err) {
        setError("Failed to load quiz data. Please try again.")
        setLoading(false)
      }
    }

    getArticleData()
  }, [articleNumber])

  const handleOptionSelect = (option) => {
    if (isAnswered) return

    setSelectedOption(option)
    setIsAnswered(true)

    const currentQuestion = articleData.mcqs[currentQuestionIndex]
    const isCorrect = option === currentQuestion.answer

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1)
    }

    setAnswers([
      ...answers,
      {
        question: currentQuestion.question,
        selectedOption: option,
        correctOption: currentQuestion.answer,
        isCorrect,
      },
    ])
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < articleData.mcqs.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
      setSelectedOption(null)
      setIsAnswered(false)
    } else {
      navigate("/results", {
        state: {
          score,
          total: articleData.mcqs.length,
          articleNumber,
          answers,
        },
      })
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            border: "8px solid rgba(255, 255, 255, 0.3)",
            borderTop: "8px solid white",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "20px",
          }}
        ></div>
        <p style={{ color: "white", fontSize: "18px", fontWeight: "500" }}>Loading quiz questions...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
          padding: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            maxWidth: "400px",
          }}
        >
          <h3 style={{ color: "#764ba2", fontSize: "24px", marginBottom: "15px" }}>Error</h3>
          <p style={{ color: "#666", marginBottom: "25px" }}>{error}</p>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "25px",
              padding: "12px 30px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}
          >
            Back to Article Selection
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = articleData.mcqs[currentQuestionIndex]

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "30px",
            marginBottom: "20px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              color: "#764ba2",
              fontSize: "28px",
              fontWeight: "700",
              marginBottom: "20px",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            {articleData.article} Quiz
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "15px",
            }}
          >
            <span
              style={{
                color: "#666",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Question {currentQuestionIndex + 1} of {articleData.mcqs.length}
            </span>

            <div
              style={{
                flex: "1",
                maxWidth: "300px",
                height: "8px",
                backgroundColor: "#f0f0f0",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${((currentQuestionIndex + 1) / articleData.mcqs.length) * 100}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "10px",
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content - 2 Boxes on 1 Line */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {/* Question Box */}
          <div
            style={{
              flex: "1",
              minWidth: "300px",
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3
              style={{
                color: "#333",
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "25px",
                lineHeight: "1.5",
              }}
            >
              {currentQuestion.question}
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  disabled={isAnswered}
                  style={{
                    padding: "15px 20px",
                    borderRadius: "15px",
                    border: "2px solid",
                    borderColor: isAnswered
                      ? option === currentQuestion.answer
                        ? "#4CAF50"
                        : option === selectedOption && option !== currentQuestion.answer
                          ? "#f44336"
                          : "#e0e0e0"
                      : "#e0e0e0",
                    backgroundColor: isAnswered
                      ? option === currentQuestion.answer
                        ? "#e8f5e8"
                        : option === selectedOption && option !== currentQuestion.answer
                          ? "#ffebee"
                          : "white"
                      : "white",
                    color: isAnswered
                      ? option === currentQuestion.answer
                        ? "#2e7d32"
                        : option === selectedOption && option !== currentQuestion.answer
                          ? "#c62828"
                          : "#333"
                      : "#333",
                    fontSize: "16px",
                    fontWeight: "500",
                    cursor: isAnswered ? "default" : "pointer",
                    transition: "all 0.3s ease",
                    textAlign: "left",
                  }}
                  onMouseOver={(e) => {
                    if (!isAnswered) {
                      e.target.style.borderColor = "#764ba2"
                      e.target.style.backgroundColor = "#f8f6ff"
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isAnswered) {
                      e.target.style.borderColor = "#e0e0e0"
                      e.target.style.backgroundColor = "white"
                    }
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback & Navigation Box */}
          <div
            style={{
              flex: "0 0 300px",
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {isAnswered ? (
              <>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: selectedOption === currentQuestion.answer ? "#4CAF50" : "#f44336",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                    fontSize: "30px",
                  }}
                >
                  {selectedOption === currentQuestion.answer ? "✓" : "✗"}
                </div>

                <p
                  style={{
                    color: selectedOption === currentQuestion.answer ? "#2e7d32" : "#c62828",
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "20px",
                  }}
                >
                  {selectedOption === currentQuestion.answer
                    ? "Correct!"
                    : `Incorrect. The correct answer is: ${currentQuestion.answer}`}
                </p>

                <button
                  onClick={handleNextQuestion}
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "25px",
                    padding: "15px 30px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                    boxShadow: "0 4px 15px rgba(118, 75, 162, 0.3)",
                  }}
                  onMouseOver={(e) => (e.target.style.transform = "translateY(-2px)")}
                  onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}
                >
                  {currentQuestionIndex < articleData.mcqs.length - 1 ? "Next Question" : "See Results"}
                </button>
              </>
            ) : (
              <div
                style={{
                  color: "#999",
                  fontSize: "16px",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 15px",
                    fontSize: "24px",
                  }}
                >
                  ?
                </div>
                Select an answer to continue
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quiz
