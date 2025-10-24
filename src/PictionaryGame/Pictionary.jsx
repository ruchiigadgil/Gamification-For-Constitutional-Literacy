import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import historical_figures from "./Data";

function Pictionary() {
  const [load, setLoad] = useState(true);
  const [data, setData] = useState([]);
  const [ques, setQues] = useState(0);
  const [letter, setLetter] = useState("");
  const [score, setScore] = useState(0);
  const [hiddenWord, setHiddenWord] = useState("");
  const [hintUsed, setHintUsed] = useState(false);
  const [hintText, setHintText] = useState("");
  const [sk, setsk] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [done, setDone] = useState(false);
  const [usedLetters, setUsedLetters] = useState([]);

  useEffect(() => {
    setData(historical_figures);
    setLoad(false);
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setHiddenWord(data[ques]["name"].replace(/[^ ]/g, "_"));
      setUsedLetters([]);
    }
  }, [data, ques]);

  const next = () => {
    if (ques >= data.length - 1) {
      setDone(true);
    } else {
      setsk(false);
      setLetter("");
      setHintUsed(false);
      setIsCorrect(false);
      setQues((prev) => prev + 1);
      setHiddenWord(data[ques + 1]["name"].replace(/[^ ]/g, "_"));
    }
  };

  const skip = () => {
    setScore((prev) => prev - 1);
    next();
  };

  const hint = () => {
    if (!hintUsed) {
      // Display textual hint from Data.js instead of revealing letters
      const h = data[ques] && data[ques].hint ? data[ques].hint : "No hint available.";
      setHintText(h);
      setHintUsed(true);
    }
  };

  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const word = (item) => {
    if (usedLetters.includes(item)) return;
    
    setUsedLetters([...usedLetters, item]);
    
    if (data[ques]["name"].toUpperCase().includes(item)) {
      let updatedHidden = hiddenWord.split("");
      data[ques]["name"].split("").forEach((char, index) => {
        if (char.toUpperCase() === item) {
          updatedHidden[index] = char;
        }
      });
      setHiddenWord(updatedHidden.join(""));
      if (!updatedHidden.includes("_")) {
        setsk(true);
        setHintUsed(true);
        setIsCorrect(true);
        setScore((prev) => prev + 5);
      }
    } else {
      setScore((prev) => prev - 1);
    }
  };

  if (load || data.length === 0) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (done) {
    return (
      <div style={styles.gameOverContainer}>
        <div style={styles.gameOverCard}>
          <div style={styles.gameOverIcon}>🏆</div>
          <h1 style={styles.gameOverTitle}>Game Complete!</h1>
          <div style={styles.finalScoreContainer}>
            <p style={styles.finalScoreLabel}>Final Score</p>
            <p style={styles.finalScore}>{score}</p>
          </div>
          <p style={styles.gameOverMessage}>
            {score >= 50
              ? "Outstanding! You're a history expert! 🌟"
              : score >= 30
              ? "Great job! Keep learning! 🎯"
              : "Good effort! Try again to improve! 💪"}
          </p>
          <button
            style={styles.playAgainButton}
            onClick={() => window.location.reload()}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
       
        <div style={styles.statsBar}>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>📊</span>
            <div>
              <p style={styles.statLabel}>Score</p>
              <p style={styles.statValue}>{score}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>📝</span>
            <div>
              <p style={styles.statLabel}>Question</p>
              <p style={styles.statValue}>
                {ques + 1} / {data.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.gameCard}>
        <div style={styles.imageContainer}>
          <img
            style={styles.image}
            src={data[ques]["image_url"]}
            alt="Historical Figure"
          />
          <div style={styles.imageOverlay}></div>
        </div>

        <div style={styles.wordContainer}>
          <p style={styles.wordLabel}>Guess the name:</p>
          <div style={styles.word}>
            {hiddenWord.split("").map((char, index) => (
              <span
                key={index}
                style={char === " " ? styles.space : styles.letterBox}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

          {isCorrect && (
          <div style={styles.correctBanner}>
            <span style={styles.correctIcon}>✨</span>
            <span style={styles.correctText}>Perfect! Click Next to continue</span>
            <span style={styles.correctIcon}>✨</span>
          </div>
        )}

          {hintUsed && hintText && (
            <div style={styles.hintBox}>
              <span style={styles.hintIcon}>💡</span>
              <span style={styles.hintText}>{hintText}</span>
            </div>
          )}

        <div style={styles.alphabetGrid}>
          {alphabets.map((item, index) => (
            <button
              key={index}
              style={{
                ...styles.letterButton,
                ...(usedLetters.includes(item) ? styles.letterButtonUsed : {}),
              }}
              onClick={() => word(item)}
              disabled={usedLetters.includes(item) || isCorrect}
            >
              {item}
            </button>
          ))}
        </div>

        <div style={styles.actionButtons}>
          <button
            style={{
              ...styles.actionButton,
              ...styles.hintButton,
              ...(hintUsed ? styles.buttonDisabled : {}),
            }}
            onClick={hint}
            disabled={hintUsed}
          >
            <span style={styles.buttonIcon}>💡</span>
            <span>Hint</span>
          </button>

          <button
            style={{
              ...styles.actionButton,
              ...styles.skipButton,
              ...(sk ? styles.buttonDisabled : {}),
            }}
            onClick={skip}
            disabled={sk}
          >
            <span style={styles.buttonIcon}>⏭️</span>
            <span>Skip (-1)</span>
          </button>

          <button
            style={{
              ...styles.actionButton,
              ...styles.nextButton,
              ...(!isCorrect ? styles.buttonDisabled : {}),
            }}
            onClick={next}
            disabled={!isCorrect}
          >
            <span>Next</span>
            <span style={styles.buttonIcon}>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "12px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  header: {
    maxWidth: "880px",
    margin: "0 auto 12px",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  titleIcon: {
    fontSize: "1.6rem",
  },
  statsBar: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  statCard: {
    background: "rgba(255, 255, 255, 0.95)",
    padding: "8px 12px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 6px 12px rgba(0,0,0,0.06)",
    backdropFilter: "blur(6px)",
  },
  statIcon: {
    fontSize: "1.1rem",
  },
  statLabel: {
    fontSize: "0.7rem",
    color: "#64748b",
    fontWeight: "500",
    margin: "0",
  },
  statValue: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0",
  },
  gameCard: {
    maxWidth: "760px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "260px",
    height: "180px",
    margin: "0 auto 12px",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)",
  },
  wordContainer: {
    textAlign: "center",
    marginBottom: "12px",
  },
  wordLabel: {
    fontSize: "0.85rem",
    color: "#64748b",
    fontWeight: "600",
    marginBottom: "8px",
  },
  word: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "6px",
    minHeight: "40px",
  },
  letterBox: {
    display: "inline-block",
    width: "30px",
    height: "36px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#ffffff",
    fontSize: "1rem",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: "36px",
    borderRadius: "8px",
    boxShadow: "0 3px 8px rgba(102, 126, 234, 0.25)",
    textTransform: "uppercase",
  },
  space: {
    width: "10px",
  },
  correctBanner: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#ffffff",
    padding: "8px 12px",
    borderRadius: "10px",
    textAlign: "center",
    marginBottom: "12px",
    fontSize: "0.9rem",
    fontWeight: "600",
    boxShadow: "0 6px 12px rgba(16, 185, 129, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  correctIcon: {
    fontSize: "1rem",
  },
  correctText: {
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  hintBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "center",
    background: "rgba(249, 250, 251, 0.9)",
    padding: "8px 12px",
    borderRadius: "8px",
    margin: "8px auto 12px",
    maxWidth: "640px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
  },
  hintIcon: {
    fontSize: "1rem",
  },
  hintText: {
    fontSize: "0.9rem",
    color: "#334155",
    fontWeight: "500",
  },
  alphabetGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(32px, 1fr))",
    gap: "6px",
    marginBottom: "12px",
    maxWidth: "480px",
    margin: "0 auto 12px",
  },
  letterButton: {
    padding: "8px",
    fontSize: "0.9rem",
    fontWeight: "700",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
    color: "#334155",
    cursor: "pointer",
    transition: "all 0.15s ease",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    minWidth: "36px",
    minHeight: "36px",
  },
  letterButtonUsed: {
    background: "#cbd5e1",
    color: "#94a3b8",
    cursor: "not-allowed",
    border: "2px solid #cbd5e1",
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  actionButton: {
    padding: "8px 12px",
    fontSize: "0.9rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.18s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
    minWidth: "100px",
    justifyContent: "center",
  },
  buttonIcon: {
    fontSize: "1rem",
  },
  hintButton: {
    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    color: "#ffffff",
  },
  skipButton: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#ffffff",
  },
  nextButton: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#ffffff",
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  gameOverContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px",
  },
  gameOverCard: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "28px 20px",
    textAlign: "center",
    maxWidth: "420px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
  },
  gameOverIcon: {
    fontSize: "3rem",
    marginBottom: "12px",
  },
  gameOverTitle: {
    fontSize: "1.2rem",
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "12px",
  },
  finalScoreContainer: {
    background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "12px",
  },
  finalScoreLabel: {
    fontSize: "0.85rem",
    color: "#64748b",
    marginBottom: "8px",
    fontWeight: "500",
  },
  finalScore: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#1e293b",
    margin: "0",
  },
  gameOverMessage: {
    fontSize: "0.9rem",
    color: "#64748b",
    marginBottom: "12px",
    lineHeight: "1.4",
  },
  playAgainButton: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#ffffff",
    padding: "8px 18px",
    fontSize: "0.95rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 3px 8px rgba(102, 126, 234, 0.28)",
    transition: "all 0.2s ease",
  },
};

export default Pictionary;
