var tabSeq = new Array(98);
var refButObsDisable = 0;

//bingo_ticket selected
function markEverything(workMode) {
    var numbersCoincidences = 0;
    var ticketSelected = 0;
    if (workMode == 0) {
        var checkIfSeqEmpty = 1;
        for (var i = 1; i < 91; i++) {
            if (tabSeq[i] != 0) { checkIfSeqEmpty = 0; }
        }
        if (checkIfSeqEmpty == 1) { workMode = 2; }
    }
    var totalSelectedTickets = 0
    var x = document.getElementsByTagName("div");
    for (i = 0; i < x.length; i++) {
        if (x[i].classList.contains("bingo_ticket")) {
            if (x[i].classList.contains("selected")) {
                totalSelectedTickets++;
            }
        }
    }
    for (i = 0; i < x.length; i++) {
        if (x[i].classList.contains("bingo_ticket")) {
            if (x[i].classList.contains("selected")) {
                ticketSelected = 1;
            } else { ticketSelected = 0; }
            var childNode = x[i].children;
            for (j = 0; j < childNode.length; j++) {
                if (childNode[j].tagName == "TABLE") {
                    var childNode2 = childNode[j].children;
                    for (k = 0; k < childNode2.length; k++) {
                        if (childNode2[k].tagName == "TBODY") {
                            numbersCoincidences = 0;
                            var childNode3 = childNode2[k].children;
                            for (l = 0; l < childNode3.length; l++) {
                                if (childNode3[l].tagName == "TR" && childNode3[l].classList.contains("numbers")) {
                                    var childNode4 = childNode3[l].children;
                                    for (m = 0; m < childNode4.length; m++) {
                                        if (workMode != 1) {
                                            for (var n = 1; n < 91; n++) {
                                                if (parseInt((childNode4[m].innerHTML), 10) == n && tabSeq[n] == 1) {
                                                    numbersCoincidences++;
                                                    if (ticketSelected == 1) { childNode4[m].style.backgroundColor = "green"; }
                                                    else { childNode4[m].style.backgroundColor = "red"; }
                                                }
                                                else if ((parseInt((childNode4[m].innerHTML), 10) == n && tabSeq[n] != 1) || childNode4[m].innerHTML == "") {
                                                    childNode4[m].removeAttribute("style");
                                                }
                                            }
                                        }
                                        else if (ticketSelected == 1){
                                            if (childNode4[m].innerHTML != "") {
                                                tabSeq[parseInt((childNode4[m].innerHTML), 10)] = 1;
                                            }
                                            else {
                                                tabSeq[parseInt((childNode4[m].innerHTML), 10)] = 0;
                                            }
                                        }
                                    }
                                }
                            }
                            if (!(x[i].classList.contains("selected")) && numbersCoincidences <= tabSeq[94] && workMode == 0 && totalSelectedTickets < tabSeq[93] ) {
                                x[i].click();
                                totalSelectedTickets++;
                                for (l = 0; l < childNode3.length; l++) {
                                    if (childNode3[l].tagName == "TR" && childNode3[l].classList.contains("numbers")) {
                                        var childNode4 = childNode3[l].children;
                                        for (m = 0; m < childNode4.length; m++) {
                                            if (childNode4[m].innerHTML != "") {
                                                tabSeq[parseInt((childNode4[m].innerHTML), 10)] = 1;
                                            }
                                            else {
                                                tabSeq[parseInt((childNode4[m].innerHTML), 10)] = 0;
                                            }
                                            for (var n = 1; n < 91; n++) {
                                                if (parseInt((childNode4[m].innerHTML), 10) == n && tabSeq[n] == 1) {
                                                    childNode4[m].style.backgroundColor = "green";
                                                }
                                                else if ((parseInt((childNode4[m].innerHTML), 10) == n && tabSeq[n] != 1) || childNode4[m].innerHTML == "") {
                                                    childNode4[m].removeAttribute("style");
                                                }
                                            }
                                        }
                                    }
                                }
                                browser.runtime.sendMessage({ msg: tabSeq });
                            }
                        }
                    }
                }
            }
        }
    }
}

