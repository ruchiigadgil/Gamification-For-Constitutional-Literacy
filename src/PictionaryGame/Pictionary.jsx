import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import historical_figures from "./Data"; // Import the JSON data

function Pictionary() {
  const [load, setLoad] = useState(true);
  const [data, setData] = useState([]);
  const [ques, setQues] = useState(0);
  const [letter, setLetter] = useState("");
  const [score, setScore] = useState(0);
  const [hiddenWord, setHiddenWord] = useState("");
  const [hintUsed, setHintUsed] = useState(false);
  const [sk, setsk] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Directly use the imported JSON data
    setData(historical_figures);
    setLoad(false);
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setHiddenWord(data[ques]["name"].replace(/[^ ]/g, "_"));
    }
  }, [data, ques]);

  const next = () => {
    if (ques >= data.length - 1) {
      setDone(true);
      alert(`Game Over! You ${score >= 0 ? "earned" : "lost"} ${score} coins`);
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
      let name = data[ques]["name"].split("");
      let revealedLetter = name.find(
        (char) => hiddenWord.includes("_") && char !== " "
      );
      if (revealedLetter) {
        let updatedHidden = hiddenWord.split("");
        name.forEach((char, index) => {
          if (char === revealedLetter) {
            updatedHidden[index] = char;
          }
        });
        setHiddenWord(updatedHidden.join(""));
        setHintUsed(true);
      }
    }
  };

  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const word = (item) => {
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

  if (load || data.length === 0)
    return (
      <div>
        <Loading />
      </div>
    ); // Fixed nesting issue

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Pictionary Game</h1>
      <p style={{ color: "white" }}>{done ? "Game Over" : ""}</p>
      <h2 style={styles.score}>Score: {score}</h2>
      <img
        style={styles.image}
        src={data[ques]["image_url"]}
        alt="Historical Figure"
      />
      <p style={styles.word}>{hiddenWord}</p>
      {isCorrect && <p style={styles.correct}>Correct! Click Next</p>}
      <div style={styles.buttonsContainer}>
        {alphabets.map((item, index) => (
          <button
            key={index}
            style={styles.letterButton}
            onClick={() => word(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <button style={styles.nextButton} onClick={next} disabled={!isCorrect}>
        Next
      </button>
      <button disabled={sk} style={styles.skipButton} onClick={skip}>
        Skip
      </button>
      <button style={styles.hintButton} onClick={hint} disabled={hintUsed}>
        Hint
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    borderRadius: "10px",
    fontFamily: "Comic Sans MS, cursive, sans-serif",
  },
  title: {
    color: "#e4c1f9",
    fontSize: "2em",
  },
  score: {
    color: "#ff99c8",
    fontSize: "1.5em",
  },
  image: {
    height: "200px",
    borderRadius: "10px",
    margin: "10px 0",
  },
  word: {
    fontSize: "1.5em",
    color: "#a9def9",
    fontWeight: "bold",
    margin: "10px 0",
  },
  correct: {
    fontSize: "1.5em",
    color: "#28a745",
    fontWeight: "bold",
  },
  buttonsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "5px",
    margin: "15px 0",
  },
  letterButton: {
    backgroundColor: "#d0f4de",
    border: "none",
    padding: "10px",
    margin: "5px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1em",
  },
  nextButton: {
    backgroundColor: "#e4c1f9",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1.2em",
    marginTop: "10px",
    marginRight: "10px",
  },
  skipButton: {
    backgroundColor: "#ff99c8",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1.2em",
    marginTop: "10px",
    marginRight: "10px",
  },
  hintButton: {
    backgroundColor: "#a9def9",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1.2em",
    marginTop: "10px",
  },
};

export default Pictionary;
