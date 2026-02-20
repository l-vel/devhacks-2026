import type React from "react";
import { useState } from "react";

export const WordDetails: React.FC = () => {
  const [modal, setModal] = useState(true);
  const [status, setStatus] = useState("Unknown");

  return (
    <>
      {modal && (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: "fixed",
            backgroundColor: "black",
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setModal(false)}>X</button>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {["Unknown", "Seen", "Known"].map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="fav_language"
                  value={option}
                  checked={status === option}
                  onChange={() => setStatus(option)}
                />
                {option}
              </label>
            ))}
          </div>
          <p style={{ display: "flex", justifyContent: "flex-end" }}>
            Selected: {status}
          </p>
        </div>
      )}
    </>
  );
};
