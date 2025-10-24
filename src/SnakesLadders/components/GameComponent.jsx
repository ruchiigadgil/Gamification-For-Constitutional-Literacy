import React, { useState } from "react";
import PlayerToken from "./PlayerToken";
import { ladders, snakes } from "../utils/jumps"; // Make sure path is correct
import { useNavigate } from "react-router-dom"; // Import useNavigate

const GameComponent = ({ boardImage }) => {
  const navigate = useNavigate(); // Initialize navigate hook
  const questionsData = [
    {
      q: "What is the supreme law of India?",
      options: [
        "The Constitution of India",
        "The Indian Penal Code",
        "The Civil Procedure Code",
        "The Government of India Act",
      ],
      answer: "The Constitution of India",
    },
    {
      q: "Who is known as the Father of the Indian Constitution?",
      options: [
        "Mahatma Gandhi",
        "B. R. Ambedkar",
        "Jawaharlal Nehru",
        "Sardar Patel",
      ],
      answer: "B. R. Ambedkar",
    },
    {
      q: "How many fundamental rights are there in the Indian Constitution?",
      options: ["6", "7", "8", "9"],
      answer: "6",
    },
    {
      q: "Which part of the Constitution deals with Fundamental Rights?",
      options: ["Part III", "Part II", "Part IV", "Part V"],
      answer: "Part III",
    },
    {
      q: "What is the minimum age to contest in Lok Sabha elections?",
      options: ["18 years", "21 years", "25 years", "30 years"],
      answer: "25 years",
    },
    {
      q: "Which Article of the Constitution guarantees the Right to Equality?",
      options: ["Article 14", "Article 15", "Article 16", "Article 17"],
      answer: "Article 14",
    },
    {
      q: "How many Schedules are there in the Indian Constitution?",
      options: ["10", "11", "12", "13"],
      answer: "12",
    },
    {
      q: "Which amendment is known as the Mini Constitution?",
      options: [
        "42nd Amendment",
        "44th Amendment",
        "73rd Amendment",
        "86th Amendment",
      ],
      answer: "42nd Amendment",
    },
    {
      q: "Which body is empowered to amend the Constitution?",
      options: ["Lok Sabha", "Rajya Sabha", "Parliament", "President"],
      answer: "Parliament",
    },
    {
      q: "What is the length of the term of the President of India?",
      options: ["4 years", "5 years", "6 years", "7 years"],
      answer: "5 years",
    },
  ];

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

  const getRandomQuestion = () => {
    return questionsData[Math.floor(Math.random() * questionsData.length)];
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

  const movePlayer = (roll, playerIndex) => {
    const currentPlayer = players[playerIndex];
    let newPosition = Math.min(currentPlayer.position + roll, 100);

    if (playerIndex === 0) {
      if (ladders[newPosition]) {
        const q = getRandomQuestion();
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
        const q = getRandomQuestion();
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

  const rollDice = () => {
    if (gameOver || turn !== 0) return;

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
          : "Wrong! Stayed at position " + pendingMove.newPosition
      );
    } else if (pendingMove.type === "snake") {
      finalPosition = correct ? pendingMove.newPosition : pendingMove.jump;
      setMessage(
        correct
          ? "Correct! 🛡️ Avoided the snake!"
          : "Wrong! 🐍 Slid down to position " + pendingMove.jump
      );
    }

    setShowQuestion(false);
    setTimeout(() => {
      updatePosition(finalPosition, pendingMove.playerIndex);
    }, 1000);
  };

  const resetGame = () => {
    setPlayers(initialPlayers);
    setTurn(0);
    setDice(null);
    setMessage("");
    setShowQuestion(false);
    setPendingMove(null);
    setGameOver(false);
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
            {message && <h3 className="game-message">{message}</h3>}
            <div className="dice-display">Dice: {dice || " "}</div>
            <div className="btn-group">
              {!gameOver && (
                <button
                  onClick={rollDice}
                  className={`roll-btn ${turn !== 0 ? "fade" : ""}`}
                  disabled={turn !== 0}
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

          {showQuestion && pendingMove && (
            <div className="question-modal">
              <div className="question-box">
                <h3>{pendingMove.q.q}</h3>
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

/* Embedded CSS - Start */
const styles = `
  /* Define custom properties (variables) */
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

  /* Main App Container */
  .game-container .app {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0.5rem;
      max-width: 100%;
      margin: 0 auto;
      font-family: 'Poppins', sans-serif;
      color: var(--dark); /* Ensure readable text color */
      min-height: 100vh;
      width: 100%;
      position: relative;
  }

  /* Back Button Container */
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

  /* Board Container */
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

  /* Game Info - Fixed Size with Grid Layout */
  .game-container .game-info {
      background: var(--glass-bg);
      backdrop-filter: blur(5px);
      padding: 0.5rem;
      border-radius: 10px;
      margin-top: 0.5rem;
      width: 600px; /* Fixed width */
      height: 170px; /* Fixed height */
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: grid;
      grid-template-areas:
        "message"
        "dice"
        "buttons";
      grid-template-rows: 1fr 1fr 1fr; /* Equal rows for message, dice, and buttons */
      overflow: hidden; /* Prevent content from expanding beyond fixed size */
  }

  /* Game Message */
  .game-container .game-message {
      grid-area: message;
      font-size: 2.0rem;
      margin: 0.1rem 0;
      padding: 0.1rem;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.1);
      color: var(--dark); /* Dark text for readability */
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  }

  /* Dice Display */
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
      color: var(--dark); /* Dark text for readability */
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

  /* Buttons */
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
      transition: all 0.3s ease; /* Smooth transition for opacity */
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  }

  .game-container .roll-btn {
      background: linear-gradient(to right, var(--primary), var(--accent));
      color: white;
  }

  .game-container .roll-btn.fade {
      opacity: 0.5; /* Fade effect when computer is playing */
      cursor: not-allowed; /* Indicate it's not clickable */
  }

  .game-container .roll-btn:hover {
      background: linear-gradient(to right, var(--secondary), var(--accent));
      transform: scale(1.05);
  }

  .game-container .roll-btn.fade:hover {
      transform: none; /* No scale on hover when faded */
  }

  .game-container .reset-btn {
      background: var(--danger);
      color: white;
  }

  .game-container .reset-btn:hover {
      background: #c71c67;
      transform: scale(1.05);
  }

  /* Question Modal */
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

  /* Responsive Design */
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
  }
`;
/* Embedded CSS - End */

/* Apply the styles to the component */
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default GameComponent;
