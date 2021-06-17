var sequence = new Array(98);

function redrawTable() {
    var td = document.querySelectorAll('#table1 td');
    for (var i = 1; i < 91; i++) {
        for (var j = 1; j < sequence.length; j++) {
            if (i == j && sequence[j] == 1) {
                td[i].style.backgroundColor = '#00D100';
            }
            else if (i == j && sequence[j] == 0) {
                td[i].style.backgroundColor = null; //'#FFFFFF';//'transparent';
            }
        }
    }
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function handleResponse(message) {
    sequence = message.response;
    //browser.runtime.sendMessage({ msg: sequence });
    redrawTable();
    //document.getElementById("maxtickets").value = sequence[91];
    //document.getElementById("maxcoinc").value = sequence[92];
    document.getElementById("log1").innerHTML = "Max tickets: " + sequence[93];
    document.getElementById("log2").innerHTML = "Max Coincidences: " + sequence[94];
    document.getElementById("log3").innerHTML = "Iterations: " + sequence[95];
    document.getElementById("log4").innerHTML = "Start time: " + sequence[96];
    document.getElementById("log5").innerHTML = "End time: " + sequence[97];
    var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
    gettingActiveTab.then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { msg: sequence });
    });
}

function handleResponse2(message) {
    sequence = message.response;
    redrawTable();
}

function handleError(error) {
    console.log(`Error: ${error}`);
    for (var i = 1; i < 91; i++) {
        sequence[i] = 0;
    }
    redrawTable();
}

var sending = browser.runtime.sendMessage({ msg: 69 });
sending.then(handleResponse, handleError);


document.addEventListener("click", (e) => {
    if (e.target.classList.contains("loadpage")) {
        browser.tabs.executeScript(null, { file: "/content_scripts/bridle.js" });
        sleep(1000).then(() => {
            var sending2 = browser.runtime.sendMessage({ msg: 69 });
            sending2.then(handleResponse2, handleError);
        });
    }
    else if (e.target.classList.contains("get")) {
        var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
        gettingActiveTab.then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, { msg: 13 });
        });
        sleep(1000).then(() => {
            var sending2 = browser.runtime.sendMessage({ msg: 69 });
            sending2.then(handleResponse2, handleError);
        });
    }
    else if (e.target.classList.contains("tablenumber")) {
        var getTableNumber = parseInt((e.target.classList), 10)
        if (sequence[getTableNumber] == 1) { sequence[getTableNumber] = 0 }
        else { sequence[getTableNumber] = 1 }
        browser.runtime.sendMessage({ msg: sequence });
        redrawTable();
        var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
        gettingActiveTab.then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, { msg: sequence });
        });
    }
    else if (e.target.classList.contains("clear")) {
        for (var i = 1; i < 91; i++) {
            sequence[i] = 0;
        }
        browser.runtime.sendMessage({ msg: sequence });
        redrawTable();
        var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
        gettingActiveTab.then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, { msg: sequence });
        });
    }
    else if (e.target.classList.contains("letsgo")) {
        sequence[91] = document.getElementById("maxtickets").value;
        sequence[92] = document.getElementById("maxcoinc").value;
        var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
        gettingActiveTab.then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, { msg: sequence });
        });
        gettingActiveTab.then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, { msg: 69 });
        });
    }
    else if (e.target.classList.contains("pause")) {
        var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
        gettingActiveTab.then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, { msg: 666 });
        });
    }
    else if (e.target.classList.contains("exporttable")) {
        var exportsequence = new Array(91);
        exportsequence[0] = 666;
        for (var i = 1; i < 91; i++) {
            exportsequence[i] = sequence[i];
        }
        navigator.clipboard.writeText(exportsequence)
            .then(() => {
                // All right
            })
            .catch(err => {
                console.log('Something went wrong', err);
            });
    }
    else if (e.target.classList.contains("importtable")) {
        var importsequence1 = document.getElementById("pastedtable").value;
        var importsequence = importsequence1.split(',', 91);
        for (var i = 1; i < 91; i++) {
            sequence[i] = parseInt(importsequence[i], 10);
        }
        browser.runtime.sendMessage({ msg: sequence });
        redrawTable();
        var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
        gettingActiveTab.then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, { msg: sequence });
        });
    }
});