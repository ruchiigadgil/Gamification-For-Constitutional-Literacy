import React from "react";
import { Link, useNavigate } from "react-router-dom";
import snlImage from "./images/snl.png";
import multiQuizImage from "./images/multi_quiz.png";
import mazeGameImage from "./images/maze_game.png";
import pict from "./images/pict.png";

const Games = () => {
  const navigate = useNavigate();
  
  const games = [
    {
      id: 1,
      title: "Snakes and Ladders",
      description: "Embark on an adventure through the Indian Constitution",
      image: snlImage,
      level: "Beginner",
      players: "1 Player",
      duration: "30 mins",
      li: "/snakeladder",
    },
    {
      id: 2,
      title: "Multi-Player Quiz",
      description: "Defend fundamental rights by making quick decisions in various scenarios.",
      image: multiQuizImage,
      level: "Intermediate",
      players: "1-2 Players",
      duration: "20 mins",
      li: "/multi_quiz",
    },
    {
      id: 3,
      title: "Maze Game",
      description: "Experience the law-making process by simulating parliamentary procedures.",
      image: mazeGameImage,
      level: "Advanced",
      players: "2-5 Players",
      duration: "45 mins",
      li: "/maze_game",
    },
    {
      id: 4,
      title: "Pictionary",
      description: "Test your knowledge of the Indian Constitution in this fast-paced trivia game.",
      image: pict,
      level: "All Levels",
      players: "2-4 Players",
      duration: "15 mins",
      li: "/pictionary",
    },
  ];

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8f9ff 0%, #e8eaff 50%, #f0f2ff 100%)',
    padding: '30px 15px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px',
    maxWidth: '800px',
    margin: '0 auto 40px auto',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '15px',
    letterSpacing: '-0.02em',
  };

  const descriptionStyle = {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: '1.6',
    maxWidth: '550px',
    margin: '0 auto',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '40px',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 15px 30px rgba(99, 102, 241, 0.1), 0 6px 12px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    cursor: 'pointer',
  };

  const cardHoverStyle = {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 32px 64px rgba(99, 102, 241, 0.2), 0 16px 32px rgba(0, 0, 0, 0.1)',
  };

  const imageContainerStyle = {
    height: '160px',
    overflow: 'hidden',
    position: 'relative',
    background: 'linear-gradient(45deg, #f8f9ff, #e8eaff)',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const contentStyle = {
    padding: '18px',
    position: 'relative',
  };

  const gameTitleStyle = {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
    lineHeight: '1.3',
  };

  const gameDescStyle = {
    fontSize: '0.85rem',
    color: '#64748b',
    lineHeight: '1.5',
    marginBottom: '16px',
  };

  const metaContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '18px',
  };

  const metaBadgeStyle = {
    padding: '4px 10px',
    borderRadius: '16px',
    fontSize: '0.75rem',
    fontWeight: '500',
    border: '1px solid rgba(139, 92, 246, 0.2)',
  };

  const levelBadgeStyle = {
    ...metaBadgeStyle,
    background: 'linear-gradient(135deg, #ddd6fe, #e0e7ff)',
    color: '#6366f1',
  };

  const playersBadgeStyle = {
    ...metaBadgeStyle,
    background: 'linear-gradient(135deg, #f3e8ff, #fae8ff)',
    color: '#8b5cf6',
  };

  const durationBadgeStyle = {
    ...metaBadgeStyle,
    background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
    color: '#a855f7',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px 18px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  };

  const buttonHoverStyle = {
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 24px rgba(99, 102, 241, 0.4)',
  };

  const responsiveStyle = `
    @media (max-width: 768px) {
      .games-grid {
        grid-template-columns: 1fr !important;
        gap: 20px !important;
      }
      .game-title {
        font-size: 2rem !important;
      }
      .game-description {
        font-size: 0.9rem !important;
      }
    }
  `;

  return (
    <>
      <style>{responsiveStyle}</style>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 className="game-title" style={titleStyle}>Learn Through Play</h1>
          <p className="game-description" style={descriptionStyle}>
            Explore the Indian Constitution through our interactive games. Each game is designed 
            to make learning fun and engaging while reinforcing important constitutional concepts.
          </p>
        </div>

        <div className="games-grid" style={gridStyle}>
          {games.map((game) => (
            <div
              key={game.id}
              style={cardStyle}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyle);
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1.1)';
                const btn = e.currentTarget.querySelector('button');
                if (btn) Object.assign(btn.style, buttonHoverStyle);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, cardStyle);
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
                const btn = e.currentTarget.querySelector('button');
                if (btn) Object.assign(btn.style, buttonStyle);
              }}
            >
              <div style={imageContainerStyle}>
                <img
                  src={game.image}
                  alt={game.title}
                  style={imageStyle}
                />
              </div>
              
              <div style={contentStyle}>
                <h3 style={gameTitleStyle}>{game.title}</h3>
                <p style={gameDescStyle}>{game.description}</p>
                
                <div style={metaContainerStyle}>
                  <span style={levelBadgeStyle}>{game.level}</span>
                  <span style={playersBadgeStyle}>{game.players}</span>
                  <span style={durationBadgeStyle}>{game.duration}</span>
                </div>
                
                <button
                  style={buttonStyle}
                  onClick={() => navigate(game.li || "#")}
                >
                  Play Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Games;