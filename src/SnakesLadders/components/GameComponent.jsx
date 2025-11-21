import React, { useState, useEffect, useRef } from "react";
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
  const [score, setScore] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [answerFeedback, setAnswerFeedback] = useState(null);

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
        explanation:
          data.explanation ||
          data.hint ||
          "Here's a quick fact related to this question.",
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
        explanation:
          "The Constitution of India lays down the framework defining fundamental political principles, procedures, and powers of government.",
      };
    } finally {
      setLoadingQuestion(false);
    }
  };

  // Keep previous score to compute deltas for backend updates
  const prevScoreRef = useRef(score);

  useEffect(() => {
    // Only act when score actually changed
    const prev = prevScoreRef.current;
    if (score === prev) return;

    const delta = score - prev;
    prevScoreRef.current = score;

    // Update in localStorage for Dashboard to pick up
    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || "null");
      if (currentUser) {
        // Optimistically update localStorage xp so dashboard shows new score immediately
        const updatedUser = {
          ...currentUser,
          xp: (currentUser.xp || 0) + delta,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        // Dispatch custom event so dashboard can listen and update state
        window.dispatchEvent(
          new CustomEvent("user:update", { detail: updatedUser })
        );
      }
    } catch (e) {
      console.warn("Could not update localStorage user xp", e);
    }

    // If user is authenticated, also update backend
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        // Use relative path so dev proxy or production server handles routing
        const resp = await fetch("/api/auth/update-score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ delta }),
        });

        if (!resp.ok) {
          console.error("Failed to update score on server", await resp.text());
          return;
        }

        const data = await resp.json();
        if (data?.success && data.user) {
          // update localStorage with authoritative xp
          const currentUser =
            JSON.parse(localStorage.getItem("user") || "null") || {};
          const merged = { ...currentUser, xp: data.user.xp };
          localStorage.setItem("user", JSON.stringify(merged));
          window.dispatchEvent(
            new CustomEvent("user:update", { detail: merged })
          );
        }
      } catch (err) {
        console.error("Error updating score to backend", err);
      }
    })();
  }, [score]);

  const updatePosition = (pos, playerIndex) => {
    setPlayers((prev) =>
      prev.map((p, i) => (i === playerIndex ? { ...p, position: pos } : p))
    );

    if (pos === 100) {
      if (playerIndex === 0) {
        setScore((s) => s + 50);
      }
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
    if (gameOver || turn !== 0 || loadingQuestion || showIntro) return;

    const roll = Math.floor(Math.random() * 6) + 1;
    setDice(roll);
    setMessage(`You rolled a ${roll}`);

    setTimeout(() => movePlayer(roll, 0), 700);
  };

  const handleAnswer = (option) => {
    if (!pendingMove) return;

    const correct = option === pendingMove.q.answer;
    let finalPosition;

    // Build feedback and keep modal open
    const explanation = pendingMove.q.explanation || pendingMove.q.hint || "";
    setAnswerFeedback({
      correct,
      explanation,
      correctAnswer: pendingMove.q.answer,
    });

    // Update score based on correctness
    setScore((s) => s + (correct ? 2 : -2));

    if (pendingMove.type === "ladder") {
      finalPosition = correct ? pendingMove.jump : pendingMove.newPosition;
      setMessage(
        correct
          ? "Correct! 🪜 Climbed to position " + pendingMove.jump
          : "Wrong Answer!"
      );
    } else if (pendingMove.type === "snake") {
      finalPosition = correct ? pendingMove.newPosition : pendingMove.jump;
      setMessage(correct ? "Correct! 🛡️ Avoided the snake!" : "Wrong Answer!");
    }

    // Store final move to be applied on Continue
    setPendingMove((pm) => (pm ? { ...pm, finalPosition } : pm));
  };

  const continueAfterFeedback = () => {
    if (!pendingMove || !answerFeedback) return;
    const finalPosition = pendingMove.finalPosition ?? pendingMove.newPosition;
    const correct = answerFeedback.correct;
    // Additional message for wrong cases
    if (!correct && pendingMove.type === "ladder") {
      setMessage("Wrong! Stayed at position " + pendingMove.newPosition);
    }
    if (!correct && pendingMove.type === "snake") {
      setMessage("Wrong! 🐍 Slid down to position " + pendingMove.jump);
    }
    setShowQuestion(false);
    setAnswerFeedback(null);
    setTimeout(
      () => updatePosition(finalPosition, pendingMove.playerIndex),
      correct ? 0 : 500
    );
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
      <div className="scale-wrapper">
        <div className="back-button-container">
          <button onClick={goToDashboard} className="back-btn">
            ⬅ Back to Dashboard
          </button>
        </div>
        {showIntro && (
          <div className="overlay">
            <div className="overlay-box">
              <h2>🎯 Race to Win!</h2>
              <p className="intro-text">Race to win against the computer!</p>
              <p className="intro-text">
                Answer correctly to climb ladders and avoid snakes!
              </p>
              <div className="scoring-rules">
                <h3>Scoring:</h3>
                <ul>
                  <li>✅ +2 points for each correct answer</li>
                  <li>❌ -2 points for each wrong answer</li>
                  <li>🏆 +50 points when you reach the goal first!</li>
                </ul>
              </div>
              <button className="start-btn" onClick={() => setShowIntro(false)}>
                Start Game
              </button>
            </div>
          </div>
        )}

        <div className={`game-container ${showIntro ? "blurred" : ""}`}>
          <div className="score-badge">Coins 🪙: {score}</div>

          <div className="app">
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
                    disabled={turn !== 0 || loadingQuestion || showIntro}
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
                      disabled={!!answerFeedback}
                    >
                      {opt}
                    </button>
                  ))}

                  {answerFeedback && (
                    <div
                      className={`answer-feedback ${
                        answerFeedback.correct ? "correct" : "wrong"
                      }`}
                    >
                      {answerFeedback.correct ? (
                        <>
                          <p>✅ Yes, that's correct!</p>
                          <p className="explanation">
                            Fact: {answerFeedback.explanation}
                          </p>
                        </>
                      ) : (
                        <>
                          <p>❌ That's not correct.</p>
                          <p>
                            Correct answer:{" "}
                            <strong>{answerFeedback.correctAnswer}</strong>
                          </p>
                          <p className="explanation">
                            Why: {answerFeedback.explanation}
                          </p>
                        </>
                      )}
                      <button
                        className="continue-btn"
                        onClick={continueAfterFeedback}
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = `
  :root {
      --primary: #6366f1;
      --secondary: #8b5cf6;
      --accent: #a855f7;
      --danger: #f43f5e;
      --success: #10b981;
      --warning: #f59e0b;
      --light: #f8f9ff;
      --dark: #1e293b;
      --glass-bg: rgba(255, 255, 255, 0.9);
  }

  .snakes-ladders-game {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9ff 0%, #e8eaff 50%, #f0f2ff 100%);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .game-container .app {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      color: var(--dark);
      min-height: 100vh;
      width: 100%;
      position: relative;
  }

  /* hide legacy in-container back button (we render a fixed one outside the scaled container) */
  .game-container .back-button-container {
    display: none;
  }

  .game-container .back-btn {
      padding: 0.75rem 1.5rem;
      font-size: 0.95rem;
      font-weight: 600;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      display: flex;
      align-items: center;
      gap: 0.5rem;
  }

  .game-container .back-btn:hover {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.35);
  }

  .game-container .board-container {
      position: relative;
      width: 600px;
      height: 600px;
      box-shadow: 0 20px 60px rgba(99, 102, 241, 0.15), 0 8px 20px rgba(0, 0, 0, 0.08);
      border-radius: 20px;
      overflow: hidden;
      background: white;
      border: 2px solid rgba(255, 255, 255, 0.8);
      transition: all 0.3s ease;
  }

  .game-container .board-container:hover {
      transform: translateY(-2px);
      box-shadow: 0 24px 70px rgba(99, 102, 241, 0.2), 0 10px 24px rgba(0, 0, 0, 0.1);
  }

  .game-container .board-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
  }

  .game-container .game-info {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      padding: 2rem;
      border-radius: 20px;
      width: 420px;
      min-height: 400px;
      box-shadow: 0 15px 35px rgba(99, 102, 241, 0.15), 0 5px 15px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      transition: all 0.3s ease;
  }

  .game-container .intro-banner {
      background: white;
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 12px;
      padding: 1rem;
      text-align: center;
      margin-bottom: 0.5rem;
  }
  .game-container .start-btn {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 0.6rem 1rem;
      margin-top: 0.5rem;
      cursor: pointer;
  }

  .game-container .score-display {
      text-align: center;
      font-weight: 700;
      color: var(--dark);
  }

  .game-container .answer-feedback {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 12px;
      background: rgba(16,185,129,0.08);
    }
  .game-container .answer-feedback.wrong {
      background: rgba(244,63,94,0.1);
    }
  .game-container .answer-feedback .explanation {
      margin-top: 0.5rem;
      color: #374151;
    }
  .game-container .continue-btn {
      margin-top: 0.75rem;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      border: none;
      padding: 0.6rem 1rem;
      border-radius: 10px;
      cursor: pointer;
    }

  .game-container .game-info:hover {
      box-shadow: 0 20px 45px rgba(99, 102, 241, 0.2), 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  .game-container .error-message {
      font-size: 0.95rem;
      color: var(--danger);
      text-align: center;
      padding: 0.75rem;
      background: rgba(244, 63, 94, 0.1);
      border-radius: 12px;
      border: 1px solid rgba(244, 63, 94, 0.2);
      animation: fadeIn 0.5s ease-in;
  }

  .game-container .loading-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      backdrop-filter: blur(8px);
      animation: fadeIn 0.3s ease;
  }

  .game-container .loading-box {
      background: white;
      padding: 2.5rem;
      border-radius: 20px;
      width: 90%;
      max-width: 350px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes scaleIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
  }

  .game-container .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(99, 102, 241, 0.2);
      border-top: 4px solid var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
  }

  .game-container .loading-box span {
      font-size: 1.05rem;
      color: var(--dark);
      font-weight: 600;
  }

  .game-container .game-message {
      font-size: 1.25rem;
      padding: 1rem;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
      color: var(--dark);
      text-align: center;
      animation: fadeIn 0.5s ease-in;
      font-weight: 600;
      border: 1px solid rgba(99, 102, 241, 0.2);
  }

  .game-container .game-message.wrong {
      background: linear-gradient(135deg, rgba(244, 63, 94, 0.15), rgba(239, 68, 68, 0.15));
      color: var(--danger);
      border-color: rgba(244, 63, 94, 0.3);
      animation: shake 0.5s ease-in-out;
  }

  .game-container .dice-display {
      text-align: center;
      font-size: 3rem;
      font-weight: 800;
      color: var(--primary);
      padding: 1.5rem;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08));
      border-radius: 16px;
      border: 2px solid rgba(99, 102, 241, 0.2);
      transition: all 0.3s ease;
  }

  .game-container .dice-display:hover {
      transform: scale(1.02);
      border-color: rgba(99, 102, 241, 0.4);
  }

  .game-container .btn-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
  }

  .game-container button {
      padding: 1rem 2rem;
      font-size: 1.05rem;
      font-weight: 600;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      width: 100%;
  }

  .game-container .roll-btn {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      position: relative;
      overflow: hidden;
  }

  .game-container .roll-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.5s ease;
  }

  .game-container .roll-btn:hover::before {
      left: 100%;
  }

  .game-container .roll-btn.fade {
      opacity: 0.5;
      cursor: not-allowed;
      background: linear-gradient(135deg, #94a3b8, #cbd5e1);
  }

  .game-container .roll-btn:hover:not(.fade) {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
  }

  .game-container .reset-btn {
      background: linear-gradient(135deg, var(--danger), #dc2626);
      color: white;
  }

  .game-container .reset-btn:hover {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(244, 63, 94, 0.4);
  }

  .game-container .question-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      backdrop-filter: blur(8px);
      animation: fadeIn 0.3s ease;
  }

  .game-container .question-box {
      background: white;
      padding: 2.5rem;
      border-radius: 20px;
      width: 90%;
      max-width: 550px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
      animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .game-container .question-box h3 {
      color: var(--dark);
      margin-bottom: 1rem;
      line-height: 1.4;
      font-size: 1.35rem;
      font-weight: 700;
  }

  .game-container .question-hint {
      color: var(--secondary);
      font-size: 0.95rem;
      margin-bottom: 1.5rem;
      font-style: italic;
      padding: 0.75rem;
      background: rgba(139, 92, 246, 0.08);
      border-radius: 10px;
      border-left: 3px solid var(--secondary);
  }

  .game-container .question-option {
      display: block;
      width: 100%;
      padding: 1rem 1.25rem;
      margin: 0.75rem 0;
      background: rgba(248, 249, 255, 0.8);
      border: 2px solid rgba(99, 102, 241, 0.15);
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: left;
      font-size: 0.95rem;
      color: var(--dark);
      font-weight: 500;
  }

  .game-container .question-option:hover {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      border-color: transparent;
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
  }

  @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-8px); }
      40%, 80% { transform: translateX(8px); }
  }

  @keyframes pulse {
      0%, 100% { opacity: 0.8; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
  }

  @media (max-width: 1200px) {
      .game-container .app {
          flex-direction: column;
          padding: 1.5rem 1rem;
          gap: 1.5rem;
      }

      .game-container .board-container {
          width: 90vmin;
          height: 90vmin;
          max-width: 500px;
          max-height: 500px;
      }

      .game-container .game-info {
          width: 90%;
          max-width: 500px;
          min-height: auto;
      }
  }

  @media (max-width: 768px) {
      .game-container .board-container {
          width: 92vmin;
          height: 92vmin;
      }

      .game-container .game-info {
          padding: 1.5rem;
          width: 95%;
      }

      .game-container .btn-group {
          gap: 0.5rem;
      }

    .game-container .back-button-container {
      display: none;
    }

      .game-container .back-btn {
          padding: 0.6rem 1.2rem;
          font-size: 0.85rem;
      }

      .game-container .game-message {
          font-size: 1.05rem;
          padding: 0.75rem;
      }

      .game-container .dice-display {
          font-size: 2.5rem;
          padding: 1rem;
      }

      .game-container button {
          padding: 0.85rem 1.5rem;
          font-size: 0.95rem;
      }

      .game-container .question-box {
          padding: 2rem;
          max-width: 95%;
      }

      .game-container .question-box h3 {
          font-size: 1.15rem;
      }

      .game-container .loading-box {
          max-width: 90%;
          padding: 2rem;
      }
  }

  /* Overlay modal for intro */
  .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
      backdrop-filter: blur(10px);
      animation: fadeIn 0.3s ease;
  }

  .overlay-box {
      background: white;
      padding: 3rem;
      border-radius: 24px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
      animation: scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: center;
  }

  .overlay-box h2 {
      color: var(--primary);
      font-size: 2rem;
      margin-bottom: 1.5rem;
      font-weight: 800;
  }

  .overlay-box .intro-text {
      font-size: 1.15rem;
      color: var(--dark);
      margin-bottom: 1rem;
      font-weight: 500;
  }

  .overlay-box .scoring-rules {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08));
      padding: 1.5rem;
      border-radius: 16px;
      margin: 1.5rem 0;
      border: 2px solid rgba(99, 102, 241, 0.2);
  }

  .overlay-box .scoring-rules h3 {
      color: var(--secondary);
      font-size: 1.2rem;
      margin-bottom: 1rem;
      font-weight: 700;
  }

  .overlay-box .scoring-rules ul {
      list-style: none;
      padding: 0;
      margin: 0;
  }

  .overlay-box .scoring-rules li {
      font-size: 1rem;
      color: var(--dark);
      margin: 0.5rem 0;
      font-weight: 600;
  }

  .overlay-box .start-btn {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      padding: 1rem 3rem;
      font-size: 1.1rem;
      font-weight: 700;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
      transition: all 0.3s ease;
      margin-top: 1rem;
  }

  .overlay-box .start-btn:hover {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(99, 102, 241, 0.5);
  }

  /* Blur effect when modal is shown */
  .game-container.blurred {
      filter: blur(8px);
      pointer-events: none;
  }

  /* Fixed score badge at top-right */
  .score-badge {
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: linear-gradient(135deg, var(--success), #059669);
      color: white;
      padding: 1rem 2rem;
      border-radius: 16px;
      font-size: 1.3rem;
      font-weight: 800;
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
      z-index: 150;
      animation: fadeIn 0.5s ease;
  }

  /* Fixed back button positioned at extreme left of viewport */
  .back-button-container {
    position: fixed;
    top: 2rem;
    left: 1rem;
    z-index: 1000;
  }

  .back-button-container .back-btn {
    padding: 0.6rem 1rem;
    font-size: 0.95rem;
    border-radius: 10px;
    background: rgba(255,255,255,0.95);
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 8px 20px rgba(2,6,23,0.06);
  }

  @media (max-width: 768px) {
      .score-badge {
          top: 1rem;
          right: 1rem;
          padding: 0.75rem 1.5rem;
          font-size: 1.1rem;
      }

      .overlay-box {
          padding: 2rem;
          max-width: 95%;
      }

      .overlay-box h2 {
          font-size: 1.6rem;
      }

      .overlay-box .intro-text {
          font-size: 1rem;
      }

      .overlay-box .start-btn {
          padding: 0.85rem 2rem;
          font-size: 1rem;
      }
  }

  /* Scale wrapper to reduce UI size to 80% while preserving relative layout */
  .scale-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
  }

  /* Apply scaling to the inner game container so tokens and board keep relative positions */
  .scale-wrapper > .game-container {
    transform: scale(0.8);
    transform-origin: top center;
    width: 125%; /* compensate for scaling to keep layout width similar */
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default GameComponent;
