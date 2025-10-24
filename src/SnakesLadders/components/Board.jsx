import React from "react";
import PlayerToken from "./PlayerToken";
import "../styles/Board.css";

const Board = ({
  players = [],
  dice,
  message,
  gameOver,
  turn,
  showQuestion,
  pendingMove,
  onRollDice,
  onResetGame,
  onAnswer,
}) => {
  return (
    <div className="snakes-ladders-game">
    <div className="game-ui-wrapper">
      {/* Game Board */}
      <div className="board-container">
        <img
          src={boardImage}
          alt="Snakes and Ladders Board"
          className="board-image"
        />
        {players.map((player, index) => (
          <PlayerToken key={index} player={player} index={index} />
        ))}
      </div>

      {/* Game Controls */}
      <div className="game-controls">
        {message && <div className="game-message">{message}</div>}
        {dice && <div className="dice-value">🎲: {dice}</div>}

        {!gameOver && turn === 0 && !showQuestion ? (
          <button className="roll-button" onClick={onRollDice}>
            Roll Dice
          </button>
        ) : null}

        {gameOver && (
          <button className="reset-button" onClick={onResetGame}>
            Play Again
          </button>
        )}
      </div>

      {/* Question Modal */}
      {showQuestion && pendingMove && (
        <div className="question-modal-overlay">
          <div className="question-modal">
            <h3>{pendingMove.q.q}</h3>
            <div className="options-container">
              {pendingMove.q.options.map((option, i) => (
                <button
                  key={i}
                  className="option-button"
                  onClick={() => onAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div></div>
  );
};

export default Board;
