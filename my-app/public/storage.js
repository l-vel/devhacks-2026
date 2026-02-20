
async function loadWordList() {
  const url = chrome.runtime.getURL("spanish.json");
  const res = await fetch(url);

  if (!res.ok) throw new Error(`Failed to load spanish.json.`);

 const wordList = await res.json();   

 
  storeWordList(wordList);

  return await wordList;
}

function storeWordList(data) {

  chrome.storage.local.set({ wordList: data }, function() {
    if (chrome.runtime.lastError) {
      console.error("Error loading JSON data", chrome.runtime.lastError);
    } else {
      console.log('JSON data loaded successfully');
    }

  });


  async function 
}

