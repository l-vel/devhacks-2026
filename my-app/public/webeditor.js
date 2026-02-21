import { cleanWord, loadWordList } from './storage.js'

const spanishWords = loadWordList();

function addStyles() {
  if (document.getElementById("spanish-style")) return;

  const style = document.createElement("style");
  style.id = "spanish-style";
  style.textContent = `
    .spanish-highlight {
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
        !parent || parent.classList?.contains == "spanish-word"
    )
    {
        return
    }

    const text = node.nodeValue;
    const parts = text.split();

    let found = false;
    const fragment = document.createDocumentFragment();

    parts.forEach(part => {
        let cleanPart = cleanWord(part);
        if(spanishWords.get(cleanPart))
        {
            found = true;

            const span = document.createElement("span");
            span.textContent = cleanWord;
            span.className = "spanish-word";
            fragment.appendChild(span);
            console.log("found: " +  cleanWord)
        }
        else
        {
            console.log("heh")
            fragment.appendChild(document.createTextNode(part))
        }
    });

    if(found)
    {
        parent.replaceChild(fragment, node)
    }
}

function adjustDocument(){
    const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    
    const nodes = [];
    let node;

    nodes.forEach(processTextNode)

}

addStyles()
adjustDocument()