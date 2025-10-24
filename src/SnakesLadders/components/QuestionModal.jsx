import React from "react";
import "../styles/QuestionModal.css";

const QuestionModal = ({ question, options, onSelectOption }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{question}</h2>
        {options.map((option, idx) => (
          <button key={idx} onClick={() => onSelectOption(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionModal;
