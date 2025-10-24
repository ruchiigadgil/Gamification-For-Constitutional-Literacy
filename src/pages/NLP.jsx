import { useState, useRef, useEffect } from "react";

function NLP() {
  const [messages, setMessages] = useState([
    {
      text: "Ask for Tools",
      isUser: false,
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState(null);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [useSpeechInput, setUseSpeechInput] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const chatBoxRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isThinking]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const addMessage = (message, isUser = false) => {
    setMessages((prev) => [...prev, { text: message, isUser }]);
  };

  // const sendMessage = async () => {
  //   const message = useSpeechInput ? transcript.trim() : inputMessage.trim()
  //   if (message === "") return

  //   addMessage(message, true)
  //   setInputMessage("")
  //   setIsThinking(true)
  //   setError(null)

  //   try {
  //     const response = await fetch("http://127.0.0.1:5001/generate2", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ query: message }),
  //     })

  //     if (!response.ok) {
  //       throw new Error("Failed to get response from server")
  //     }

  //     const data = await response.json()
  //     setIsThinking(false)
  //     setIsTyping(true)

  //     const reply = data.reply || "No response received"
  //     const citation = data.citations || ""
  //     const warning = data.user_usage_warning || ""

  //     setTimeout(() => {
  //       addMessage(`${reply}\n📌 ${citation}\n⚠️ ${warning}`)
  //       setIsTyping(false)
  //       setTranscript("")
  //     }, 500)
  //   } catch (err) {
  //     setIsThinking(false)
  //     setError("Sorry, there was an error processing your request. Please try again.")
  //     console.error("Error:", err)
  //   }
  // }

  const sendMessage = async () => {
    const message = useSpeechInput ? transcript.trim() : inputMessage.trim();
    if (message === "") return;

    addMessage(message, true);
    setInputMessage("");
    setIsThinking(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5001/generate2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setIsThinking(false);
      setIsTyping(true);

      const reply = data.reply || "No response received";
      const citation = data.citations || "";
      const warning = data.user_usage_warning || "";

      setTimeout(() => {
        addMessage(`${reply}\n📌 ${citation}\n⚠️ ${warning}`);
        setIsTyping(false);
        setTranscript("");
      }, 500);
    } catch (err) {
      setIsThinking(false);
      setError(
        `Sorry, there was an error processing your request. Please try again. Details: ${err.message}`
      );
      console.error("Fetch error:", err);
    }
  };

  // const sendMessage = async () => {
  //   const message = useSpeechInput ? transcript.trim() : inputMessage.trim();
  //   if (message === "") return;

  //   addMessage(message, true);
  //   setInputMessage("");
  //   setIsThinking(true);
  //   setError(null);

  //   try {
  //     const response = await fetch("http://127.0.0.1:5001/generate2", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ query: message }),
  //     });

  //     console.log("Response status:", response.status, response.statusText);
  //     const text = await response.text(); // Log raw response
  //     console.log("Response body:", text);

  //     if (!response.ok) {
  //       throw new Error(
  //         `HTTP error! status: ${response.status} - ${response.statusText}`
  //       );
  //     }

  //     const data = await response.json();
  //     setIsThinking(false);
  //     setIsTyping(true);

  //     const reply = data.reply || "No response received";
  //     const citation = data.citations || "";
  //     const warning = data.user_usage_warning || "";

  //     setTimeout(() => {
  //       addMessage(`${reply}\n📌 ${citation}\n⚠️ ${warning}`);
  //       setIsTyping(false);
  //       setTranscript("");
  //     }, 500);
  //   } catch (err) {
  //     setIsThinking(false);
  //     setError(
  //       `Sorry, there was an error processing your request. Please try again. Details: ${err.message}`
  //     );
  //     console.error("Fetch error:", err);
  //   }
  // };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const speakText = (text, messageIndex) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    if (speakingMessageId === messageIndex) {
      setSpeakingMessageId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    setSpeakingMessageId(messageIndex);

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeechInput = () => {
    setUseSpeechInput(!useSpeechInput);
    setTranscript("");
  };

  const simulateSpeechRecognition = (action) => {
    if (action === "start") {
      setListening(true);
      setTimeout(() => {
        setTranscript("What is Article 21 of the Indian Constitution?");
        setListening(false);
      }, 2000);
    } else if (action === "stop") {
      setListening(false);
    } else if (action === "reset") {
      setTranscript("");
      setListening(false);
    }
  };

  const containerStyle = {
    height: "100vh",
    width: "100%",
    maxWidth: "100vw",
    background:
      "linear-gradient(135deg, #0f0f23 0%, #1a1b3e 50%, #2d1b69 100%)",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: "#e2e8f0",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  };

  const headerStyle = {
    padding: "16px 24px",
    borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
    background: "rgba(15, 15, 35, 0.8)",
    backdropFilter: "blur(10px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
    flexWrap: "wrap",
    gap: "12px",
    minHeight: "auto",
  };

  const titleContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  };

  const titleStyle = {
    fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
    fontWeight: "700",
    background: "linear-gradient(135deg, #8b5cf6, #a855f7, #c084fc)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  };

  const subtitleStyle = {
    fontSize: "0.875rem",
    color: "#94a3b8",
    fontWeight: "400",
    margin: 0,
  };

  const statusStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "0.875rem",
    color: "#94a3b8",
  };

  const mainContentStyle = {
    flex: 1,
    display: "flex",
    flexDirection: window.innerWidth <= 768 ? "column" : "row",
    gap: "clamp(12px, 2vw, 24px)",
    padding: "clamp(12px, 2vw, 24px)",
    minHeight: 0,
    boxSizing: "border-box",
  };

  const chatSectionStyle = {
    flex: window.innerWidth <= 768 ? 1 : 3,
    display: "flex",
    flexDirection: "column",
    background: "rgba(26, 27, 62, 0.6)",
    borderRadius: "16px",
    border: "1px solid rgba(139, 92, 246, 0.2)",
    backdropFilter: "blur(10px)",
    minHeight: window.innerWidth <= 768 ? "300px" : 0,
    minWidth: 0,
  };

  const chatHeaderStyle = {
    padding: "clamp(12px, 2vw, 16px) clamp(16px, 3vw, 20px)",
    borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
    flexWrap: "wrap",
    gap: "8px",
  };

  const chatTitleStyle = {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#e2e8f0",
    margin: 0,
  };

  const messageCountStyle = {
    fontSize: "0.75rem",
    color: "#94a3b8",
    background: "rgba(139, 92, 246, 0.1)",
    padding: "4px 8px",
    borderRadius: "12px",
  };

  const chatBoxStyle = {
    flex: 1,
    overflowY: "auto",
    padding: "clamp(16px, 3vw, 20px)",
    display: "flex",
    flexDirection: "column",
    gap: "clamp(12px, 2vw, 16px)",
    minHeight: 0,
    scrollbarWidth: "thin",
    scrollbarColor: "#8b5cf6 transparent",
  };

  const inputSectionStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "rgba(26, 27, 62, 0.6)",
    borderRadius: "16px",
    border: "1px solid rgba(139, 92, 246, 0.2)",
    backdropFilter: "blur(10px)",
    minHeight: window.innerWidth <= 768 ? "250px" : 0,
    minWidth: window.innerWidth <= 768 ? "100%" : "280px",
    maxWidth: window.innerWidth <= 768 ? "100%" : "400px",
  };

  const inputHeaderStyle = {
    padding: "clamp(12px, 2vw, 16px) clamp(16px, 3vw, 20px)",
    borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
    flexWrap: "wrap",
  };

  const inputBodyStyle = {
    flex: 1,
    padding: "clamp(16px, 3vw, 20px)",
    display: "flex",
    flexDirection: "column",
    gap: "clamp(12px, 2vw, 16px)",
    minHeight: 0,
  };

  const messageStyle = (isUser) => ({
    display: "flex",
    justifyContent: isUser ? "flex-end" : "flex-start",
    animation: "slideInUp 0.3s ease-out",
  });

  const messageContentStyle = (isUser) => ({
    maxWidth: window.innerWidth <= 768 ? "90%" : "80%",
    padding: "clamp(10px, 2vw, 12px) clamp(12px, 3vw, 16px)",
    borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
    background: isUser
      ? "linear-gradient(135deg, #7c3aed, #8b5cf6)"
      : "rgba(45, 27, 105, 0.6)",
    color: "#ffffff",
    border: isUser ? "none" : "1px solid rgba(139, 92, 246, 0.3)",
    boxShadow: isUser
      ? "0 8px 16px rgba(124, 58, 237, 0.4)"
      : "0 4px 12px rgba(0, 0, 0, 0.3)",
    fontSize: "clamp(0.8rem, 2vw, 0.875rem)",
    lineHeight: "1.5",
    whiteSpace: "pre-wrap",
    backdropFilter: "blur(10px)",
    wordWrap: "break-word",
    overflowWrap: "break-word",
  });

  const listenButtonStyle = (isSpeaking) => ({
    marginTop: "8px",
    padding: "4px 8px",
    background: isSpeaking ? "#ef4444" : "#6b7280",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.7rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    opacity: 0.8,
  });

  const thinkingStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    color: "#8b5cf6",
    fontSize: "0.875rem",
    fontWeight: "500",
  };

  const typingIndicatorStyle = {
    display: "flex",
    justifyContent: "flex-start",
  };

  const dotStyle = (delay) => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#8b5cf6",
    animation: `pulse 1.4s ease-in-out infinite`,
    animationDelay: delay,
    marginRight: "4px",
  });

  const errorStyle = {
    padding: "12px 16px",
    background: "rgba(239, 68, 68, 0.2)",
    color: "#fca5a5",
    borderRadius: "8px",
    fontSize: "0.875rem",
    textAlign: "center",
    border: "1px solid rgba(239, 68, 68, 0.3)",
  };

  const toggleLabelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "0.875rem",
    color: "#e2e8f0",
    fontWeight: "500",
  };

  const checkboxStyle = {
    width: "16px",
    height: "16px",
    accentColor: "#8b5cf6",
    cursor: "pointer",
  };

  const speechControlsStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    flex: 1,
  };

  const micStatusStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.875rem",
    color: listening ? "#10b981" : "#94a3b8",
    fontWeight: "500",
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "clamp(6px, 1vw, 8px)",
    flexWrap: window.innerWidth <= 480 ? "wrap" : "nowrap",
  };

  const speechButtonStyle = (type, disabled = false) => {
    const colors = {
      start: "#10b981",
      stop: "#ef4444",
      reset: "#f59e0b",
    };

    return {
      flex: window.innerWidth <= 480 ? "1 1 100px" : 1,
      padding: "clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 12px)",
      background: disabled ? "#374151" : colors[type],
      color: disabled ? "#6b7280" : "#ffffff",
      border: "none",
      borderRadius: "8px",
      fontSize: "clamp(0.75rem, 2vw, 0.8rem)",
      fontWeight: "500",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.2s ease",
      opacity: disabled ? 0.5 : 1,
      minWidth: "60px",
    };
  };

  const transcriptAreaStyle = {
    flex: 1,
    padding: "clamp(10px, 2vw, 12px)",
    background: "rgba(139, 92, 246, 0.1)",
    borderRadius: "8px",
    fontSize: "clamp(0.8rem, 2vw, 0.875rem)",
    color: "#e2e8f0",
    border: "1px solid rgba(139, 92, 246, 0.2)",
    fontStyle: transcript ? "normal" : "italic",
    minHeight: window.innerWidth <= 768 ? "80px" : "60px",
    resize: "vertical",
    outline: "none",
    fontFamily: "inherit",
  };

  const textInputAreaStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    flex: 1,
  };

  const textInputStyle = {
    flex: 1,
    padding: "clamp(10px, 2vw, 12px)",
    background: "rgba(45, 27, 105, 0.3)",
    border: "1px solid rgba(139, 92, 246, 0.2)",
    borderRadius: "8px",
    fontSize: "clamp(0.8rem, 2vw, 0.875rem)",
    color: "#e2e8f0",
    outline: "none",
    transition: "all 0.2s ease",
    minHeight: window.innerWidth <= 768 ? "80px" : "60px",
    resize: "vertical",
    fontFamily: "inherit",
  };

  const sendButtonStyle = (disabled) => ({
    padding: "clamp(10px, 2vw, 12px) clamp(16px, 3vw, 20px)",
    background: disabled
      ? "rgba(107, 114, 128, 0.3)"
      : "linear-gradient(135deg, #7c3aed, #8b5cf6)",
    color: disabled ? "#6b7280" : "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "clamp(0.8rem, 2vw, 0.875rem)",
    fontWeight: "600",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    opacity: disabled ? 0.5 : 1,
    width: "100%",
  });

  const keyframes = `
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(15px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 80%, 100% {
        transform: scale(0);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }

    * {
      box-sizing: border-box;
    }

    *::-webkit-scrollbar {
      width: 6px;
    }

    *::-webkit-scrollbar-track {
      background: transparent;
    }

    *::-webkit-scrollbar-thumb {
      background-color: #8b5cf6;
      border-radius: 3px;
    }

    *::-webkit-scrollbar-thumb:hover {
      background-color: #7c3aed;
    }

    @media (max-width: 768px) {
      .responsive-text {
        font-size: clamp(0.75rem, 3vw, 0.875rem) !important;
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={containerStyle}>
        {/* Header */}

        {/* Main Content */}
        <div style={mainContentStyle}>
          {/* Chat Section */}
          <div style={chatSectionStyle}>
            <div style={chatHeaderStyle}>
              <h2 style={chatTitleStyle}>
                Indian Constitution (Ask me anything)
              </h2>
              <span style={messageCountStyle}>
                {messages.length} message{messages.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div style={chatBoxStyle} ref={chatBoxRef}>
              {messages.map((message, index) => (
                <div key={index} style={messageStyle(message.isUser)}>
                  <div style={messageContentStyle(message.isUser)}>
                    {message.text}
                    {!message.isUser && (
                      <button
                        style={listenButtonStyle(speakingMessageId === index)}
                        onClick={() => speakText(message.text, index)}
                        onMouseEnter={(e) => {
                          e.target.style.opacity = "1";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.opacity = "0.8";
                        }}
                      >
                        {speakingMessageId === index ? "⏹" : "🔊"}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div style={thinkingStyle}>
                  <div style={{ display: "flex", marginRight: "12px" }}>
                    <div style={dotStyle("0s")}></div>
                    <div style={dotStyle("0.2s")}></div>
                    <div style={dotStyle("0.4s")}></div>
                  </div>
                  Analyzing query...
                </div>
              )}

              {isTyping && !isThinking && (
                <div style={typingIndicatorStyle}>
                  <div style={messageContentStyle(false)}>
                    <div style={{ display: "flex" }}>
                      <div style={dotStyle("0s")}></div>
                      <div style={dotStyle("0.15s")}></div>
                      <div style={dotStyle("0.3s")}></div>
                    </div>
                  </div>
                </div>
              )}

              {error && <div style={errorStyle}>{error}</div>}
            </div>
          </div>

          {/* Input Section */}
          <div style={inputSectionStyle}>
            <div style={inputHeaderStyle}>
              <label style={toggleLabelStyle} onClick={toggleSpeechInput}>
                <input
                  type="checkbox"
                  checked={useSpeechInput}
                  onChange={toggleSpeechInput}
                  style={checkboxStyle}
                />
                🎤 Voice Input
              </label>
            </div>

            <div style={inputBodyStyle}>
              {useSpeechInput ? (
                <div style={speechControlsStyle}>
                  <div style={micStatusStyle}>
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: listening ? "#10b981" : "#6b7280",
                        boxShadow: listening ? "0 0 6px #10b981" : "none",
                      }}
                    ></div>
                    {listening ? "Recording..." : "Ready"}
                  </div>

                  <div style={buttonGroupStyle}>
                    <button
                      style={speechButtonStyle("start", listening)}
                      onClick={() => simulateSpeechRecognition("start")}
                      disabled={listening}
                    >
                      Start
                    </button>
                    <button
                      style={speechButtonStyle("stop", !listening)}
                      onClick={() => simulateSpeechRecognition("stop")}
                      disabled={!listening}
                    >
                      Stop
                    </button>
                    <button
                      style={speechButtonStyle("reset")}
                      onClick={() => simulateSpeechRecognition("reset")}
                    >
                      Reset
                    </button>
                  </div>

                  <textarea
                    style={transcriptAreaStyle}
                    value={transcript || "Your speech will appear here..."}
                    readOnly
                  />

                  <button
                    style={sendButtonStyle(!transcript.trim())}
                    onClick={sendMessage}
                    disabled={!transcript.trim()}
                    onMouseEnter={(e) => {
                      if (!e.target.disabled) {
                        e.target.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.target.disabled) {
                        e.target.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    Send Message
                  </button>
                </div>
              ) : (
                <div style={textInputAreaStyle}>
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#8b5cf6";
                      e.target.style.boxShadow =
                        "0 0 0 2px rgba(139, 92, 246, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(139, 92, 246, 0.2)";
                      e.target.style.boxShadow = "none";
                    }}
                    placeholder="Ask about the Indian Constitution..."
                    disabled={isTyping || isThinking}
                    style={textInputStyle}
                  />
                  <button
                    style={sendButtonStyle(
                      isTyping || isThinking || !inputMessage.trim()
                    )}
                    onClick={sendMessage}
                    disabled={isTyping || isThinking || !inputMessage.trim()}
                    onMouseEnter={(e) => {
                      if (!e.target.disabled) {
                        e.target.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.target.disabled) {
                        e.target.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    {isThinking ? "Processing..." : "Send Message"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NLP;
