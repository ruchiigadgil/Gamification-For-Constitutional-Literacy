import React, { useEffect, useState } from "react";
import FactCard from "./FactCard";
import data from "./data.json";
import { markDailyWordCompleted } from "../services/api";

const Game = () => {
  const [todayWord, setTodayWord] = useState("");
  const [hint, setHint] = useState("");
  const [fact, setFact] = useState("");
  const [guesses, setGuesses] = useState(Array(4).fill(""));
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [letterStatus, setLetterStatus] = useState({});

  const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
  ];

  useEffect(() => {
    const today = new Date();
    const key = Number(
      `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`
    );
    const index = key % data.length;

    const todayData = data[index];

    setTodayWord(todayData.word.toUpperCase());
    setHint(todayData.hint);
    setFact(todayData.fact);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;

      if (e.key === 'Enter') {
        handleEnter();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleLetter(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameOver, currentRow]);

  const handleLetter = (letter) => {
    if (currentGuess.length < 5) {
      setCurrentGuess(currentGuess + letter);
    }
  };

  const handleBackspace = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  const markCompleted = async () => {
    try {
      await markDailyWordCompleted();
      console.log('✅ Daily word marked as completed');
    } catch (error) {
      console.error('Error marking daily as completed:', error);
    }
  };

  const handleEnter = () => {
    if (currentGuess.length !== 5) return;
    if (currentRow >= 4) return;

    const newGuesses = [...guesses];
    newGuesses[currentRow] = currentGuess;
    setGuesses(newGuesses);

    // Update letter status for keyboard
    const newLetterStatus = { ...letterStatus };
    const wordArray = todayWord.split('');
    const guessArray = currentGuess.split('');

    // First pass: mark correct positions
    guessArray.forEach((letter, i) => {
      if (letter === wordArray[i]) {
        newLetterStatus[letter] = 'correct';
      }
    });

    // Second pass: mark present and absent
    guessArray.forEach((letter, i) => {
      if (letter === wordArray[i]) {
        return; // Already marked as correct
      } else if (wordArray.includes(letter)) {
        if (newLetterStatus[letter] !== 'correct') {
          newLetterStatus[letter] = 'present';
        }
      } else {
        if (!newLetterStatus[letter]) {
          newLetterStatus[letter] = 'absent';
        }
      }
    });

    setLetterStatus(newLetterStatus);

    if (currentGuess === todayWord) {
      setWon(true);
      setGameOver(true);
      markCompleted();
      setTimeout(() => setShowFact(true), 500);
    } else if (currentRow === 3) {
      setGameOver(true);
      markCompleted();
      setTimeout(() => setShowFact(true), 500);
    } else {
      setCurrentRow(currentRow + 1);
      setCurrentGuess("");
    }
  };

  const getTileStatus = (rowIndex, colIndex) => {
    const guess = guesses[rowIndex];
    if (!guess || rowIndex > currentRow) return "empty";
    if (rowIndex === currentRow && !gameOver) return "empty";

    const letter = guess[colIndex];
    const targetLetter = todayWord[colIndex];

    if (letter === targetLetter) {
      return "correct";
    } else if (todayWord.includes(letter)) {
      return "present";
    } else {
      return "absent";
    }
  };

  const handleKeyClick = (key) => {
    if (gameOver) return;

    if (key === 'ENTER') {
      handleEnter();
    } else if (key === '⌫') {
      handleBackspace();
    } else {
      handleLetter(key);
    }
  };

  const resetGame = () => {
    setGuesses(Array(4).fill(""));
    setCurrentGuess("");
    setCurrentRow(0);
    setGameOver(false);
    setWon(false);
    setShowFact(false);
    setLetterStatus({});
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Daily Consti-Word</h1>
        <p style={styles.hint}>{hint}</p>
      </div>

      <div style={styles.board}>
        {Array(4).fill(null).map((_, rowIndex) => (
          <div key={rowIndex} style={styles.row}>
            {Array(5).fill(null).map((_, colIndex) => {
              const guess = guesses[rowIndex];
              const currentLetter = rowIndex === currentRow ? currentGuess[colIndex] : guess?.[colIndex];
              const status = getTileStatus(rowIndex, colIndex);
              
              return (
                <div
                  key={colIndex}
                  style={{
                    ...styles.tile,
                    ...styles[status],
                    ...(currentLetter && rowIndex === currentRow && !gameOver ? styles.filled : {})
                  }}
                >
                  {currentLetter || ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={styles.keyboard}>
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} style={styles.keyboardRow}>
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                style={{
                  ...styles.key,
                  ...(key === 'ENTER' || key === '⌫' ? styles.wideKey : {}),
                  ...(letterStatus[key] ? styles[letterStatus[key] + 'Key'] : {})
                }}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>

      {showFact && (
        <FactCard
          fact={fact}
          word={todayWord}
          won={won}
          attempts={currentRow + 1}
          onClose={resetGame}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    color: 'white',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '20px 0 10px 0',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  hint: {
    fontSize: '1.1rem',
    opacity: 0.95,
    maxWidth: '500px',
    margin: '0 auto',
  },
  board: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    marginBottom: '30px',
  },
  row: {
    display: 'flex',
    gap: '5px',
  },
  tile: {
    width: '62px',
    height: '62px',
    border: '2px solid rgba(255,255,255,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
  },
  filled: {
    border: '2px solid rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: 'scale(1.05)',
  },
  empty: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  correct: {
    backgroundColor: '#6aaa64',
    border: '2px solid #6aaa64',
    animation: 'flip 0.5s ease',
  },
  present: {
    backgroundColor: '#c9b458',
    border: '2px solid #c9b458',
    animation: 'flip 0.5s ease',
  },
  absent: {
    backgroundColor: '#787c7e',
    border: '2px solid #787c7e',
    animation: 'flip 0.5s ease',
  },
  keyboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    maxWidth: '500px',
  },
  keyboardRow: {
    display: 'flex',
    gap: '6px',
    justifyContent: 'center',
  },
  key: {
    padding: '14px 8px',
    minWidth: '40px',
    fontSize: '0.9rem',
    fontWeight: '600',
    backgroundColor: 'rgba(211, 214, 218, 0.9)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#000',
    transition: 'all 0.15s ease',
    textTransform: 'uppercase',
  },
  wideKey: {
    minWidth: '65px',
    fontSize: '0.75rem',
  },
  correctKey: {
    backgroundColor: '#6aaa64',
    color: 'white',
  },
  presentKey: {
    backgroundColor: '#c9b458',
    color: 'white',
  },
  absentKey: {
    backgroundColor: '#787c7e',
    color: 'white',
  },
};

export default Game;
