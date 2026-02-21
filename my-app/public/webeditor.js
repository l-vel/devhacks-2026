var rawData = [];

async function loadData() {
  try {
    const res = await fetch(chrome.runtime.getURL("spanish.json"));
    rawData = await res.json();

    // for (const wordObj of rawData) {
    //   console.log(wordObj.word, "->", wordObj.english_translation);
    // }
  } catch (err) {
    console.error(err);
  }
}

function cleanWord(word) {
  return word.toLowerCase().trim();
}

function loadWordList() {
  const map = new Map();
  for (const entry of rawData) {
    //console.log(entry.word);
    map.set(entry.word, entry);
  }
  return map;
}

// mapSpanishWords.set("historia", "test");
// mapSpanishWords.set("programa", "test");

function addStyles() {
  if (document.getElementById("spanish-style")) return;

  const style = document.createElement("style");
  style.id = "spanish-style";
  style.textContent = `
    .spanish-word {
      background-color: yellow;
      color: red;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);
}

function processTextNode(node) {
  const parent = node.parentNode;

  if (
    !parent ||
    parent.classList?.contains == "spanish-word" ||
    parent.tagName === "SCRIPT" ||
    parent.tagName === "STYLE" ||
    parent.tagName === "NOSCRIPT"
  ) {
    return;
  }

  const mapSpanishWords = loadWordList();
  const text = node.nodeValue;
  const parts = text.split(" ");

  let found = false;
  const fragment = document.createDocumentFragment();

  parts.forEach((part) => {
    const cleanPart = cleanWord(part);
    if (mapSpanishWords.get(cleanPart)) {
      found = true;

      const span = document.createElement("span");
      span.textContent = cleanPart;
      span.className = "spanish-word";

      // Add click handler
      span.addEventListener("click", () => showWordDetails(cleanPart));

      fragment.appendChild(span);
      fragment.appendChild(document.createTextNode(" "));
    } else {
      fragment.appendChild(document.createTextNode(part + " "));
    }
  });

  if (found) {
    parent.replaceChild(fragment, node);
  }
}

async function adjustDocument() {
  await loadData();

  const treeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
  );
  const nodes = [];
  let node;

  while ((node = treeWalker.nextNode())) {
    nodes.push(node);
  }

  nodes.forEach(processTextNode);
}

addStyles();
adjustDocument();

function showWordDetails(word) {

  // remove old modal if exists
  const existing = document.getElementById("word-details-root");
  if (existing) existing.remove();

  const wordData = rawData.find((w) => w.word === word);
  const translation = wordData?.english_translation || "Not found";
  const spanishPhrase = wordData?.example_sentence_native || "Not found";
  const englishPhrase = wordData?.example_sentence_english || "Not found";

  const container = document.createElement("div");
  container.id = "word-details-root";
  Object.assign(container.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "9999",
  });
  document.body.appendChild(container);

  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: "white",
    padding: "1rem",
    borderRadius: "1rem",
    minWidth: "300px",
    maxWidth: "90%",
    textAlign: "left",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  });

  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";

  const title = document.createElement("p");
  title.style.color = "green";
  title.style.fontSize = "1.5rem";
  title.style.margin = "0";
  title.textContent = word;

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "XZZ";
  closeBtn.onclick = () => container.remove();

  header.appendChild(title);
  header.appendChild(closeBtn);
  modal.appendChild(header);

  const options = ["Unknown", "Seen", "Known"];
  let status = "Unknown";
  const radios = document.createElement("div");
  radios.style.display = "flex";
  radios.style.gap = "10px";
  radios.style.marginTop = "0.5rem";

  options.forEach((opt) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "status";
    input.value = opt;
    input.checked = opt === status;
    input.onchange = () => {
      status = opt;
      selectedText.textContent = "Selected: " + status;
    };
    label.appendChild(input);
    label.appendChild(document.createTextNode(opt));
    radios.appendChild(label);
  });
  modal.appendChild(radios);

  const selectedText = document.createElement("p");
  selectedText.style.marginTop = "0.5rem";
  selectedText.textContent = "Selected: " + status;
  modal.appendChild(selectedText);

  const translationP = document.createElement("p");
  translationP.textContent = "Translation: " + translation;
  modal.appendChild(translationP);

  const spanishEx = document.createElement("p");
  spanishEx.textContent = "Ex (Spanish): " + spanishPhrase;
  spanishEx.style.background = "grey";
  spanishEx.style.borderRadius = "0.2rem";
  spanishEx.style.padding = "0.2rem";
  spanishEx.style.margin = "0.2rem 0";
  modal.appendChild(spanishEx);

  const englishEx = document.createElement("p");
  englishEx.textContent = "Ex (English): " + englishPhrase;
  englishEx.style.background = "grey";
  englishEx.style.borderRadius = "0.2rem";
  englishEx.style.padding = "0.2rem";
  englishEx.style.margin = "0.2rem 0";
  englishEx.style.fontSize = "0.8rem";
  modal.appendChild(englishEx);

  container.appendChild(modal);
}
