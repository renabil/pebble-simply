var bsn = [0, 0, 0, 0, 0]
var count = 0;
var currentstatus = 'none';
var currentservice = 0;
var data;

// CONFIG
simply.fullscreen(false)

// RUN A FUNCTION SPECIFIC TO DISPLAYING THE UI
displayUI()

// USE BUTTON HANDLER
simply.on('singleClick', function (e) {

    // e.button
    // select
    // up
    // down

    if (e.button === 'up') {
        bsn[count] = bsn[count] + 1
        check()
        displayUI()
    } else if (e.button === 'down') {
        bsn[count] = bsn[count] - 1
        check()
        displayUI()
    } else if (e.button === 'select') {
        count = count + 1
        check()
        displayUI()
    }
});

// LONG CLICK HANDLER FOR BUTTON
simply.on('longClick', function (e) {

    currentstatus = 'making api call'
    displayUI()

    // MAKE AN API CALL and all necessary functions for the bus screen
    callApi()

});

function check() {
    if (bsn[count] > 9) {
        bsn[count] = 0
    }

    if (bsn[count] < 0) {
        bsn[count] = 9
    }

    if (count >= bsn.length) {
        count = 0
    }
}


// DISPLAY THE SLECT BUS STOP CODE UI
function displayUI() {
    simply.title('Busbble v1.1')
    simply.subtitle(bsn.join("/"))

    // SHOWS THE CURRENT COUNT OVER THE MAX
    simply.body('Item: ' + bsn[count] + '\nIndex: ' + count.toString() + '\nCopyright (C) renabil 2018')
}

// CONVERT TO MINUTES
function toMins(ms) {
    if (Math.floor(ms / 60000) <= 1) {
        return ' is Arriving!'
    } else {
        return ' is Arriving in ' + Math.floor(ms / 60000) + ' Min(s)'
    }
}

// DISPLAYS THE BUS UI
function displayBusUI() {
    // data.services.lenth - 1 because index starts counting at 0 and the length starts counting from 1
    var minus = data.services.length - 1
    simply.title(bsn.join(""))
    simply.subtitle(currentservice.toString() + '/' + minus.toString())
    simply.body(data.services[currentservice].no + toMins(data.services[currentservice].next.duration_ms) +  " [" + data.services[currentservice].next.type + "]" + toMins(data.services[currentservice].next2.duration_ms) +  " [" + data.services[currentservice].next2.type + "]");
}

function checkBus() {

    // data.services.lenth - 1 because index starts counting at 0 and the length starts counting from 1
    if (currentservice > data.services.length - 1) {
        currentservice = 0
    }

    if (currentservice < 0) {
        currentservice = data.services.length - 1
    }
}

function callApi() {
    ajax({
        url: 'https://arrivelah.herokuapp.com/?id=' + bsn.join(""),
        type: 'json'
    }, function (json) {

        data = json

        currentstatus = 'called api'
        displayUI()

        // DISPLAY THE DATA
        displayBusUI()
        simply.off()

        // USE BUTTON HANDLER TO CYCLE BETWEEN BUS SERVICES
        simply.on('singleClick', function (e) {

            if (e.button === 'up') {
                currentservice = currentservice + 1
                checkBus()

                displayBusUI()
            } else if (e.button === 'down') {
                currentservice = currentservice - 1
                checkBus()

                displayBusUI()
            } else if (e.button === 'select') {
                callApi()
                displayBusUI()

            }
        });
    });
}
