
// Used to change timer depending on focus, short or long break.
var focusInput = document.getElementById("focus-input");
var shortBreakInput = document.getElementById("short-break-input"); //Not connected to anything yet
var longBreakInput = document.getElementById("long-break-input"); //Not connected to anything yet

//Used to track and alternate intervals of focus and breaks.
var currentTimerType = "focus";


// Initial value of 20 seconds CHANGE THIS TO CHANGE TIMER LENGTH
let TIME_LIMIT = focusInput.value * 60;

//For animating the progress bar
const FULL_DASH_ARRAY = 283;

// Initially, no time passed, but will count up and subtract from TIME_LIMIT
let timePassed = 0;
let timeLeft = TIME_LIMIT;

// Keep reference of interval object to clear when needed
let timerInterval = null;

// Variables that enable focus intervals/till-long-break functionality
let intervalCurrentCount = 1
let focusIntervalText = document.getElementById("focus-interval-text");

// Targets the timer label, telling you what "zone" you are in (focus, break).
const zoneTagText = document.querySelector(".zone-tag");

// Color for the remaining time path (the path on top)
// const COLOR_CODES = {
//     info: {
//         color: "green"
//     }
// };

// let remainingPathColor = COLOR_CODES.info.color;
let remainingPathColor = "white";

// Injecting the HTML
document.querySelector("#timer").innerHTML = `
        <div class="base-timer">
            <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g class="base-timer__circle">
                    <circle class="base-timer__path-elapsed elapsed-color-focus" cx="50" cy="50" r="45" />
                    <path
                        id="base-timer-path-remaining"
                        stroke-dasharray="283"
                        class="base-timer__path-remaining ${remainingPathColor}"
                         d="
                            M 50, 50
                            m -45, 0
                            a 45,45 0 1,0 90,0
                            a 45,45 0 1,0 -90,0
                        "
                    ></path>
                </g>
            </svg>
            <span id="base-timer-label" class="base-timer__label">
                ${formatTimeLeft(timeLeft)}
            </span>
            <span class="base-timer__label play-pause-btn"><img id="start-stop-btn" src="./images/play-fill.svg"></span>
        </div>
`; 

// Starts the timer when called
function startTimer() { 

    switch(currentTimerType) {
        case "focus":
            TIME_LIMIT = focusInput.value * 60;
        break;

        case "shortBreak":
            TIME_LIMIT = shortBreakInput.value * 60;
        break;

        case "longBreak":
            TIME_LIMIT = longBreakInput.value * 60;
        break;

        default: TIME_LIMIT = 25 * 60;
    }

    if (!timerInterval) {

        timerInterval = setInterval(() => {
        
            // Time passed increases by 1
            timePassed = timePassed += 1;
            timeLeft = TIME_LIMIT - timePassed

            // Time left label updates
            document.getElementById("base-timer-label").innerHTML = formatTimeLeft(timeLeft);

            //Updating Tab Title w/ Timer
            document.querySelector("#tab-title").textContent = "MiniDoro - " + formatTimeLeft(timeLeft);

            //Updates path each second
            setCircleDasharray();

            if (timeLeft === 0) {
            onTimesUp();
            }
        }, 1000);
    }
}

// Pauses Timer when called 
function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Resets timer on end
function onTimesUp() {

    clearInterval(timerInterval);
    timerInterval = null;
    timePassed = 0;
    // TIME_LIMIT = 0;
    document.getElementById("start-stop-btn").setAttribute("src", "./images/play-fill.svg");
    playAlarm(alarmChoice);
    tillLongBreak();
    timerLabelReset();
    
}

// Start/pause timer when button hit
window.addEventListener("load", () => {
    const startStopBtn = document.getElementById("start-stop-btn");

    startStopBtn.addEventListener("click", () => {

        if (startStopBtn.getAttribute("src") === "./images/play-fill.svg") {

            startTimer();

            startStopBtn.setAttribute("src", "./images/pause-fill.svg");

        } else {

            pauseTimer();

            startStopBtn.setAttribute("src", "./images/play-fill.svg");
        }

    });
})

// Ticks up focus interval aka till-long-break counter + sends to correct break
function tillLongBreak() {
    const intervalFullCount = document.getElementById("focus-interval").value;

    if (currentTimerType == "focus") {

        intervalCurrentCount++;

        if (intervalCurrentCount <= intervalFullCount) {

            currentTimerType = "shortBreak";
            TIME_LIMIT = shortBreakInput.value * 60;
            zoneTagText.innerText = "Short Break";
            changeZoneColor();
            // alert("Sent to short Break");

        } else {

            intervalCurrentCount = 1;
            currentTimerType = "longBreak";
            TIME_LIMIT = longBreakInput.value * 60;
            zoneTagText.innerText = "Long Break";
            changeZoneColor();
            // alert("Sent to long break");
        }

    } else {

        currentTimerType = "focus";
        TIME_LIMIT = focusInput.value * 60;
        zoneTagText.innerText = "Focus";
        changeZoneColor();
        // alert("Sent to focus");
    }

    focusIntervalText.textContent = intervalCurrentCount + "/" + intervalFullCount;
}

