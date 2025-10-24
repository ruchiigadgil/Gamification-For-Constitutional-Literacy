// Dice.js
import React from "react";
import "../styles/Dice.css";

const Dice = ({ onRoll, diceValue, currentPlayer }) => {
  return (
    <div className="snakes-ladders-game">
    <div className="dice">
      {currentPlayer === 0 ? (
        <button onClick={onRoll}>Roll Dice</button>
      ) : (
        <p>Computer is thinking...</p>
      )}

      {diceValue && (
        <p>
          {currentPlayer === 0
            ? `You rolled: ${diceValue}`
            : `Computer rolled: ${diceValue}`}
        </p>
      )}
    </div>
    </div>
  );
};

export default Dice;