function markEverythingOld() {
    var x = document.getElementsByTagName("td");
    for (i = 0; i < x.length; i++) {
        for (var j = 1; j < 91; j++) {
            if (parseInt((x[i].innerHTML), 10) == j && tabSeq[j] == 1)   {
                x[i].style.backgroundColor = "red";
            }
            else if ((parseInt((x[i].innerHTML), 10) == j && tabSeq[j] != 1) || x[i].innerHTML == "" ) {
                x[i].removeAttribute("style");
            }
        }
    } 
}


// sleep time expects milliseconds
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

var refreshButtonObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.oldValue === 'refresh_btn') {

        } else {
            /*sleep(1000).then(() => {
                markEverything();
            });*/
            markEverything(0);
            if (refButObsDisable == 1) {
                //refButObsDisable = 0;
                refreshButtonObserver.disconnect();
                sleep(1000).then(() => {
                    markEverything(0);
                    tabSeq[97] = Date().toString();
                });
            } else {
                tabSeq[95]++;
                document.getElementsByClassName("refresh_btn")[0].click();
            }
        }
    });
});


function bridle(request, sender, sendResponse) {
    if (request.msg == 13) {
        for (var i = 1; i < 91; i++) {
            tabSeq[i] = 0;
        }
        markEverything(1);
        markEverything(0);
        browser.runtime.sendMessage({ msg: tabSeq });
        refButObsDisable = 1;
    }
    else if (request.msg == 69) {
        // for (var i = 1; i < 91; i++) {
        //     tabSeq[i] = 0;
        //}
        //markEverything();
        // Starts listening for changes in the '.search-trigger' HTML element
        if (refButObsDisable == 1) {
            refButObsDisable = 0;
            refreshButtonObserver.observe(document.querySelector('.refresh_btn'), {
                attributes: true,
                characterData: true,
                childList: true,
                subtree: true,
                attributeOldValue: true,
                characterDataOldValue: true
            });
        }
        tabSeq[93] = tabSeq[91];
        tabSeq[94] = tabSeq[92];
        tabSeq[95] = 0;
        tabSeq[96] = Date().toString();
        document.getElementsByClassName("refresh_btn")[0].click();
    }
    else if (request.msg == 666) {
        refButObsDisable = 1;
        //refreshButtonObserver.disconnect();
        //browser.runtime.onMessage.removeListener(bridle);

    }
    else {
        tabSeq = request.msg;
        markEverything(0);
        //tabSeq[93] = tabSeq[91];
        //tabSeq[94] = tabSeq[92];
        //removeEverything();
        //insertBeast(request.msg);
        //browser.runtime.onMessage.removeListener(beastify);
    }
}


function bridle2() {
    //tabSeq = request.msg;
    markEverything(0);
    //removeEverything();
    //insertBeast(request.msg);
    //browser.runtime.onMessage.removeListener(beastify);
}

function handleResponse(message) {
    tabSeq = message.response;
    markEverything(1);
    markEverything(0);
    browser.runtime.sendMessage({ msg: tabSeq });
    refButObsDisable = 1;
}

function handleError(error) {
    console.log(`Error: ${error}`);
    for (var i = 1; i < 91; i++) {
        tabSeq[i] = 0;
    }
    markEverything(0);
}

browser.runtime.onMessage.addListener(bridle);
var sending = browser.runtime.sendMessage({ msg: 69 });
sending.then(handleResponse, handleError);


/*
var x = document.getElementsByTagName("div");
for (i = 0; i < x.length; i++) {
    if (x[i].target.classList.contains("refresh_btn")) {
        x[i].addEventListener("click", bridle2, true);
    }
}; */

/*
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("refresh_btn")) {
        markEverything();
    }
});*/