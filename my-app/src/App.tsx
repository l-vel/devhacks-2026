import "./App.css";
import { useState, useEffect } from "react";

declare global {
  interface Window {
    chrome: any;
  }
}

function App() {
  const [knownWords, setKnownWords] = useState(0);
  const [seenWords, setSeenWords] = useState(0);

  useEffect(() => {
    // Function to fetch counts from background/service worker
    function fetchWordCounts() {
      if (!window.chrome?.runtime?.sendMessage) return;

      // Request known words
      window.chrome.runtime.sendMessage(
        { action: "REQUEST_KNOWN_LIST" },
        (knownList: string[]) => {
          setKnownWords(Array.isArray(knownList) ? knownList.length : 0);
        },
      );

      // Request seen words
      window.chrome.runtime.sendMessage(
        { action: "REQUEST_SEEN_LIST" },
        (seenList: string[]) => {
          setSeenWords(Array.isArray(seenList) ? seenList.length : 0);
        },
      );
    }

    fetchWordCounts();

    const handleStorageChange = (
      changes: Record<string, any>,
      areaName: string,
    ) => {
      if (areaName === "local") {
        if (changes.wordsKnown || changes.wordsSeen) {
          fetchWordCounts();
        }
      }
    };

    window.chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      window.chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return (
    <div>
      <header style={{ fontSize: "150%" }}>Spanish To Ingles~</header>
      <div style={{ display: "flex" }}>
        <div style={{ margin: "8px" }}>
          <div style={{ padding: "3px", fontSize: "300%" }}>{knownWords}</div>
          <div>Known words</div>
        </div>
        <div style={{ margin: "8px" }}>
          <div style={{ padding: "3px", fontSize: "300%" }}>{seenWords}</div>
          <div>Seen words</div>
        </div>
      </div>
    </div>
  );
}

export default App;
