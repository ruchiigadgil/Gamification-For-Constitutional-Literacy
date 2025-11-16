import React from "react";

const FactCard = ({ fact, word, won, attempts, onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <div style={styles.icon}>{won ? "🎉" : "📚"}</div>
        <h2 style={styles.title}>{won ? "Congratulations!" : "Game Over!"}</h2>
        
        {won ? (
          <p style={styles.success}>You guessed it in {attempts} {attempts === 1 ? 'try' : 'tries'}!</p>
        ) : (
          <p style={styles.reveal}>The word was: <strong>{word}</strong></p>
        )}
        
        <div style={styles.factBox}>
          <h3 style={styles.factTitle}>💡 Did You Know?</h3>
          <p style={styles.factText}>{fact}</p>
        </div>
        
        <button style={styles.button} onClick={onClose}>
          Play Again
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    animation: "fadeIn 0.3s ease",
  },
  card: {
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
    padding: "40px 30px",
    width: "90%",
    maxWidth: "450px",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    textAlign: "center",
    animation: "slideUp 0.4s ease",
  },
  icon: {
    fontSize: "4rem",
    marginBottom: "15px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#333",
  },
  success: {
    fontSize: "1.2rem",
    color: "#6aaa64",
    fontWeight: "600",
    marginBottom: "20px",
  },
  reveal: {
    fontSize: "1.2rem",
    color: "#c9b458",
    marginBottom: "20px",
  },
  factBox: {
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "25px",
    border: "2px solid rgba(102, 126, 234, 0.2)",
  },
  factTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#667eea",
    marginBottom: "10px",
  },
  factText: {
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "#555",
  },
  button: {
    padding: "12px 30px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  },
};

export default FactCard;
