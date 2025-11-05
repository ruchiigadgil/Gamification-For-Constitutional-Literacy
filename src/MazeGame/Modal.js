import React from "react";

const Modal = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="maze-modal-overlay">
      <div className="maze-modal-content">
        <div className="maze-modal-icon">
          {message.includes("Wrong") ? "❌" : "✅"}
        </div>
        <h3 className="maze-modal-message">{message}</h3>
        <button className="maze-modal-btn" onClick={onClose}>
          Continue →
        </button>
      </div>
    </div>
  );
};

const styles = `
  .maze-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: modalFadeIn 0.3s ease;
  }

  .maze-modal-content {
    background: white;
    padding: 2rem;
    border-radius: 18px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    text-align: center;
    max-width: 450px;
    width: 90%;
    animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .maze-modal-icon {
    font-size: 3.5rem;
    margin-bottom: 0.875rem;
    animation: modalIconPop 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .maze-modal-message {
    margin: 0 0 1.25rem;
    color: #1e293b;
    font-size: 1rem;
    line-height: 1.6;
    font-weight: 500;
    padding: 0.875rem;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
    border-radius: 10px;
  }

  .maze-modal-btn {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border: none;
    border-radius: 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    min-width: 130px;
  }

  .maze-modal-btn:hover {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
  }

  .maze-modal-btn:active {
    transform: translateY(0);
  }

  @keyframes modalFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes modalIconPop {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    .maze-modal-content {
      padding: 1.75rem;
      max-width: 90%;
    }

    .maze-modal-icon {
      font-size: 2.75rem;
    }

    .maze-modal-message {
      font-size: 0.9375rem;
      padding: 0.75rem;
    }

    .maze-modal-btn {
      padding: 0.75rem 1.5rem;
      font-size: 0.875rem;
    }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
if (!document.querySelector('style[data-modal-styles]')) {
  styleSheet.setAttribute('data-modal-styles', 'true');
  document.head.appendChild(styleSheet);
}

export default Modal;
