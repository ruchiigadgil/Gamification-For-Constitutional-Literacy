import React from "react";

const Maze = ({ position, maze }) => (
  <div className="maze-grid-container">
    <div className="maze-grid">
      {maze.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className={`maze-cell ${cell === 1 ? "maze-wall" : ""} ${
              position[0] === y && position[1] === x ? "maze-player" : ""
            } ${y === 6 && x === 6 && cell === 0 ? "maze-goal" : ""}`}
          >
            {position[0] === y && position[1] === x ? (
              <span className="player-icon">🎯</span>
            ) : y === 6 && x === 6 && cell === 0 ? (
              <span className="goal-icon">🏆</span>
            ) : (
              ""
            )}
          </div>
        ))
      )}
    </div>
  </div>
);

const styles = `
  .maze-grid-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }

  .maze-grid {
    display: grid;
    grid-template-columns: repeat(7, 45px);
    grid-template-rows: repeat(7, 45px);
    gap: 2px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
    padding: 0.75rem;
    border-radius: 14px;
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
    border: 2px solid rgba(99, 102, 241, 0.2);
  }

  .maze-cell {
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
    border-radius: 6px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .maze-cell::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.2) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .maze-cell:hover::before {
    opacity: 1;
  }

  .maze-cell:not(.maze-wall):not(.maze-player):not(.maze-goal) {
    background: white;
    border: 1px solid rgba(226, 232, 240, 0.8);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .maze-wall {
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(99, 102, 241, 0.3);
    border: 1px solid rgba(79, 70, 229, 0.5);
  }

  .maze-player {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.5), 0 0 20px rgba(251, 191, 36, 0.3);
    border: 2px solid #f59e0b;
    animation: pulse 1.5s ease-in-out infinite;
    transform: scale(1.05);
  }

  .maze-goal {
    background: linear-gradient(135deg, #10b981, #059669);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3);
    border: 2px solid #059669;
    animation: goalGlow 2s ease-in-out infinite;
  }

  .player-icon,
  .goal-icon {
    font-size: 1.5rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    animation: bounce 0.8s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 4px 12px rgba(251, 191, 36, 0.5), 0 0 20px rgba(251, 191, 36, 0.3);
    }
    50% {
      box-shadow: 0 4px 16px rgba(251, 191, 36, 0.7), 0 0 30px rgba(251, 191, 36, 0.5);
    }
  }

  @keyframes goalGlow {
    0%, 100% {
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3);
    }
    50% {
      box-shadow: 0 4px 16px rgba(16, 185, 129, 0.7), 0 0 30px rgba(16, 185, 129, 0.5);
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-3px);
    }
  }

  @media (max-width: 768px) {
    .maze-grid {
      grid-template-columns: repeat(7, 40px);
      grid-template-rows: repeat(7, 40px);
      gap: 2px;
      padding: 0.6rem;
    }

    .maze-cell {
      width: 40px;
      height: 40px;
      font-size: 1.25rem;
      border-radius: 5px;
    }

    .player-icon,
    .goal-icon {
      font-size: 1.25rem;
    }
  }

  @media (max-width: 480px) {
    .maze-grid {
      grid-template-columns: repeat(7, 35px);
      grid-template-rows: repeat(7, 35px);
      gap: 2px;
      padding: 0.5rem;
    }

    .maze-cell {
      width: 35px;
      height: 35px;
      font-size: 1.125rem;
      border-radius: 4px;
    }

    .player-icon,
    .goal-icon {
      font-size: 1.125rem;
    }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
if (!document.querySelector('style[data-maze-styles]')) {
  styleSheet.setAttribute('data-maze-styles', 'true');
  document.head.appendChild(styleSheet);
}

export default Maze;
