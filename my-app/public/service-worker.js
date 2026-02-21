//import './storage.js'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    (
        async () => {

            if (request.action === "UPDATE_WORD_STATUS") {
                await handleWordUpdate(request.word, request.status);
            }

            else if (request.action === "VIEWED_WORD") {
                await incrementWordsViewedToday();
            }

            else if (request.action === "REQUEST_SEEN_LIST") {
                const data = await handleRequestSeenList()
                console.log(data)
                sendResponse(data)
            }

            else if (request.action === "REQUEST_KNOWN_LIST") {
                const data = await handleRequestKnownList();
                sendResponse(data);
            }

            else if (request.action === "REQUEST_ACTIVITY_LIST") {
                const data = await handleRequestActivityList();
                sendResponse(data);
            }

            else if (request.action === "REQUEST_SET_SEED_DATA") {
                await createSetSeededData();
            }

            else if (request.action === "REQUEST_WORD_STATUS") {
                const wordStatus = await handleRequestWordStatus(request.word);
                console.log(wordStatus)
                sendResponse(wordStatus)
            }

        })();
    return true;
});

async function handleWordUpdate(word, status) {
    try {
        if (status === "seen") {
            const data = await chrome.storage.local.get(["wordsSeen"]);
            const cache = data.wordsSeen ? JSON.parse(data.wordsSeen) : [];
            if (cache.includes(word)) return true;
            cache.push(word);
            try {
                await chrome.storage.local.set({ wordsSeen: (cache) });

                //remove from known

                const knownData = await chrome.storage.local.get(["wordsKnown"]);
                const knownCache = knownData.wordsKnown ? JSON.parse(knownData.wordsKnown) : [];
                if (knownCache.length > 0) {
                    const knownIndex = knownCache.wordsKnown.indexOf(word)
                    if (knownIndex >= 0) {
                        knownCache.wordsKnown.splice(knownIndex, 1)
                    }

                    await chrome.storage.local.set({ wordsKnown: (knownCache) })
                }
            }
            catch (errIn) {
                console.log(errIn)
            }
        }
        else if (status === "known") {
            const data = await chrome.storage.local.get(["wordsKnown"]);
            const cache = data.wordsKnown ? JSON.parse(data.wordsKnown) : [];
            if (cache.includes(word)) return true;
            cache.push(word);
            try {
                await chrome.storage.local.set({ wordsKnown: (cache) });

                //remove from seen 

                const seenData = await chrome.storage.local.get(["wordsSeen"]);
                const seenCache = seenData.wordsSeen ? JSON.parse(seenData.wordsSeen) : [];
                if (seenCache.length > 0) {
                    const seenIndex = seenCache.wordsSeen.indexOf(word)
                    if (seenIndex >= 0) {
                        seenCache.wordsKnown.splice(seenIndex, 1)
                    }
                    await chrome.storage.local.set({ wordsKnown: (seenCache) })
                }
            }
            catch (errIn) {
                console.log(errIn)
            }
        }
        else // unknown
        {
            // just remove from seen and known lists

            try {
                await chrome.storage.local.set({ wordsKnown: cache });

                //remove from seen 

                const seenData = await chrome.storage.local.get(["wordsSeen"]);
                const seenCache = seenData.wordsSeen ? JSON.parse(seenData.wordsSeen) : [];
                const seenIndex = seenCache.wordsSeen.indexOf(word)
                if (seenIndex >= 0) {
                    seenCache.wordsKnown.splice(seenIndex, 1);
                }
                await chrome.storage.local.set({ wordsKnown: (seenCache) });

                //remove from known

                const knownData = await chrome.storage.local.get(["wordsKnown"]);
                const knownCache = knownData.wordsKnown ? JSON.parse(knownData.wordsKnown) : [];
                const knownIndex = knownCache.wordsKnown.indexOf(word)
                if (knownIndex >= 0) {
                    knownCache.wordsKnown.splice(seenIndex, 1);
                }
                await chrome.storage.local.set({ wordsKnown: (knownCache) });
                }
            catch (errIn) {
                console.log(errIn)
            }
        }
    }
    catch (errOut) {
        console.log(errOut)
    }
}

