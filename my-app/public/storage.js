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





