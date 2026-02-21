
import { useState, useEffect } from "react";
import { loadTopWords } from './storage.js';


export default function FrequencyList() {
  const [words, setWords] = useState([]);


  useEffect(() => {
    async function loadWords() {
      const topWords = await loadTopWords(500);
      setWords(topWords);

    }

    loadWords();
  }, []);


  return (

    <div className="container">
      <h1 className="mt-3 pb-4">Top 500 Frequent Spanish Words</h1>

      <div style={{ columnCount: 2, columnGap: "40px" }}>
        {words.map((entry, index) => (
          <div key={entry.word} style={{ textAlign: "left", marginBottom: "4px" }}>
            {index + 1}. {entry.word}
          </div>
        ))}
      </div>
    </div>

  )
}