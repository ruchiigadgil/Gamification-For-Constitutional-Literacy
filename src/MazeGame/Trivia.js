import React, { useState } from "react";

const Trivia = ({ question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    const isCorrect = index === question.correct;
    onAnswer(isCorrect);
    setShowExplanation(true);
  };

  return (
    <div
      className="trivia"
      style={{
        marginTop: "20px",
        padding: "10px",
        background: "#f9f9f9",
        border: "1px solid #ddd",
        borderRadius: "5px",
        width: "300px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h2
        style={{
          fontSize: "1.5em",
          marginBottom: "10px",
          color: "#333",
        }}
      >
        {question.text}
      </h2>
      <div>
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            className={`option ${selectedAnswer === idx ? "selected" : ""}`}
            style={{
              display: "block",
              margin: "10px auto",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              background: selectedAnswer === idx ? "#d0d0d0" : "#f0f0f0",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "100%",
              opacity: selectedAnswer !== null ? 0.6 : 1,
            }}
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))}
      </div>

      {showExplanation && (
        <div
          className="explanation"
          style={{
            marginTop: "10px",
            padding: "10px",
            background: "#e8e8e8",
            borderRadius: "4px",
          }}
        >
          <h3
            style={{
              fontSize: "1.2em",
              marginBottom: "5px",
              color: "#444",
            }}
          >
            Explanation:
          </h3>
          <p
            style={{
              fontSize: "1em",
              color: "#666",
            }}
          >
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default Trivia;