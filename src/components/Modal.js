import React from "react";
import "./Modal.css"; // We'll use your existing modal styles

function Modal({ title, children, buttons, onClose }) {
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {title && <h2>{title}</h2>}
        <div className="modal-body">{children}</div>
        {buttons && (
          <div className="modal-buttons">
            {buttons.map((btn, index) => (
              <button
                key={index}
                className={btn.className || "save-exit-button"}
                onClick={btn.onClick}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;