import React, { useState } from "react";
import PlayerToken from "./PlayerToken";
import { ladders, snakes } from "../utils/jumps";
import { useNavigate } from "react-router-dom";

const GameComponent = ({ boardImage }) => {
  const navigate = useNavigate();
  const initialPlayers = [
    { name: "You", position: 1 },
    { name: "Computer", position: 1 },
  ];

  const [players, setPlayers] = useState(initialPlayers);
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState(null);
  const [message, setMessage] = useState("");
  const [showQuestion, setShowQuestion] = useState(false);
  const [pendingMove, setPendingMove] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [error, setError] = useState(null);

  const getRandomQuestion = async () => {
    try {
      setLoadingQuestion(true);
      setError(null);
      const response = await fetch("http://localhost:5000/generate-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: "Generate a question now" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      return {
        q: data.question,
        options: data.options,
        answer: data.answer,
        hint: data.hint,
      };
    } catch (err) {
      setError("Failed to fetch question. Using fallback question.");
      return {
        q: "What is the supreme law of India?",
        options: [
          "The Constitution of India",
          "The Indian Penal Code",
          "The Civil Procedure Code",
          "The Government of India Act",
        ],
        answer: "The Constitution of India",
        hint: "It is the foundational legal document of the country.",
      };
    } finally {
      setLoadingQuestion(false);
    }
  };

  const updatePosition = (pos, playerIndex) => {
    setPlayers((prev) =>
      prev.map((p, i) => (i === playerIndex ? { ...p, position: pos } : p))
    );

    if (pos === 100) {
      setMessage(`${players[playerIndex].name} wins! 🎉`);
      setGameOver(true);
      return;
    }

    const nextTurn = 1 - playerIndex;
    setTurn(nextTurn);
    setDice(null);

    if (nextTurn === 1 && !gameOver) {
      setTimeout(() => {
        const compRoll = Math.floor(Math.random() * 6) + 1;
        setDice(compRoll);
        setMessage(`Computer rolled a ${compRoll}`);

        setTimeout(() => movePlayer(compRoll, 1), 1000);
      }, 1500);
    }
  };

  const movePlayer = async (roll, playerIndex) => {
    const currentPlayer = players[playerIndex];
    let newPosition = Math.min(currentPlayer.position + roll, 100);

    if (playerIndex === 0) {
      if (ladders[newPosition]) {
        const q = await getRandomQuestion();
        setPendingMove({
          newPosition,
          jump: ladders[newPosition],
          type: "ladder",
          q,
          playerIndex,
        });
        setMessage("You found a ladder! Answer to climb!");
        setShowQuestion(true);
        return;
      } else if (snakes[newPosition]) {
        const q = await getRandomQuestion();
        setPendingMove({
          newPosition,
          jump: snakes[newPosition],
          type: "snake",
          q,
          playerIndex,
        });
        setMessage("Snake! Answer correctly to avoid!");
        setShowQuestion(true);
        return;
      }
    } else if (playerIndex === 1) {
      if (ladders[newPosition]) {
        newPosition = ladders[newPosition];
        setMessage(`Computer climbed a ladder to ${newPosition}!`);
      } else if (snakes[newPosition]) {
        newPosition = snakes[newPosition];
        setMessage(`Computer slid down a snake to ${newPosition}!`);
      }
    }

    updatePosition(newPosition, playerIndex);
  };

  const rollDice = async () => {
    if (gameOver || turn !== 0 || loadingQuestion) return;

    const roll = Math.floor(Math.random() * 6) + 1;
    setDice(roll);
    setMessage(`You rolled a ${roll}`);

    setTimeout(() => movePlayer(roll, 0), 700);
  };

  const handleAnswer = (option) => {
    if (!pendingMove) return;

    const correct = option === pendingMove.q.answer;
    let finalPosition;

    if (pendingMove.type === "ladder") {
      finalPosition = correct ? pendingMove.jump : pendingMove.newPosition;
      setMessage(
        correct
          ? "Correct! 🪜 Climbed to position " + pendingMove.jump
          : "Wrong Answer!"
      );
      setShowQuestion(false);
      setTimeout(() => {
        if (!correct) {
          setMessage("Wrong! Stayed at position " + pendingMove.newPosition);
        }
        setTimeout(
          () => {
            updatePosition(finalPosition, pendingMove.playerIndex);
          },
          correct ? 0 : 1000
        );
      }, 1000);
    } else if (pendingMove.type === "snake") {
      finalPosition = correct ? pendingMove.newPosition : pendingMove.jump;
      setMessage(correct ? "Correct! 🛡️ Avoided the snake!" : "Wrong Answer!");
      setShowQuestion(false);
      setTimeout(() => {
        if (!correct) {
          setMessage("Wrong! 🐍 Slid down to position " + pendingMove.jump);
        }
        setTimeout(
          () => {
            updatePosition(finalPosition, pendingMove.playerIndex);
          },
          correct ? 0 : 1000
        );
      }, 1000);
    }
  };

  const resetGame = () => {
    setPlayers(initialPlayers);
    setTurn(0);
    setDice(null);
    setMessage("");
    setShowQuestion(false);
    setPendingMove(null);
    setGameOver(false);
    setError(null);
    setLoadingQuestion(false);
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="snakes-ladders-game">
      <div className="game-container">
        <div className="app">
          <div className="back-button-container">
            <button onClick={goToDashboard} className="back-btn">
              ⬅ Back to Dashboard
            </button>
          </div>
          <div className="board-container">
            <img src={boardImage} alt="Board" className="board-img" />
            {players.map((p, i) => (
              <PlayerToken
                key={i}
                className="player-token"
                player={p}
                index={i}
              />
            ))}
          </div>

          <div className="game-info">
            {error && <div className="error-message">{error}</div>}
            {message && (
              <h3
                className={`game-message ${
                  message.startsWith("Wrong") ? "wrong" : ""
                }`}
              >
                {message}
              </h3>
            )}
            <div className="dice-display">Dice: {dice || " "}</div>
            <div className="btn-group">
              {!gameOver && (
                <button
                  onClick={rollDice}
                  className={`roll-btn ${
                    turn !== 0 || loadingQuestion ? "fade" : ""
                  }`}
                  disabled={turn !== 0 || loadingQuestion}
                >
                  🎲 Roll Dice
                </button>
              )}
              {gameOver && (
                <button onClick={resetGame} className="reset-btn">
                  🔄 Play Again
                </button>
              )}
            </div>
          </div>

          {loadingQuestion && (
            <div className="loading-modal">
              <div className="loading-box">
                <div className="loading-spinner"></div>
                <span>Loading question...</span>
              </div>
            </div>
          )}

          {showQuestion && pendingMove && (
            <div className="question-modal">
              <div className="question-box">
                <h3>{pendingMove.q.q}</h3>
                <p className="question-hint">{pendingMove.q.hint}</p>
                {pendingMove.q.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className="question-option"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = `
  :root {
      --primary: #4361ee;
      --secondary: #3f37c9;
      --accent: #4cc9f0;
      --danger: #f72585;
      --success: #4ad66d;
      --warning: #f8961e;
      --light: #f8f9fa;
      --dark: #212529;
      --glass-bg: rgba(255, 255, 255, 0.1);
  }

  .game-container .app {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0.5rem;
      max-width: 100%;
      margin: 0 auto;
      font-family: 'Poppins', sans-serif;
      color: var(--dark);
      min-height: 100vh;
      width: 100%;
      position: relative;
  }

  .game-container .back-button-container {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      z-index: 10;
  }

  .game-container .back-btn {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: 0.3s ease;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      background: var(--secondary);
      color: white;
  }

  .game-container .back-btn:hover {
      background: #2e2aa7;
      transform: scale(1.05);
  }

  .game-container .board-container {
      position: relative;
      width: 100%;
      height: 100%;
      max-width: 600px;
      max-height: 600px;
      margin: 0.5rem auto;
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
      border-radius: 12px;
      overflow: hidden;
      background: black;
  }

  .game-container .board-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
  }

  .game-container .game-info {
      background: var(--glass-bg);
      backdrop-filter: blur(5px);
      padding: 0.5rem;
      border-radius: 10px;
      margin-top: 0.5rem;
      width: 600px;
      height: 170px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: grid;
      grid-template-areas:
        "message"
        "dice"
        "buttons";
      grid-template-rows: 1fr 1fr 1fr;
      overflow: hidden;
  }

  .game-container .error-message {
      grid-area: message;
      font-size: 1rem;
      color: var(--danger);
      text-align: center;
      padding: 0.2rem;
      animation: fadeIn 0.5s ease-in;
  }

  .game-container .loading-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      backdrop-filter: blur(3px);
  }

  .game-container .loading-box {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      width: 90%;
      max-width: 300px;
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
  }

  .game-container .loading-spinner {
      width: 30px;
      height: 30px;
      border: 4px solid var(--primary);
      border-top: 4px solid transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
  }

  .game-container .loading-box span {
      font-size: 1rem;
      color: var(--dark);
      font-weight: 500;
  }

  .game-container .game-message {
      grid-area: message;
      font-size: 2rem;
      margin: 0.1rem 0;
      padding: 0.1rem;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.1);
      color: var(--dark);
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      animation: fadeIn 0.5s ease-in;
  }

  .game-container .game-message.wrong {
      background: rgba(247, 37, 133, 0.2);
      color: var(--danger);
      animation: shake 0.5s ease-in-out;
  }

  .game-container .dice-display {
      grid-area: dice;
      margin: 0.2rem 0;
      text-align: center;
      font-size: 1.4rem;
  }

  .game-container .dice {
      display: inline-block;
      padding: 0.1rem 0.2rem;
      font-size: 2.0rem;
      font-weight: 700;
      color: var(--dark);
      background: linear-gradient(135deg, var(--primary), var(--accent));
      border-radius: 15px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
      width: 200px;
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  }

  .game-container .dice:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
  }

  .game-container .btn-group {
      grid-area: buttons;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      min-height: 40px;
  }

  .game-container button {
      padding: 0.6rem 1.2rem;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  }

  .game-container .roll-btn {
      background: linear-gradient(to right, var(--primary), var(--accent));
      color: white;
  }

  .game-container .roll-btn.fade {
      opacity: 0.5;
      cursor: not-allowed;
  }

  .game-container .roll-btn:hover {
      background: linear-gradient(to right, var(--secondary), var(--accent));
      transform: scale(1.05);
  }

  .game-container .roll-btn.fade:hover {
      transform: none;
  }

  .game-container .reset-btn {
      background: var(--danger);
      color: white;
  }

  .game-container .reset-btn:hover {
      background: #c71c67;
      transform: scale(1.05);
  }

  .game-container .question-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      backdrop-filter: blur(3px);
  }

  .game-container .question-box {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }

  .game-container .question-box h3 {
      color: var(--dark);
      margin-bottom: 1rem;
      line-height: 1.2;
  }

  .game-container .question-hint {
      color: var(--secondary);
      font-size: 0.9rem;
      margin-bottom: 1rem;
      font-style: italic;
  }

  .game-container .question-option {
      display: block;
      width: 100%;
      padding: 0.6rem;
      margin: 0.3rem 0;
      background: var(--light);
      border: 1px solid transparent;
      border-radius: 6px;
      transition: all 0.2s;
  }

  .game-container .question-option:hover {
      background: var(--accent);
      color: white;
      border-color: var(--primary);
  }

  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
  }

  @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-10px); }
      40%, 80% { transform: translateX(10px); }
  }

  @keyframes pulse {
      0% { opacity: 0.7; }
      50% { opacity: 1; }
      100% { opacity: 0.7; }
  }

  @media (max-width: 768px) {
      .game-container .board-container {
          width: 90vmin;
          height: 90vmin;
      }

      .game-container .game-info {
          padding: 0.5rem;
          width: 90%;
          height: 250px;
          max-width: 400px;
      }

      .game-container .btn-group {
          flex-direction: column;
          align-items: center;
      }

      .game-container .back-button-container {
          top: 0.3rem;
          left: 0.3rem;
      }

      .game-container .back-btn {
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
      }

      .game-container .dice {
          width: 180px;
          font-size: 1.2rem;
          padding: 0.2rem 0.5rem;
      }

      .game-container .game-message {
          font-size: 1rem;
      }

      .game-container .loading-box {
          max-width: 250px;
          padding: 1rem;
      }

      .game-container .loading-spinner {
          width: 24px;
          height: 24px;
      }

      .game-container .loading-box span {
          font-size: 0.9rem;
      }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default GameComponent;
