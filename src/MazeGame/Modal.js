import React from "react";

const Modal = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        <h3
          style={{
            margin: "0 0 10px",
            color: "#333",
          }}
        >
          {message}
        </h3>
        <button
          className="button"
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "1em",
            cursor: "pointer",
            backgroundColor: "#a58a6f",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Modal;