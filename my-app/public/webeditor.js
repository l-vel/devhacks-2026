import { loadWordList } from './storage.js'

const spanishWords = loadWordList();

function processTextNode(node)
{
    const parent = node.parentNode;

    if(
        !parent || parent.classList == "contains_spanish_words"
    )
    {
        return
    }

    const text = node.nodeValue;
    const parts = text.split();

    parts.forEach(part => {
        let cleanPart = part.trim();
        if(spanishWords.get("clean"))
        {
            
        }
    });
}

function adjustDocument(){
    const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    
    const nodes = [];
    let node;

    nodes.forEach(processTextNode)

}