import React, { useState } from "react";

const Trivia = ({ question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    const isCorrect = index === question.correct;
    onAnswer(isCorrect);
    setShowExplanation(true);
  };

  return (
    <div className="trivia-container">
      <div className="trivia-content">
        <h2 className="trivia-question">{question.text}</h2>
        <div className="trivia-options">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`trivia-option ${
                selectedAnswer === idx
                  ? idx === question.correct
                    ? "trivia-option-correct"
                    : "trivia-option-wrong"
                  : ""
              }`}
              disabled={selectedAnswer !== null}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className="trivia-explanation">
            <div className="explanation-header">
              <span className="explanation-icon">💡</span>
              <h3 className="explanation-title">Explanation</h3>
            </div>
            <p className="explanation-text">{question.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = `
  .trivia-container {
    margin-top: 1.5rem;
    width: 100%;
  }

  .trivia-content {
    background: white;
    padding: 1.5rem;
    border-radius: 14px;
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.12);
    border: 1px solid rgba(99, 102, 241, 0.15);
  }

  .trivia-question {
    font-size: 1.125rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1.25rem;
    line-height: 1.5;
    text-align: center;
    padding: 0.875rem;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
    border-radius: 10px;
    border-left: 4px solid #6366f1;
  }

  .trivia-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  .trivia-option {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 0.875rem 1rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: #1e293b;
    background: rgba(248, 249, 255, 0.8);
    border: 2px solid rgba(99, 102, 241, 0.15);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: left;
    position: relative;
    overflow: hidden;
  }

  .trivia-option::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent, rgba(99, 102, 241, 0.05));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .trivia-option:hover:not(:disabled) {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border-color: transparent;
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  .trivia-option:hover:not(:disabled) .option-letter {
    background: white;
    color: #6366f1;
  }

  .trivia-option:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .trivia-option-correct {
    background: linear-gradient(135deg, #10b981, #059669) !important;
    color: white !important;
    border-color: transparent !important;
    animation: correctPulse 0.5s ease;
  }

  .trivia-option-correct .option-letter {
    background: white !important;
    color: #10b981 !important;
  }

  .trivia-option-wrong {
    background: linear-gradient(135deg, #ef4444, #dc2626) !important;
    color: white !important;
    border-color: transparent !important;
    animation: wrongShake 0.5s ease;
  }

  .trivia-option-wrong .option-letter {
    background: white !important;
    color: #ef4444 !important;
  }

  .option-letter {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    font-weight: 700;
    font-size: 0.875rem;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  .option-text {
    flex: 1;
    position: relative;
    z-index: 1;
  }

  .trivia-explanation {
    padding: 1.25rem;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(168, 85, 247, 0.08));
    border-radius: 10px;
    border: 1px solid rgba(139, 92, 246, 0.2);
    animation: fadeIn 0.5s ease;
  }

  .explanation-header {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-bottom: 0.625rem;
  }

  .explanation-icon {
    font-size: 1.25rem;
  }

  .explanation-title {
    font-size: 1rem;
    font-weight: 700;
    color: #8b5cf6;
    margin: 0;
  }

  .explanation-text {
    font-size: 0.875rem;
    color: #475569;
    line-height: 1.6;
    margin: 0;
    padding-left: 1.875rem;
  }

  @keyframes correctPulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }

  @keyframes wrongShake {
    0%, 100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-8px);
    }
    75% {
      transform: translateX(8px);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .trivia-content {
      padding: 1.25rem;
    }

    .trivia-question {
      font-size: 1rem;
      padding: 0.75rem;
    }

    .trivia-option {
      padding: 0.75rem 0.875rem;
      font-size: 0.875rem;
    }

    .option-letter {
      width: 26px;
      height: 26px;
      font-size: 0.8125rem;
    }

    .trivia-explanation {
      padding: 1rem;
    }

    .explanation-text {
      font-size: 0.8125rem;
      padding-left: 0;
    }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
if (!document.querySelector('style[data-trivia-styles]')) {
  styleSheet.setAttribute('data-trivia-styles', 'true');
  document.head.appendChild(styleSheet);
}

export default Trivia;
