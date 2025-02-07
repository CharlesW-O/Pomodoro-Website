// const progressBar = $(".progress-bar");
// let progress = 0;

// function enableProgressBar() {
//     progressBar.attr("role", "progressbar");
//     progressBar.attr("aria-valuenow", 0);
//     progressBar.attr("aria-live", "polite");
// }

// enableProgressBar();

// function updateTimer(progress) {
//     progressBar.attr("aria-valuenow", progress);
//     progressBar.attr('--progress', progress + "%");
// }

// Used to change timer depending on focus, short or long break.
var focusInput = document.getElementById("focus-input");
var shortBreakInput = document.getElementById("short-break-input"); //Not connected to anything yet
var longBreakInput = document.getElementById("long-break-input"); //Not connected to anything yet

//Used to track and alternate intervals of focus and breaks.
var currentTimerType = "focus";


// Initial value of 20 seconds CHANGE THIS TO CHANGE TIMER LENGTH
let TIME_LIMIT = 0;

//For animating the progress bar
const FULL_DASH_ARRAY = 283;

// Initially, no time passed, but will count up and subtract from TIME_LIMIT
let timePassed = 0;
let timeLeft = TIME_LIMIT;

// Keep reference of interval object to clear when needed
let timerInterval = null;

// Variables that enable focus intervals/till-loong-break functionality
let intervalCurrentCount = 1
let focusIntervalText = document.getElementById("focus-interval-text");

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
                    <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45" />
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

    TIME_LIMIT = focusInput.value;

    if (!timerInterval) {

        timerInterval = setInterval(() => {
        
            // Time passed increases by 1
            timePassed = timePassed += 1;
            timeLeft = TIME_LIMIT - timePassed

            // Time left label updates
            document.getElementById("base-timer-label").innerHTML = formatTimeLeft(timeLeft);

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
    TIME_LIMIT = 0;
    document.getElementById("start-stop-btn").setAttribute("src", "./images/play-fill.svg");
    playAlarm();
    tillLongBreak();
}

// Start/pause timer when button hit
window.addEventListener("load", () => {
    const startStopBtn = document.getElementById("start-stop-btn");
    
    // focusInput.onchange = () => { //Make work for all 3 inputs. Change TIME_LIMIT to be FOCUS_TIME_LIMIT etc. maybe?
    //     TIME_LIMIT = focusInput.value; // *60 it
    //     focusInput.value = "";
    // };

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
            alert("Sent to short Break");
        } else {
            intervalCurrentCount = 1;
            currentTimerType = "longBreak";
            alert("Sent to long break");
        }
    } else {
        currentTimerType = "focus";
        alert("Sent to focus")
    }

    focusIntervalText.textContent = intervalCurrentCount + "/" + intervalFullCount;
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
 
// Play Audio Function MESSED UP AND SLOW FIGURE OUT LATER or just find a better alarm sound honestly. Prob that tbh.

function playAudio(audio, numberOfTimes = 1, delay = 3000, firstTime = true ){
    if(firstTime){
       audio.play();
    }
    setTimeout( () => {
       if(!firstTime){
           audio.play();
       }
       numberOfTimes--;
       if(numberOfTimes > 0){
         playAudio(audio,numberOfTimes,delay, false);
       }
    }, delay)
  }

  function playAlarm() {
    var audio = new Audio("./sounds/chime-sound-7143.mp3");
    audio.volume = 1;
        playAudio(audio,3,2000);
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