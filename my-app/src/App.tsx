import "./App.css";
import { useState } from "react";
import { WordDetails } from "../public/wordDetails";

function App() {
  const [knownWords] = useState(0);
  const [unknownWords] = useState(0);
  return (
    <div>
      <WordDetails></WordDetails>
      <header style={{ fontSize: "150%" }}>Spanish To Ingles~</header>
      <div style={{ display: "flex" }}>
        <div style={{ margin: "8px" }}>
          <div
            style={{
              padding: "3px",
              fontSize: "300%",
            }}
          >
            {knownWords}
          </div>
          <div text-xs="" c-text-tertiary="" font-semibold="">
            Known words
          </div>
        </div>
        <div style={{ margin: "8px" }}>
          <div
            style={{
              padding: "3px",
              fontSize: "300%",
            }}
          >
            {unknownWords}
          </div>
          <div text-xs="" c-text-tertiary="" font-semibold="">
            Seen words
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
