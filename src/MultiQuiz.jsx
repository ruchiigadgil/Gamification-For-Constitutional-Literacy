"use client"

import { useState, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import io from "socket.io-client"

function MultiQuiz() {
  const [socket, setSocket] = useState(null)
  const [name, setName] = useState("")
  const [room, setRoom] = useState("")
  const [hasJoined, setHasJoined] = useState(false)
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState([])
  const [answered, setAnswered] = useState(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null)
  const [timer, setTimer] = useState(null)
  const [scores, setScores] = useState([])
  const [winner, setWinner] = useState(null)
  const [connectionError, setConnectionError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name && room) setHasJoined(true)
  }

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("ws://localhost:5000")

    newSocket.on("connect", () => {
      setConnectionError(false)
    })

    newSocket.on("connect_error", () => {
      setConnectionError(true)
      toast.error("Failed to connect to server", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
      })
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  useEffect(() => {
    if (timer === null || timer <= 0) return

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (!answered) {
            setAnswered(true)
            toast.warn("Time's up!", {
              position: "bottom-center",
              autoClose: 2000,
              theme: "dark",
            })
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timer, answered])

  useEffect(() => {
    if (hasJoined && socket) {
      socket.emit("joinRoom", room, name)
    }
  }, [hasJoined, room, name, socket])

  useEffect(() => {
    if (!socket) return

    const handleMessage = (message) => {
      toast(`${message} joined`, {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
      })
    }

    const handleNewQuestion = ({ question, answers, timer }) => {
      setQuestion(question)
      setOptions(answers)
      setAnswered(false)
      setTimer(timer)
      setSelectedAnswerIndex(null)
    }

    const handleAnswerResult = ({ isCorrect, playerName, scores }) => {
      if (isCorrect) {
        toast(`✅ Correct! ${playerName} got it right.`, {
          position: "bottom-center",
          autoClose: 2000,
          theme: "dark",
        })
      }
      setScores(scores)
    }

    const handleGameOver = ({ winner }) => {
      setWinner(winner)
    }

    socket.on("message", handleMessage)
    socket.on("newQuestion", handleNewQuestion)
    socket.on("answerResult", handleAnswerResult)
    socket.on("gameOver", handleGameOver)

    return () => {
      socket.off("message", handleMessage)
      socket.off("newQuestion", handleNewQuestion)
      socket.off("answerResult", handleAnswerResult)
      socket.off("gameOver", handleGameOver)
    }
  }, [socket])

  const handleAnswer = (index) => {
    if (!answered && socket) {
      setSelectedAnswerIndex(index)
      setAnswered(true)
      socket.emit("submitAnswer", room, index)
    }
  }

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  }

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    maxWidth: "600px",
    width: "100%",
    textAlign: "center",
  }

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "700",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "30px",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  }

  const inputStyle = {
    width: "100%",
    padding: "15px 20px",
    margin: "10px 0",
    border: "2px solid #e1e5e9",
    borderRadius: "12px",
    fontSize: "16px",
    transition: "all 0.3s ease",
    outline: "none",
    background: "rgba(255, 255, 255, 0.9)",
  }

  const buttonStyle = {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    padding: "15px 30px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "20px",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  }

  const optionButtonStyle = {
    width: "100%",
    padding: "15px 20px",
    margin: "8px 0",
    border: "2px solid #e1e5e9",
    borderRadius: "12px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#333",
  }

  const selectedOptionStyle = {
    ...optionButtonStyle,
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "2px solid #667eea",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
  }

  const infoBoxStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(102, 126, 234, 0.1)",
    padding: "15px 20px",
    borderRadius: "12px",
    margin: "20px 0",
    border: "1px solid rgba(102, 126, 234, 0.2)",
  }

  const scoreContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "15px",
    marginTop: "25px",
  }

  const scoreItemStyle = {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    padding: "10px 20px",
    borderRadius: "25px",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
  }

  if (connectionError) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Multi-Player Quiz 💡</h1>
          <p style={{ color: "#e74c3c", fontSize: "18px", fontWeight: "500" }}>
            Failed to connect to server. Please check if the server is running.
          </p>
        </div>
      </div>
    )
  }

  if (winner) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1
            style={{
              fontSize: "3rem",
              color: "#27ae60",
              marginBottom: "20px",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            🏆 Winner is {winner}
          </h1>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <ToastContainer />
      <div style={cardStyle}>
        {!hasJoined ? (
          <div>
            <h1 style={titleStyle}>Multi-Player Quiz 💡</h1>
            <form onSubmit={handleSubmit}>
              <input
                required
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e1e5e9")}
              />
              <input
                required
                placeholder="Enter room number"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e1e5e9")}
              />
              <button
                type="submit"
                style={buttonStyle}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.6)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)"
                }}
              >
                JOIN ROOM
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h1 style={titleStyle}>Multi-Player Quiz 💡</h1>
            <div style={infoBoxStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <span style={{ fontWeight: "600", color: "#667eea" }}>Room ID: {room}</span>
                <span
                  style={{
                    fontWeight: "600",
                    color: timer <= 10 ? "#e74c3c" : "#667eea",
                    fontSize: "16px",
                  }}
                >
                  ⏳ Time: {timer}s
                </span>
              </div>
            </div>

            {question ? (
              <div>
                <div
                  style={{
                    background: "rgba(102, 126, 234, 0.05)",
                    padding: "25px",
                    borderRadius: "15px",
                    margin: "25px 0",
                    border: "1px solid rgba(102, 126, 234, 0.1)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      color: "#333",
                      lineHeight: "1.6",
                      margin: "0",
                    }}
                  >
                    {question}
                  </p>
                </div>

                <div style={{ margin: "25px 0" }}>
                  {options.map((answer, index) => (
                    <button
                      key={index}
                      style={selectedAnswerIndex === index ? selectedOptionStyle : optionButtonStyle}
                      onClick={() => handleAnswer(index)}
                      disabled={answered}
                      onMouseEnter={(e) => {
                        if (selectedAnswerIndex !== index && !answered) {
                          e.target.style.borderColor = "#667eea"
                          e.target.style.transform = "translateY(-1px)"
                          e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.2)"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedAnswerIndex !== index) {
                          e.target.style.borderColor = "#e1e5e9"
                          e.target.style.transform = "translateY(0)"
                          e.target.style.boxShadow = "none"
                        }
                      }}
                    >
                      {answer}
                    </button>
                  ))}
                </div>

                {scores.length > 0 && (
                  <div>
                    <h3
                      style={{
                        color: "#667eea",
                        marginBottom: "15px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                      }}
                    >
                      Leaderboard
                    </h3>
                    <div style={scoreContainerStyle}>
                      {scores.map((player, index) => (
                        <div key={index} style={scoreItemStyle}>
                          {player.name}: {player.score}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  padding: "40px",
                  color: "#667eea",
                  fontSize: "1.1rem",
                  fontWeight: "500",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "4px solid #f3f3f3",
                    borderTop: "4px solid #667eea",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto 20px",
                  }}
                ></div>
                Loading question...
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default MultiQuiz
