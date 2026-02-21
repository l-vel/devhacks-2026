var rawData = [];

async function loadData() {
  try {
    const res = await fetch(chrome.runtime.getURL('spanish.json'));
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


function processTextNode(node)
{
    const parent = node.parentNode;

    if(
        !parent || parent.classList?.contains == "spanish-word" ||
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

    parts.forEach(part => {
        let cleanPart = cleanWord(part);
        if(mapSpanishWords.get(cleanPart))
        {
            found = true;

            const span = document.createElement("span");
            span.textContent = cleanPart + " ";
            span.className = "spanish-word";
            fragment.appendChild(span);
            // console.log("found: " +  cleanPart)
        }
        else
        {
            fragment.appendChild(document.createTextNode(part + " "))
        }
    });

    if(found)
    {
        parent.replaceChild(fragment, node)
    }
}

async function adjustDocument(){
    await loadData();

    const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;

    while ((node = treeWalker.nextNode())) {
        nodes.push(node);
    }


    nodes.forEach(processTextNode)

}

addStyles()
adjustDocument()