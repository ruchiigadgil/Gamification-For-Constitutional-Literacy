import React from "react";
import "../styles/QuestionModal.css";

const QuestionModal = ({ question, options, onSelectOption, hint }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{question}</h2>
        {hint && <p className="question-hint">{hint}</p>}
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onSelectOption(option)}
            className="question-option"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionModal;
