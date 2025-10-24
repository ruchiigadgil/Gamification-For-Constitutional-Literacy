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
    <div className="container">
      <h1>Law Maze</h1>
      <p className="score">Score: {score}</p>
      {/* <p>Debug State: {gameState}</p> */}

      {(gameState === 'playing' || gameState === 'trivia' || gameState === 'explanation') && ( // Show maze in these states
        <>
          <Maze position={position} maze={maze} />
          {gameState === 'playing' && <p>Use arrow keys to move to the green square (6,6)!</p>}
        </>
      )}

      {gameState === 'trivia' && currentQuestion && (
        <Trivia question={currentQuestion} onAnswer={handleAnswer} />
      )}

      {gameState === 'won' && (
        <div>
          <h2 className="message won">You Won!</h2>
          <p>Final Score: {score}</p>
          <button className="button" onClick={() => { setPosition([0, 0]); setScore(0); setGameState('playing'); }}>
            Play Again
          </button>
        </div>
      )}

      <Modal
        show={showModal}
        // Display explanation on correct answer, wrong answer message on incorrect
        message={gameState === 'explanation' ? explanationText : "Wrong answer! -5 points. Try again!"}
        onClose={() => {
          setShowModal(false);
          setExplanationText(null); // Clear explanation text when closing
          setGameState('playing'); // Always transition back to playing after modal close
        }}
      />
    </div>
  );
};
export default Game;
