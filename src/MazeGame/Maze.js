import React from "react";

const Maze = ({ position, maze }) => (
  <div
    className="maze"
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(7, 30px)",
      gridTemplateRows: "repeat(7, 30px)",
      border: "1px solid #4a3a2a",
      margin: "20px auto",
      width: "fit-content",
    }}
  >
    {maze.map((row, y) =>
      row.map((cell, x) => (
        <div
          key={`${y}-${x}`}
          className={`cell ${cell === 1 ? "wall" : ""} ${
            position[0] === y && position[1] === x ? "player" : ""
          } ${y === 6 && x === 6 && cell === 0 ? "goal" : ""}`}
          style={{
            width: "30px",
            height: "30px",
            border: "1px solid #b08968",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            backgroundColor:
              cell === 1
                ? "#4a3a2a"
                : position[0] === y && position[1] === x
                ? "#fcdb75"
                : y === 6 && x === 6 && cell === 0
                ? "lightgreen"
                : "white",
          }}
        >
          {position[0] === y && position[1] === x ? "P" : ""}
        </div>
      ))
    )}
  </div>
);

export default Maze;