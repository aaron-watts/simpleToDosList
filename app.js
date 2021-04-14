let term = document.getElementById('terminal');
let shift = false;
let cursor = false;
let blink = true;
let todos = false;
let waiting = false;
let termMessage = '[user@host:/bin/ToDOS/]$&nbsp;';
let todosMessage = 'TODOS RUNNING.. $'
let userInput = '';
let todo = [];

function keyPressed(e) {

    let termString = term.innerText;

    if (waiting) {
        if (todos) termString = todosMessage;
        if (!todos) termString = termMessage;
    }

    if (cursor) {
        termString = termString.substring(0, termString.length - 1);
    }
    cursor = false;

    // &#9608; < cursor

    // shift
    if (e.keyCode == 16) {
        shift = true;
    }

    // Enter
    if (e.keyCode == 13) {
        termString = '[user@host:/bin/ToDOS/]$&nbsp;';

        if (userInput.replaceAll('&nbsp;', '') == 'todos') {
            todos = true;
            console.log('running software');
            termString = todosMessage;
        }

        if (userInput.replace('&nbsp;', '') == 'q') {
            todos = false;
            termString = termMessage;
        }


        if (todos) {
            termString = todosMessage;

            if (waiting) {
                waiting = false;
                blink = true;
            }

            if (userInput.replaceAll('&nbsp;', '') == 'help') {
                termString += '<br>ls&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| list<br>touch [task description] | add<br>rm [index]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | remove<br>q&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | quit<br><br>Enter to continue...';
                blink = false;
                waiting = true;
                term.innerHTML = termString;
            }

            if (userInput.replaceAll('&nbsp;', '').substring(0, 2) == 'ls') {
                blink = false;
                waiting = true;
                if (todo.length < 1) termString += '<br>No tasks<br><br>Enter to continue...'
                else {
                    for (let i = 0; i < todo.length; i++) {
                        termString += `<br>${i + 1} : ${todo[i]}`;
                    }
                    termString += '<br><br>Enter to continue...';
                }
                term.innerHTML = termString;
            }


            if (userInput.replaceAll('&nbsp;', '').slice(0, 5) == 'touch') {
                if (userInput.replaceAll('&nbsp;', '').length > 5) {
                    let task = userInput.replace('&nbsp;','').slice(5,userInput.replace('&nbsp;','').length);
                    todo.push(task.replaceAll('&nbsp;',' '))
                    termString += `<br>${task} added to list.<br>ls to view tasks<br><br>Enter to continue`;
                    blink = false;
                    waiting = true;
                    term.innerHTML = termString;
                } else {
                    termString += '<br>ERROR - No arguments included<br>Example:<br>add Do the dishes<br><br>Enter to continue';
                    blink = false;
                    waiting = true;
                    term.innerHTML = termString;
                }
                
            }

            if (userInput.replaceAll('&nbsp;', '').slice(0, 2) == 'rm') {
                if (userInput.replaceAll('&nbsp;', '').length > 2) {
                    let index = userInput.replace('&nbsp;','').slice(2,userInput.replace('&nbsp;','').length);
                    termString += `<br>${todo[parseInt(index)-1]} removed from list.<br>ls to view tasks<br><br>Enter to continue`;
                    todo.splice(parseInt(index-1),1);
                    blink = false;
                    waiting = true;
                    term.innerHTML = termString;
                } else {
                    termString += '<br>ERROR - No arguments included<br>Example:<br>rm 1<br><br>Enter to continue';
                    blink = false;
                    waiting = true;
                    term.innerHTML = termString;
                }
            }

        }

        userInput = '';
    }

    // backspace
    if (e.keyCode == 8) {
        if ((todos && termString.length > todosMessage.length) || (!todos && termString.length > termMessage.length - 5)) {
            termString = termString.substring(0, termString.length - 1);
            userInput = userInput.substring(0, userInput.length - 1);
        }
    }

    if (shift && !waiting) {
        if (shiftKeyCode[e.keyCode]) {
            termString += shiftKeyCode[e.keyCode];
            userInput += shiftKeyCode[e.keyCode];
        } else {
            if (keyCode[e.keyCode]) {
                termString += keyCode[e.keyCode];
                userInput += keyCode[e.keyCode];
            }
        }
    }

    if (!shift && !waiting) {
        if (keyCode[e.keyCode]) {
            termString += keyCode[e.keyCode];
            userInput += keyCode[e.keyCode];
        }
    }

    if (!waiting) term.innerHTML = termString;
}

function keyReleased(e) {
    if (e.keyCode == 16) {
        shift = false;
    }
}

window.onload = function () {
    setInterval(updateAll, 900);

    document.addEventListener('keydown', keyPressed);
    document.addEventListener('keyup', keyReleased);
}


function updateAll() {
    updateClock();
    blinkCursor();
}

function blinkCursor() {
    if (blink) {
        let termText = term.innerText;

        if (cursor) {
            termText = termText.substring(0, termText.length - 1);
            cursor = false;
        } else {
            termText += '&#9608;';
            cursor = true;
        }

        term.innerHTML = termText;
    }

}

function updateClock() {
    let t = new Date();
    let hh = t.getHours();
    let hcode = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];
    let meridies = checkMeridies(hh);
    let mm = t.getMinutes();

    let clock = document.getElementById('clock');

    if (mm < 10) { mm = '0' + mm }

    clock.innerHTML = `${hcode[hh]}:${mm} ${meridies.toUpperCase()}`
}

function checkMeridies(h) {
    if (h < 12) { return 'am'; } else { return 'pm'; }
}

function fillTerm() {
    let termCount = '';
    for (let i = 0; i < 631; i++) termCount += `${i + 1}`;
    term.innerHTML = termCount.length;
}

updateClock();
