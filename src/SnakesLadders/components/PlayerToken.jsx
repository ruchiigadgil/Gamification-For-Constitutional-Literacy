import React from "react";
import "../styles/PlayerToken.css";

const getPositionCoordinates = (position) => {
  const row = Math.floor((position - 1) / 10);
  const col = (position - 1) % 10;
  const isReversed = row % 2 === 1;
  const x = isReversed ? 9 - col : col;
  const y = 9 - row;

  return {
    left: `${x * 10 + 5}%`,
    top: `${y * 10 + 5}%`,
  };
};

const PlayerToken = ({ player, index }) => {
  const coords = getPositionCoordinates(player?.position || 1);
  return (
    <div
      className={`token token-${index}`}
      style={{
        left: coords.left,
        top: coords.top,
      }}
    >
      {index === 0 ? "♟️" : "🤖"}
    </div>
  );
};

export default PlayerToken;
