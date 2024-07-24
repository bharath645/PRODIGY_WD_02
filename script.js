let startTime;
let updatedTime;
let difference = 0;
let tInterval;
let running = false;
let lapCounter = 0;

const display = document.getElementById('display');
const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const laps = document.getElementById('laps');

window.onload = loadState;

function startStopwatch() {
    if (!running) {
        startTime = new Date().getTime() - difference;
        tInterval = setInterval(updateTime, 10);
        running = true;
        startStopBtn.textContent = 'Stop';
        startStopBtn.style.background = '#f44336';
    } else {
        clearInterval(tInterval);
        running = false;
        startStopBtn.textContent = 'Start';
        startStopBtn.style.background = '#4caf50';
    }
    saveState();
}

function resetStopwatch() {
    clearInterval(tInterval);
    running = false;
    startStopBtn.textContent = 'Start';
    startStopBtn.style.background = '#4caf50';
    display.textContent = '00:00:00.00';
    difference = 0;
    laps.innerHTML = '';
    lapCounter = 0;
    saveState();
}

function updateTime() {
    updatedTime = new Date().getTime();
    difference = updatedTime - startTime;
    
    let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((difference % (1000 * 60)) / 1000);
    let milliseconds = Math.floor((difference % 1000) / 10);

    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    milliseconds = (milliseconds < 10) ? '0' + milliseconds : milliseconds;

    display.textContent = `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function recordLap() {
    if (running) {
        lapCounter++;
        const lapTime = display.textContent;
        const lapItem = document.createElement('li');
        lapItem.textContent = `Lap ${lapCounter}: ${lapTime}`;
        laps.appendChild(lapItem);
        saveState();
    }
}

function saveState() {
    const lapsArray = Array.from(laps.children).map(li => li.textContent);
    localStorage.setItem('stopwatch', JSON.stringify({
        difference,
        running,
        lapCounter,
        laps: lapsArray
    }));
}

function loadState() {
    const savedState = JSON.parse(localStorage.getItem('stopwatch'));
    if (savedState) {
        difference = savedState.difference;
        running = savedState.running;
        lapCounter = savedState.lapCounter;
        savedState.laps.forEach(lap => {
            const lapItem = document.createElement('li');
            lapItem.textContent = lap;
            laps.appendChild(lapItem);
        });
        if (running) {
            startTime = new Date().getTime() - difference;
            tInterval = setInterval(updateTime, 10);
            startStopBtn.textContent = 'Stop';
            startStopBtn.style.background = '#f44336';
        } else {
            updateTime();
        }
    }
}

startStopBtn.addEventListener('click', startStopwatch);
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', recordLap);
