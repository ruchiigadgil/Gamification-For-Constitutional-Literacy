import React from "react";
import "../styles/Player.css";
import userToken from "../assets/token-user.png";
import computerToken from "../assets/token-computer.png";

const getCoordinates = (pos) => {
  const row = Math.floor((pos - 1) / 10);
  const col = row % 2 === 0 ? (pos - 1) % 10 : 9 - ((pos - 1) % 10);

  return {
    top: `${(9 - row) * 10}%`,
    left: `${col * 10}%`,
  };
};

const Player = ({ position, isUser }) => {
  return (
    <div className="snakes-ladders-game">
    <img
      src={isUser ? userToken : computerToken}
      alt={isUser ? "User" : "Computer"}
      className={`token ${isUser ? "user" : "computer"}`}
      style={getCoordinates(position)}
    /></div>
  );
};

export default Player;
