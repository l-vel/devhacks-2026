import { useState, useEffect } from "react";
import { loadTopWords } from './storage.js';
import { Row } from "react-bootstrap";

export default function FrequencyList() {
  const [words, setWords] = useState<Word[]>([]);

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

  useEffect(() => {
    async function loadWords() {
      const topWords = await loadTopWords(500);
      setWords(topWords);

    }

    loadWords();
  }, []);


  return (

    <div className="container">
      <h1 className="mt-3 pb-4 text-center">
        Top 500 Frequent Spanish Words
      </h1>

      <Row className="mb-5">
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <div style={{ maxWidth: "1500px", columnCount: 2 }}>
            {words.map((entry, index) => (
              <div key={entry.word} style={{ textAlign: "left", marginBottom: "4px", breakInside: "avoid" }}>
                {index + 1}. {entry.word}
              </div>
            ))}
          </div>
        </div>
      </Row>
    </div>

  )
}