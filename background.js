var backgroundSeq = new Array(98);
for (var i = 1; i < 91; i++) {
    backgroundSeq[i] = 0;
}
//backgroundSeq[24] = 1;
//backgroundSeq[33] = 1;
//backgroundSeq[55] = 1;
//backgroundSeq[90] = 1;


function handleMessage(request, sender, sendResponse) {
    //console.log("Message from the content script: " +  request.greeting);
    if (request.msg == 69) {
        sendResponse({ response: backgroundSeq })
    }
    else {
        backgroundSeq = request.msg;
        sendResponse({ response: 96 })
    }
}

browser.runtime.onMessage.addListener(handleMessage);