// Function that facilitates color change as timer "zones" roll over.

function changeZoneColor() {
const targetBody = document.body;
const targetZoneTag = document.querySelector(".zone-tag");
const targetElapsedTime = document.querySelector(".base-timer__path-elapsed");
const targetLeftControlChevron = document.querySelectorAll(".control-chevron")[0];
const targetRightControlChevron = document.querySelectorAll(".control-chevron")[1];

switch (currentTimerType) {
    case "focus": 
        targetBody.classList.remove("short-color-bg");
        targetBody.classList.remove("long-color-bg");
        targetBody.classList.add("focus-color-bg");

        targetZoneTag.classList.remove("short-color");
        targetZoneTag.classList.remove("long-color");
        targetZoneTag.classList.add("focus-color");

        targetElapsedTime.classList.remove("elapsed-color-short");
        targetElapsedTime.classList.remove("elapsed-color-long");
        targetElapsedTime.classList.add("elapsed-color-focus");

        targetLeftControlChevron.classList.remove("focus-color");
        targetRightControlChevron.classList.remove("focus-color");
        targetLeftControlChevron.classList.add("short-color");
        targetRightControlChevron.classList.add("short-color");
    break;

    case "shortBreak":
        targetBody.classList.remove("focus-color-bg");
        targetBody.classList.add("short-color-bg");

        targetZoneTag.classList.remove("focus-color");
        targetZoneTag.classList.add("short-color");

        targetElapsedTime.classList.remove("elapsed-color-focus");
        targetElapsedTime.classList.add("elapsed-color-short");

        targetLeftControlChevron.classList.remove("short-color");
        targetRightControlChevron.classList.remove("short-color");
        targetLeftControlChevron.classList.add("focus-color");
        targetRightControlChevron.classList.add("focus-color");
    break;

    case "longBreak":
        targetBody.classList.remove("focus-color-bg");
        targetBody.classList.add("long-color-bg");

        targetZoneTag.classList.remove("focus-color");
        targetZoneTag.classList.add("long-color");

        targetElapsedTime.classList.remove("elapsed-color-focus");
        targetElapsedTime.classList.add("elapsed-color-long");

        targetLeftControlChevron.classList.remove("short-color");
        targetRightControlChevron.classList.remove("short-color");
        targetLeftControlChevron.classList.add("focus-color");
        targetRightControlChevron.classList.add("focus-color");
    break;

    default: console.log(currentTimerType);
}
}

// Formats the time left lable correctly
function formatTimeLeft(time) {
    const minutes = Math.floor(time / 60); // Largest round integer <= to time / 60

    let seconds = time % 60; // Seconds = the remainder of time / 60

    if (seconds < 10) {
        seconds = `0${seconds}`; //If seconds = less than 10, lead it with a 0
    }

    return `${minutes}:${seconds}`; //Output in MM:SS 
}

// Sets timer's display/label of time after switching to next "zone".
function timerLabelReset() {
    document.getElementById("base-timer-label").innerText = formatTimeLeft(TIME_LIMIT);
}

// Divides time left by the defined time limit.
function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
  }
      
// Update the dasharray value (on the progress bar SVG) as time passes, starting with 283 (calculated arc)
function setCircleDasharray() {
    const circleDasharray = `${(
      calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
      .getElementById("base-timer-path-remaining")
      .setAttribute("stroke-dasharray", circleDasharray);
  }
 
// Timer Settings Form (Alarms, time intervals, etc.)
let timerSettings = document.forms["timer-settings"];
let alarmChoice = timerSettings.alarmSound;
let alarmOptions = timerSettings.alarmSound.options;

// focusInput.onchange = function() {
//     TIME_LIMIT = this.value;
//     formatTimeLeft(timeLeft);
// }
//Figure above out. Seems like way to solve initial display not working. Pos need to do the .forms[] array thing?

alarmChoice.onchange = function() {
    let optionValue = this.value;
    var alarm = new Audio("./sounds/" + optionValue + ".mp3" )
    alarm.volume = 1;
    alarm.play();
}

function playAlarm() {
    let chosenAlarm = alarmChoice.value;
    var alarm = new Audio("./sounds/" + chosenAlarm + ".mp3" )
    alarm.volume = 1;
    alarm.play();
    }



// Modal Menus JS

var settingsModal = $("#settings-modal");
var menuModal = $("#menu-modal");
var closeModalSpan = $(".close-modal");

$(".bi-gear-fill").on("click", () => {
    settingsModal.css("display", "block");
});

$(".bi-list").on("click", () => {
    menuModal.css("display", "block");
})

closeModalSpan.on("click", () => {
    closeModal(settingsModal);
    closeModal(menuModal);
})

// window.onclick = function(event) {
//     if (event.target == settingsModal || event.target == menuModal) {
//       closeModal(settingsModal);
//       closeModal(menuModal);
//     }
//   }

function closeModal(targetModal) {
        targetModal.css("display", "none");
  }