
export async function loadWordList() {
    const url = chrome.runtime.getURL("spanish.json");
    const res = await fetch(url);

    if (!res.ok) throw new Error(`Failed to load spanish.json.`);


    const wordList = await res.json();


    const map = new Map();
    for (const entry of wordList) {
        map.set(entry.word, entry);
    }
    return map;

}

const EXTENSION_ID = "jffdejamddiemlnpimihgjnmdncajajo";

async function handleRequestSeenList() {
  const raw = await chrome.storage.local.get(["wordsSeen"]);
  const seenStr = raw.wordsSeen; 

  const seenArr = seenStr ? JSON.parse(seenStr) : []; 
  return Array.isArray(seenArr) ? seenArr : [];
}


export async function loadTopWords(limit) {
    const res = await fetch("/spanish.json");

    if (!res.ok) throw new Error(`Failed to load spanish.json.`);


    const wordList = await res.json();

    return wordList.slice(0, limit);

}

async function loadAllWords() {
    const res = await fetch("/spanish.json");

    if (!res.ok) throw new Error(`Failed to load spanish.json.`);


    const wordList = await res.json();

    return wordList;

}

//returns an array with number of beginner words, 
// intermediate words and advanced words
export async function getNumWordsPerLevel() {
    const numbersPerLevel = [0, 0, 0];

    const wordList = await loadAllWords();

    for (const word of wordList) {
        if (word.cefr_level.includes("A")) {
            numbersPerLevel[0]++;
        }
        else if (word.cefr_level.includes("B")) {
            numbersPerLevel[1]++;
        }
        else if (word.cefr_level.includes("C")) {
            numbersPerLevel[2]++;
        }
    }
    console.log(numbersPerLevel);

    return numbersPerLevel;
}


//KNOWN WORD FUNCTIONS
export async function getKnownMap() {
    const res = await chrome.storage.local.get("knownWords");
    return res["knownWords"] || {};
}

export async function isKnownWord(word) {
    const knownWords = await getKnownMap();

    return !!knownWords[cleanWord(word)];

}

export async function toggleKnownWord(word) {
    const knownWords = await getKnownMap();

    const key = cleanWord(word);
    const isNew = !isKnownWord(key);

    console.log("new word %s\n", word)
    if (isNew) {
        knownWords[key] = true;
    }
    else {
        delete knownWords[key];
    }
}

export async function numKnownWords() {
    const knownWords = await getKnownMap();

    return knownWords.size();

}

export async function getSeenMap() {
    const res = await chrome.storage.local.get("seenWords");
    return res["seenWords"] || {};
}


//SEEN WORD FUNCTIONS
export async function isSeenWord(word) {
    const seenWords = await getSeenMap();

    return !!seenWords[cleanWord(word)];

}

export async function toggleSeenWord(word) {
    const seenWords = await getSeenMap();

    const key = cleanWord(word);
    const isNew = !isSeenWord(key);

    if (isNew) {
        seenWords[key] = true;
    }
    else {
        delete seenWords[key];
    }
}

export async function numSeenWords() {
    const seenWords = await getSeenMap();

    return seenWords.size();

}

export async function isUnknownWord(word) {

    return !isKnownWord() && !isSeenWord();
}


export function cleanWord(word) {
    return word.toLowerCase().trim();
}


