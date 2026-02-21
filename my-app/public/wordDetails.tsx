import type React from "react";
import { useState } from "react";
import spanishWords from "./spanish.json";

type Word = {
  word: string;
  useful_for_flashcard: boolean;
  cefr_level: string;
  english_translation: string;
  example_sentence_native: string;
  example_sentence_english: string;
  pos: string;
  word_frequency: number;
};

export const WordDetails: React.FC = () => {
  const [modal, setModal] = useState(true);
  const [status, setStatus] = useState("Unknown");

  const words = spanishWords as Word[];

  const wordToFind = "año";
  const wordData = words.find((w) => w.word === wordToFind);
  const translation = wordData?.english_translation || "Not found";
  const spanishPhrase = wordData?.example_sentence_native || "Not found";
  const englishPhrase = wordData?.example_sentence_english || "Not found";

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
            borderRadius: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{ color: "green", fontSize: "1.5rem", margin: "1rem" }}>
              {wordToFind}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
              <button onClick={() => setModal(false)}>X</button>
            </div>
          </div>
          <p style={{ display: "flex", justifyContent: "right" }}>
            Selected: {status}
          </p>
          <p
            style={{
              display: "flex",
              justifyContent: "left",
              margin: ".5rem",
            }}
          >
            Translation: {translation}
          </p>
          <p
            style={{
              display: "flex",
              justifyContent: "left",
              margin: ".5rem",
              borderRadius: ".2rem",
              background: "grey",
              width: "max-content",
              paddingLeft: ".2rem",
              paddingRight: ".2rem",
            }}
          >
            Ex: (Spanish): {spanishPhrase}
          </p>
          <p
            style={{
              display: "flex",
              justifyContent: "left",
              margin: ".5rem",
              fontSize: "0.7rem",
              borderRadius: ".2rem",
              background: "grey",
              width: "max-content",
              paddingLeft: ".2rem",
              paddingRight: ".2rem",
            }}
          >
            Ex: (English): {englishPhrase}
          </p>
        </div>
      )}
    </>
  );
};
