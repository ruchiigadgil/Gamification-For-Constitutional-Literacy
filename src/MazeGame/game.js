import React, { useState, useEffect } from 'react';
import Maze from './Maze';
import Trivia from './Trivia';
import Modal from './Modal';

const Game = () => {
  const initialMaze = [
    [0, 1, 0, 0, 1, 0, 0],
    [0, 1, 0, 1, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ];

  const [maze] = useState(initialMaze);
  const [position, setPosition] = useState([0, 0]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'trivia', 'won'
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [explanationText, setExplanationText] = useState(null);
  const [intendedPosition, setIntendedPosition] = useState(null); // New state for intended position

  const questions = [
    {
      text: "Who is known as the 'Father of the Indian Constitution'?",
      options: ["Mahatma Gandhi", "B. R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"],
      correct: 1,
      explanation: "Dr. B. R. Ambedkar is known as the 'Father of the Indian Constitution' for his crucial role in its drafting."
    },
    {
      text: "Which article guarantees 'Right to Equality' to all Indian citizens?",
      options: ["Article 14", "Article 21", "Article 32", "Article 44"],
      correct: 0,
      explanation: "Article 14 of the Indian Constitution guarantees the right to equality to all citizens of India."
    },
    {
      text: "The Indian Constitution was adopted on which date?",
      options: ["15th August 1947", "26th January 1950", "26th November 1949", "2nd October 1947"],
      correct: 2,
      explanation: "The Indian Constitution was adopted on 26th November 1949 and came into effect on 26th January 1950."
    },
    {
      text: "Which amendment introduced the Goods and Services Tax (GST) in India?",
      options: ["86th", "100th", "101st", "102nd"],
      correct: 2,
      explanation: "The 101st Amendment of the Indian Constitution introduced the Goods and Services Tax (GST)."
    },
    {
      text: "Which article of the Indian Constitution deals with the 'Right to Life and Personal Liberty'?",
      options: ["Article 19", "Article 21", "Article 14", "Article 22"],
      correct: 1,
      explanation: "Article 21 of the Indian Constitution guarantees the 'Right to Life and Personal Liberty' to all citizens."
    },
    {
      text: "What is the minimum age to become the President of India?",
      options: ["25", "30", "35", "40"],
      correct: 2,
      explanation: "According to Article 58, the minimum age required to become the President of India is 35 years."
    },
    {
      text: "Which article of the Constitution of India deals with the provisions related to the Union Executive?",
      options: ["Article 52", "Article 61", "Article 63", "Article 78"],
      correct: 0,
      explanation: "Article 52 of the Constitution of India deals with the office of the President of India, part of the Union Executive."
    },
    {
      text: "Who appoints the Judges of the Supreme Court in India?",
      options: ["The President", "The Parliament", "The Chief Justice", "The Prime Minister"],
      correct: 0,
      explanation: "Judges of the Supreme Court in India are appointed by the President of India."
    },
    {
      text: "Which body is responsible for conducting elections in India?",
      options: ["Supreme Court", "Election Commission", "Rajya Sabha", "Lok Sabha"],
      correct: 1,
      explanation: "The Election Commission of India is responsible for conducting elections in India."
    },
    {
      text: "The term 'Secular' was added to the Preamble of the Indian Constitution by which amendment?",
      options: ["42nd Amendment", "44th Amendment", "52nd Amendment", "73rd Amendment"],
      correct: 0,
      explanation: "The term 'Secular' was added to the Preamble by the 42nd Amendment in 1976."
    },
    {
      text: "Which part of the Indian Constitution deals with the Directive Principles of State Policy?",
      options: ["Part III", "Part IV", "Part V", "Part VI"],
      correct: 1,
      explanation: "The Directive Principles of State Policy are covered under Part IV of the Indian Constitution."
    },
    {
      text: "Which of the following amendments deals with the reservation of seats for Scheduled Castes and Scheduled Tribes?",
      options: ["10th Amendment", "15th Amendment", "16th Amendment", "27th Amendment"],
      correct: 2,
      explanation: "The 16th Amendment of the Indian Constitution deals with the reservation of seats for Scheduled Castes and Scheduled Tribes."
    },
    {
      text: "What is the maximum number of members in the Rajya Sabha?",
      options: ["240", "250", "300", "400"],
      correct: 1,
      explanation: "The Rajya Sabha can have a maximum of 250 members, as per Article 80 of the Indian Constitution."
    },
    {
      text: "Who is the first woman Prime Minister of India?",
      options: ["Indira Gandhi", "Sarojini Naidu", "Kasturba Gandhi", "Pratibha Patil"],
      correct: 0,
      explanation: "Indira Gandhi was the first woman Prime Minister of India."
    },
    {
      text: "In which year was the Indian Constitution enacted?",
      options: ["1945", "1947", "1949", "1950"],
      correct: 2,
      explanation: "The Indian Constitution was enacted on 26th November 1949 and came into effect on 26th January 1950."
    },
    {
      text: "Which article allows the Indian Parliament to create new states?",
      options: ["Article 1", "Article 2", "Article 3", "Article 4"],
      correct: 2,
      explanation: "Article 3 allows the Indian Parliament to create new states and alter the boundaries of existing ones."
    },
    {
      text: "Which article of the Indian Constitution deals with the 'Right to Freedom of Speech and Expression'?",
      options: ["Article 14", "Article 19", "Article 21", "Article 32"],
      correct: 1,
      explanation: "Article 19 of the Indian Constitution guarantees the 'Right to Freedom of Speech and Expression' to all citizens."
    },
    {
      text: "Which body is responsible for the protection of the rights of Indian citizens?",
      options: ["Supreme Court", "Parliament", "Election Commission", "President"],
      correct: 0,
      explanation: "The Supreme Court of India is responsible for the protection of the rights of Indian citizens, especially under Article 32."
    },
    {
      text: "Which amendment of the Constitution of India reduced the voting age from 21 to 18?",
      options: ["42nd Amendment", "44th Amendment", "61st Amendment", "73rd Amendment"],
      correct: 2,
      explanation: "The 61st Amendment of 1988 lowered the minimum voting age from 21 years to 18 years."
    },
    {
      text: "What is the maximum term for a Lok Sabha member?",
      options: ["3 years", "5 years", "6 years", "7 years"],
      correct: 1,
      explanation: "A member of the Lok Sabha is elected for a maximum term of 5 years."
    },
    {
      text: "Which body is responsible for approving the Union Budget?",
      options: ["Lok Sabha", "Rajya Sabha", "Prime Minister", "President"],
      correct: 0,
      explanation: "The Lok Sabha is responsible for approving the Union Budget, as per the Constitution of India."
    }
  ];

  const generateRandomQuestion = () => {
    return questions[Math.floor(Math.random() * questions.length)];
  };

  const movePlayer = (dy, dx) => {
    const newY = position[0] + dy;
    const newX = position[1] + dx;
    if (newY >= 0 && newY < 7 && newX >= 0 && newX < 7 && maze[newY][newX] === 0) {
      if (newY === 6 && newX === 6) {
        setGameState('won');
      } else {
        // Store intended position, generate question, and show trivia
        setIntendedPosition([newY, newX]);
        setCurrentQuestion(generateRandomQuestion());
 setGameState('trivia');
      }
    }
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(prev => prev + 10);
      setExplanationText(currentQuestion.explanation);
      // Move player to intended position on correct answer
 setPosition(intendedPosition);
 setIntendedPosition(null); // Clear intended position
      setGameState('explanation'); // New state for showing explanation
      setShowModal(true); // Use modal to display explanation
    } else {
      setScore(prev => Math.max(prev - 5, 0));
      setIntendedPosition(null); // Clear intended position
      setShowModal(true);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const handleKey = (e) => {
      if (gameState !== 'playing') return; // Only allow movement in 'playing' state
      switch (e.key) {
        case 'ArrowUp': movePlayer(-1, 0); break;
        case 'ArrowDown': movePlayer(1, 0); break;
        case 'ArrowLeft': movePlayer(0, -1); break;
        case 'ArrowRight': movePlayer(0, 1); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [gameState, movePlayer]); // Added movePlayer to dependencies

  return (
    <div className="maze-game-container">
      <div className="maze-game-content">
        <div className="maze-header">
          <h1 className="maze-title">Law Maze Challenge</h1>
          <div className="maze-score">
            <span className="score-label">Score:</span>
            <span className="score-value">{score}</span>
          </div>
        </div>

        {(gameState === 'playing' || gameState === 'trivia' || gameState === 'explanation') && (
          <div className="maze-game-section">
            <Maze position={position} maze={maze} />
            {gameState === 'playing' && (
              <p className="maze-instruction">
                🎮 Use arrow keys to navigate to the goal! Answer questions correctly to earn points.
              </p>
            )}
          </div>
        )}

        {gameState === 'won' && (
          <div className="maze-won-container">
            <div className="maze-won-content">
              <h2 className="maze-won-title">🎉 Congratulations!</h2>
              <p className="maze-won-message">You've completed the Law Maze!</p>
              <div className="maze-final-score">
                <span className="final-score-label">Final Score:</span>
                <span className="final-score-value">{score}</span>
              </div>
              <button 
                className="maze-play-again-btn" 
                onClick={() => { 
                  setPosition([0, 0]); 
                  setScore(0); 
                  setGameState('playing'); 
                }}
              >
                🔄 Play Again
              </button>
            </div>
          </div>
        )}

        {gameState === 'trivia' && currentQuestion && (
          <div className="trivia-overlay">
            <Trivia question={currentQuestion} onAnswer={handleAnswer} />
          </div>
        )}

        <Modal
          show={showModal}
          message={gameState === 'explanation' ? explanationText : "Wrong answer! -5 points. Try again!"}
          onClose={() => {
            setShowModal(false);
            setExplanationText(null);
            setGameState('playing');
          }}
        />
      </div>
    </div>
  );
};

const styles = `
  .maze-game-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8f9ff 0%, #e8eaff 50%, #f0f2ff 100%);
    padding: 1.5rem;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .maze-game-content {
    max-width: 750px;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 1.75rem;
    box-shadow: 0 20px 60px rgba(99, 102, 241, 0.15), 0 8px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .maze-header {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .maze-title {
    font-size: 2rem;
    font-weight: 800;
    background: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.75rem;
    letter-spacing: -0.02em;
  }

  .maze-score {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1.25rem;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
    border-radius: 14px;
    border: 2px solid rgba(99, 102, 241, 0.2);
    font-size: 1rem;
    font-weight: 600;
  }

  .score-label {
    color: #64748b;
  }

  .score-value {
    color: #6366f1;
    font-weight: 700;
    font-size: 1.25rem;
  }

  .maze-game-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .maze-instruction {
    text-align: center;
    color: #64748b;
    font-size: 0.875rem;
    padding: 0.75rem 1.25rem;
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(139, 92, 246, 0.08));
    border-radius: 12px;
    border: 1px solid rgba(139, 92, 246, 0.2);
    max-width: 450px;
  }

  .maze-won-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem 0;
  }

  .maze-won-content {
    text-align: center;
    padding: 1.5rem;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08));
    border-radius: 18px;
    border: 2px solid rgba(99, 102, 241, 0.2);
  }

  .maze-won-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  .maze-won-message {
    font-size: 1rem;
    color: #64748b;
    margin-bottom: 1.25rem;
  }

  .maze-final-score {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    padding: 0.75rem 1.5rem;
    background: white;
    border-radius: 14px;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  }

  .final-score-label {
    font-size: 1.125rem;
    color: #64748b;
    font-weight: 600;
  }

  .final-score-value {
    font-size: 1.75rem;
    font-weight: 800;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .maze-play-again-btn {
    padding: 0.875rem 2rem;
    font-size: 0.95rem;
    font-weight: 600;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  .maze-play-again-btn:hover {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
  }

  .trivia-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 1rem;
    animation: fadeIn 0.3s ease;
  }

  .trivia-overlay .trivia-container {
    margin: 0;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 768px) {
    .maze-game-container {
      padding: 1rem;
    }

    .maze-game-content {
      padding: 1.5rem;
    }

    .maze-title {
      font-size: 1.75rem;
    }

    .maze-score {
      font-size: 1rem;
      padding: 0.5rem 1rem;
    }

    .score-value {
      font-size: 1.25rem;
    }

    .maze-won-title {
      font-size: 1.5rem;
    }

    .final-score-value {
      font-size: 1.5rem;
    }

    .trivia-overlay {
      padding: 0.5rem;
    }

    .trivia-overlay .trivia-container {
      max-height: 95vh;
    }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default Game;