async function handleRequestWordStatus(word) {
    const known = await handleRequestKnownList();
    const seen = await handleRequestSeenList();


    const checkKnown = known.includes(word);
    const checkSeen = seen.includes(word);

    const returnString = checkKnown ? "Known" : checkSeen ? "Seen" : "Unknown";
    console.log(returnString)
    return returnString;
}

async function incrementWordsViewedToday() {
    const date = new Date().toISOString().split("T")[0]

    const data = await chrome.storage.local.get(["wordsDayTracker"]);
    let cache = data.wordsDayTracker;
    if (typeof cache === 'string') {
        cache = JSON.parse(cache);
    } else if (!cache) {
        cache = {};
    }
    console.log(cache)
    cache[date] = (cache[date] || 0) + 1;
    await chrome.storage.local.set({ wordsDayTracker: cache});
}

async function handleRequestActivityList() {
    const rawData = await chrome.storage.local.get(["wordsDayTracker"]);
    const activty = rawData.wordsDayTracker || {}

    return activty;
}

async function handleRequestSeenList() {
    const rawData = await chrome.storage.local.get(["wordsSeen"]);
    console.log(rawData);
    const seen = rawData.wordsSeen || []
    return seen;
}

async function handleRequestKnownList() {
    const rawData = await chrome.storage.local.get(["wordsKnown"]);
    const known = rawData.wordsKnown || []

    return known
}

