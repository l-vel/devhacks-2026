//import './storage.js'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("hi")
    if (request.action === "UPDATE_WORD_STATUS") {
    handleWordUpdate(request.word, request.status);
    }

    if (request.action === "VIEWED_WORD") {
        incrementWordsViewedToday();
    }
    return true;
});

async function handleWordUpdate(word, status) {
    console.log("hi1")
    try
    {
        if(status === "seen")
        {
            const data = await chrome.storage.local.get(["wordsSeen"]);
            const cache = JSON.parse(data.wordsSeen) || [];
            if(cache.includes(word)) return true;
            cache.push(word);
            try{
                await chrome.storage.local.set({ wordsSeen: JSON.stringify(cache) });

                //remove from known

                const knownData = await chrome.storage.local.get(["wordsKnown"]);
                const knownCache = JSON.parse(knownData.wordsKnown) || [];
                console.log(knownCache)
                const knownIndex = knownCache.wordsKnown.indexOf(word)
                if(knownIndex >= 0)
                {
                    knownCache.wordsKnown.splice(knownIndex, 1)
                }

                await chrome.storage.local.set({wordsKnown : JSON.stringify(knownCache)})
            }
            catch(errIn) {
                console.log(errIn)
            }
        }
        else if(status === "known")
        {
            const data = await chrome.storage.local.get(["wordsKnown"]);
            const cache = JSON.parse(data.wordsKnown) || [];
            if(cache.includes(word)) return true;
            cache.push(word);
            try{
                await chrome.storage.local.set({ wordsKnown: JSON.stringify(cache) });

                //remove from seen 

                const seenData = await chrome.storage.local.get(["wordsSeen"]);
                const seenCache = JSON.parse(seenData.wordsSeen) || [];
                const seenIndex = seenCache.wordsSeen.indexOf(word)
                if(seenIndex >= 0)
                {
                    seenCache.wordsKnown.splice(seenIndex, 1)
                }
                await chrome.storage.local.set({wordsKnown : JSON.stringify(seenCache)})
            }
            catch(errIn) {
                console.log(errIn)
            }
        }
        else // unknown
        {
            // just remove from seen and known lists

            try{
                await chrome.storage.local.set({ wordsKnown: cache });

                //remove from seen 

                const seenData = await chrome.storage.local.get(["wordsSeen"]);
                const seenCache = JSON.parse(seenData.wordsSeen) || [];
                const seenIndex = seenCache.wordsSeen.indexOf(word)
                if(seenIndex >= 0)
                {
                    seenCache.wordsKnown.splice(seenIndex, 1)
                }
                await chrome.storage.local.set({wordsKnown : JSON.stringify(seenCache)})

                //remove from known

                const knownData = await chrome.storage.local.get(["wordsKnown"]);
                const knownCache = JSON.parse(knownData.wordsKnown) || [];
                console.log(knownCache)
                const knownIndex = knownCache.wordsKnown.indexOf(word)
                if(knownIndex >= 0)
                {
                    knownCache.wordsKnown.splice(knownIndex, 1)
                }

                await chrome.storage.local.set({wordsKnown : JSON.stringify(knownCache)})
            }
            catch(errIn) {
                console.log(errIn)
            }
        }
    }
    catch(errOut)
    {
        console.log(errOut)
    }
}

async function incrementWordsViewedToday() 
{
    const date = new Date().toISOString().split("T")[0]

    const data = await chrome.storage.local.get(["wordsDayTracker"]);
    const cache = data.wordsDayTracker || {};
    cache[date] = cache[date] + 1 || 1;
    await chrome.storage.local.set({wordsDayTracker: cache}); 
}

