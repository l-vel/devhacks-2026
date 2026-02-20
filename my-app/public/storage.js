
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

export async function toggleKnownWord(word) {
    const knownWords = await getKnownMap();

    const key = cleanWord(word);
    const isNew = !isKnownWord(key);

    if (isNew) {
        knownWords[key] = true;
    }
    else {
         delete knownWords[key];
    }  
}

export async function getKnownMap() {
    const res = await chrome.storage.local.get("knownWords");
    return res["knownWords"] || {};
}


export async function isKnownWord(word) {
    const knownWords = await getKnownMap();

    return !!knownWords[cleanWord(word)];

}


function cleanWord(word) {
  return word.toLowerCase().trim();
}