async function createSetSeededData() {

    const rawCheck = await chrome.storage.local.get(["seedStored"]);
    const check = rawCheck.seedStored || false;
    if (!check) {
        const seededData = {}

        seededData['2025-02-21'] = 2
        seededData["2025-02-22"] = 4
        seededData["2025-02-23"] = 1
        seededData["2025-02-24"] = 3
        seededData["2025-02-25"] = 0
        seededData["2025-02-26"] = 2
        seededData["2025-02-27"] = 1
        seededData["2025-02-28"] = 4
        seededData["2025-03-01"] = 3
        seededData["2025-03-02"] = 0
        seededData["2025-03-03"] = 2
        seededData["2025-03-04"] = 1
        seededData["2025-03-05"] = 4
        seededData["2025-03-06"] = 3
        seededData["2025-03-07"] = 2
        seededData["2025-03-08"] = 0
        seededData["2025-03-09"] = 1
        seededData["2025-03-10"] = 4
        seededData["2025-03-11"] = 3
        seededData["2025-03-12"] = 2
        seededData["2025-03-13"] = 1
        seededData["2025-03-14"] = 0
        seededData["2025-03-15"] = 4
        seededData["2025-03-16"] = 3
        seededData["2025-03-17"] = 2
        seededData["2025-03-18"] = 1
        seededData["2025-03-19"] = 0
        seededData["2025-03-20"] = 4
        seededData["2025-03-21"] = 3
        seededData["2025-03-22"] = 2
        seededData["2025-03-23"] = 1
        seededData["2025-03-24"] = 0
        seededData["2025-03-25"] = 4
        seededData["2025-03-26"] = 3
        seededData["2025-03-27"] = 2
        seededData["2025-03-28"] = 1
        seededData["2025-03-29"] = 0
        seededData["2025-03-30"] = 4
        seededData["2025-03-31"] = 3
        seededData["2025-04-01"] = 2
        seededData["2025-04-02"] = 1
        seededData["2025-04-03"] = 0
        seededData["2025-04-04"] = 4
        seededData["2025-04-05"] = 3
        seededData["2025-04-06"] = 2
        seededData["2025-04-07"] = 1
        seededData["2025-04-08"] = 0
        seededData["2025-04-09"] = 4
        seededData["2025-04-10"] = 3
        seededData["2025-04-11"] = 2
        seededData["2025-04-12"] = 1
        seededData["2025-04-13"] = 0
        seededData["2025-04-14"] = 4
        seededData["2025-04-15"] = 3
        seededData["2025-04-16"] = 2
        seededData["2025-04-17"] = 1
        seededData["2025-04-18"] = 0
        seededData["2025-04-19"] = 4
        seededData["2025-04-20"] = 3
        seededData["2025-04-21"] = 2
        seededData["2025-04-22"] = 1
        seededData["2025-04-23"] = 0
        seededData["2025-04-24"] = 4
        seededData["2025-04-25"] = 3
        seededData["2025-04-26"] = 2
        seededData["2025-04-27"] = 1
        seededData["2025-04-28"] = 0
        seededData["2025-04-29"] = 4
        seededData["2025-04-30"] = 3
        seededData["2025-05-01"] = 2
        seededData["2025-05-02"] = 1
        seededData["2025-05-03"] = 0
        seededData["2025-05-04"] = 4
        seededData["2025-05-05"] = 3
        seededData["2025-05-06"] = 2
        seededData["2025-05-07"] = 1
        seededData["2025-05-08"] = 0
        seededData["2025-05-09"] = 4
        seededData["2025-05-10"] = 3
        seededData["2025-05-11"] = 2
        seededData["2025-05-12"] = 1
        seededData["2025-05-13"] = 0
        seededData["2025-05-14"] = 4
        seededData["2025-05-15"] = 3
        seededData["2025-05-16"] = 2
        seededData["2025-05-17"] = 1
        seededData["2025-05-18"] = 0
        seededData["2025-05-19"] = 4
        seededData["2025-05-20"] = 3
        seededData["2025-05-21"] = 2
        seededData["2025-05-22"] = 1
        seededData["2025-05-23"] = 0
        seededData["2025-05-24"] = 4
        seededData["2025-05-25"] = 3
        seededData["2025-05-26"] = 2
        seededData["2025-05-27"] = 1
        seededData["2025-05-28"] = 0
        seededData["2025-05-29"] = 4
        seededData["2025-05-30"] = 3
        seededData["2025-05-31"] = 2
        seededData["2025-06-01"] = 1
        seededData["2025-06-02"] = 0
        seededData["2025-06-03"] = 4
        seededData["2025-06-04"] = 3
        seededData["2025-06-05"] = 2
        seededData["2025-06-06"] = 1
        seededData["2025-06-07"] = 0
        seededData["2025-06-08"] = 4
        seededData["2025-06-09"] = 3
        seededData["2025-06-10"] = 2
        seededData["2025-06-11"] = 1
        seededData["2025-06-12"] = 0
        seededData["2025-06-13"] = 4
        seededData["2025-06-14"] = 3
        seededData["2025-06-15"] = 2
        seededData["2025-06-16"] = 1
        seededData["2025-06-17"] = 0
        seededData["2025-06-18"] = 4
        seededData["2025-06-19"] = 3
        seededData["2025-06-20"] = 2
        seededData["2025-06-21"] = 1
        seededData["2025-06-22"] = 0
        seededData["2025-06-23"] = 4
        seededData["2025-06-24"] = 3
        seededData["2025-06-25"] = 2
        seededData["2025-06-26"] = 1
        seededData["2025-06-27"] = 0
        seededData["2025-06-28"] = 4
        seededData["2025-06-29"] = 3
        seededData["2025-06-30"] = 2
        seededData["2025-07-01"] = 1
        seededData["2025-07-02"] = 0
        seededData["2025-07-03"] = 4
        seededData["2025-07-04"] = 3
        seededData["2025-07-05"] = 2
        seededData["2025-07-06"] = 1
        seededData["2025-07-07"] = 0
        seededData["2025-07-08"] = 4
        seededData["2025-07-09"] = 3
        seededData["2025-07-10"] = 2
        seededData["2025-07-11"] = 1
        seededData["2025-07-12"] = 0
        seededData["2025-07-13"] = 4
        seededData["2025-07-14"] = 3
        seededData["2025-07-15"] = 2
        seededData["2025-07-16"] = 1
        seededData["2025-07-17"] = 0
        seededData["2025-07-18"] = 4
        seededData["2025-07-19"] = 3
        seededData["2025-07-20"] = 2
        seededData["2025-07-21"] = 1
        seededData["2025-07-22"] = 0
        seededData["2025-07-23"] = 4
        seededData["2025-07-24"] = 3
        seededData["2025-07-25"] = 2
        seededData["2025-07-26"] = 1
        seededData["2025-07-27"] = 0
        seededData["2025-07-28"] = 4
        seededData["2025-07-29"] = 3
        seededData["2025-07-30"] = 2
        seededData["2025-07-31"] = 1
        seededData["2025-08-01"] = 0
        seededData["2025-08-02"] = 4
        seededData["2025-08-03"] = 3
        seededData["2025-08-04"] = 2
        seededData["2025-08-05"] = 1
        seededData["2025-08-06"] = 0
        seededData["2025-08-07"] = 4
        seededData["2025-08-08"] = 3
        seededData["2025-08-09"] = 2
        seededData["2025-08-10"] = 1
        seededData["2025-08-11"] = 0
        seededData["2025-08-12"] = 4
        seededData["2025-08-13"] = 3
        seededData["2025-08-14"] = 2
        seededData["2025-08-15"] = 1
        seededData["2025-08-16"] = 0
        seededData["2025-08-17"] = 4
        seededData["2025-08-18"] = 3
        seededData["2025-08-19"] = 2
        seededData["2025-08-20"] = 1
        seededData["2025-08-21"] = 0
        seededData["2025-08-22"] = 4
        seededData["2025-08-23"] = 3
        seededData["2025-08-24"] = 2
        seededData["2025-08-25"] = 1
        seededData["2025-08-26"] = 0
        seededData["2025-08-27"] = 4
        seededData["2025-08-28"] = 3
        seededData["2025-08-29"] = 2
        seededData["2025-08-30"] = 1
        seededData["2025-08-31"] = 0
        seededData["2025-09-01"] = 4
        seededData["2025-09-02"] = 3
        seededData["2025-09-03"] = 2
        seededData["2025-09-04"] = 1
        seededData["2025-09-05"] = 0
        seededData["2025-09-06"] = 4
        seededData["2025-09-07"] = 3
        seededData["2025-09-08"] = 2
        seededData["2025-09-09"] = 1
        seededData["2025-09-10"] = 0
        seededData["2025-09-11"] = 4
        seededData["2025-09-12"] = 3
        seededData["2025-09-13"] = 2
        seededData["2025-09-14"] = 1
        seededData["2025-09-15"] = 0
        seededData["2025-09-16"] = 4
        seededData["2025-09-17"] = 3
        seededData["2025-09-18"] = 2
        seededData["2025-09-19"] = 1
        seededData["2025-09-20"] = 0
        seededData["2025-09-21"] = 4
        seededData["2025-09-22"] = 3
        seededData["2025-09-23"] = 2
        seededData["2025-09-24"] = 1
        seededData["2025-09-25"] = 0
        seededData["2025-09-26"] = 4
        seededData["2025-09-27"] = 3
        seededData["2025-09-28"] = 2
        seededData["2025-09-29"] = 1
        seededData["2025-09-30"] = 0
        seededData["2025-10-01"] = 4
        seededData["2025-10-02"] = 3
        seededData["2025-10-03"] = 2
        seededData["2025-10-04"] = 1
        seededData["2025-10-05"] = 0
        seededData["2025-10-06"] = 4
        seededData["2025-10-07"] = 3
        seededData["2025-10-08"] = 2
        seededData["2025-10-09"] = 1
        seededData["2025-10-10"] = 0
        seededData["2025-10-11"] = 4
        seededData["2025-10-12"] = 3
        seededData["2025-10-13"] = 2
        seededData["2025-10-14"] = 1
        seededData["2025-10-15"] = 0
        seededData["2025-10-16"] = 4
        seededData["2025-10-17"] = 3
        seededData["2025-10-18"] = 2
        seededData["2025-10-19"] = 1
        seededData["2025-10-20"] = 0
        seededData["2025-10-21"] = 4
        seededData["2025-10-22"] = 3
        seededData["2025-10-23"] = 2
        seededData["2025-10-24"] = 1
        seededData["2025-10-25"] = 0
        seededData["2025-10-26"] = 4
        seededData["2025-10-27"] = 3
        seededData["2025-10-28"] = 2
        seededData["2025-10-29"] = 1
        seededData["2025-10-30"] = 0
        seededData["2025-10-31"] = 4
        seededData["2025-11-01"] = 3
        seededData["2025-11-02"] = 2
        seededData["2025-11-03"] = 1
        seededData["2025-11-04"] = 0
        seededData["2025-11-05"] = 4
        seededData["2025-11-06"] = 3
        seededData["2025-11-07"] = 2
        seededData["2025-11-08"] = 1
        seededData["2025-11-09"] = 0
        seededData["2025-11-10"] = 4
        seededData["2025-11-11"] = 3
        seededData["2025-11-12"] = 2
        seededData["2025-11-13"] = 1
        seededData["2025-11-14"] = 0
        seededData["2025-11-15"] = 4
        seededData["2025-11-16"] = 3
        seededData["2025-11-17"] = 2
        seededData["2025-11-18"] = 1
        seededData["2025-11-19"] = 0
        seededData["2025-11-20"] = 4
        seededData["2025-11-21"] = 3
        seededData["2025-11-22"] = 2
        seededData["2025-11-23"] = 1
        seededData["2025-11-24"] = 0
        seededData["2025-11-25"] = 4
        seededData["2025-11-26"] = 3
        seededData["2025-11-27"] = 2
        seededData["2025-11-28"] = 1
        seededData["2025-11-29"] = 0
        seededData["2025-11-30"] = 4
        seededData["2025-12-01"] = 3
        seededData["2025-12-02"] = 2
        seededData["2025-12-03"] = 1
        seededData["2025-12-04"] = 0
        seededData["2025-12-05"] = 4
        seededData["2025-12-06"] = 3
        seededData["2025-12-07"] = 2
        seededData["2025-12-08"] = 1
        seededData["2025-12-09"] = 0
        seededData["2025-12-10"] = 4
        seededData["2025-12-11"] = 3
        seededData["2025-12-12"] = 2
        seededData["2025-12-13"] = 1
        seededData["2025-12-14"] = 0
        seededData["2025-12-15"] = 4
        seededData["2025-12-16"] = 3
        seededData["2025-12-17"] = 2
        seededData["2025-12-18"] = 1
        seededData["2025-12-19"] = 0
        seededData["2025-12-20"] = 4
        seededData["2025-12-21"] = 3
        seededData["2025-12-22"] = 2
        seededData["2025-12-23"] = 1
        seededData["2025-12-24"] = 0
        seededData["2025-12-25"] = 4
        seededData["2025-12-26"] = 3
        seededData["2025-12-27"] = 2
        seededData["2025-12-28"] = 1
        seededData["2025-12-29"] = 0
        seededData["2025-12-30"] = 4
        seededData["2025-12-31"] = 3
        seededData["2026-01-01"] = 2
        seededData["2026-01-02"] = 1
        seededData["2026-01-03"] = 0
        seededData["2026-01-04"] = 4
        seededData["2026-01-05"] = 3
        seededData["2026-01-06"] = 2
        seededData["2026-01-07"] = 1
        seededData["2026-01-08"] = 0
        seededData["2026-01-09"] = 4
        seededData["2026-01-10"] = 3
        seededData["2026-01-11"] = 2
        seededData["2026-01-12"] = 1
        seededData["2026-01-13"] = 0
        seededData["2026-01-14"] = 4
        seededData["2026-01-15"] = 3
        seededData["2026-01-16"] = 2
        seededData["2026-01-17"] = 1
        seededData["2026-01-18"] = 0
        seededData["2026-01-19"] = 4
        seededData["2026-01-20"] = 3
        seededData["2026-01-21"] = 2
        seededData["2026-01-22"] = 1
        seededData["2026-01-23"] = 0
        seededData["2026-01-24"] = 4
        seededData["2026-01-25"] = 3
        seededData["2026-01-26"] = 2
        seededData["2026-01-27"] = 1
        seededData["2026-01-28"] = 0
        seededData["2026-01-29"] = 4
        seededData["2026-01-30"] = 3
        seededData["2026-01-31"] = 2
        seededData["2026-02-01"] = 1
        seededData["2026-02-02"] = 0
        seededData["2026-02-03"] = 4
        seededData["2026-02-04"] = 3
        seededData["2026-02-05"] = 2
        seededData["2026-02-06"] = 1
        seededData["2026-02-07"] = 0
        seededData["2026-02-08"] = 4
        seededData["2026-02-09"] = 3
        seededData["2026-02-10"] = 2
        seededData["2026-02-11"] = 1
        seededData["2026-02-12"] = 0
        seededData["2026-02-13"] = 4
        seededData["2026-02-14"] = 3
        seededData["2026-02-15"] = 2
        seededData["2026-02-16"] = 1
        seededData["2026-02-17"] = 0
        seededData["2026-02-18"] = 4
        seededData["2026-02-19"] = 3
        seededData["2026-02-20"] = 2

        await chrome.storage.local.set({ wordsDayTracker: (seededData) });
        await chrome.storage.local.set({ seedStored: (true) })
    }
}