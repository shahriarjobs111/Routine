let timer;
let elapsedTime = 0;
let isRunning = false;
let workLog = JSON.parse(localStorage.getItem("workLog")) || {}; // Load saved data

function updateTimerDisplay() {
    let hours = Math.floor(elapsedTime / 3600000);
    let minutes = Math.floor((elapsedTime % 3600000) / 60000);
    let seconds = Math.floor((elapsedTime % 60000) / 1000);
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);

    document.getElementById("timer").innerText =
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
}

document.getElementById("start").addEventListener("click", function () {
    if (!isRunning) {
        let startTime = Date.now() - elapsedTime;
        timer = setInterval(function () {
            elapsedTime = Date.now() - startTime;
            updateTimerDisplay();
        }, 10);
        isRunning = true;
    }
});

document.getElementById("stop").addEventListener("click", function () {
    clearInterval(timer);
    isRunning = false;
});

document.getElementById("reset").addEventListener("click", function () {
    clearInterval(timer);
    elapsedTime = 0;
    updateTimerDisplay();
    isRunning = false;
});

document.getElementById("save").addEventListener("click", function () {
    let today = new Date();
    let dateKey = today.toLocaleDateString('en-CA');

    if (!workLog[dateKey]) {
        workLog[dateKey] = 0;
    }

    workLog[dateKey] += elapsedTime;
    localStorage.setItem("workLog", JSON.stringify(workLog));

    elapsedTime = 0;
    updateTimerDisplay();
    updateCalendar();
});

document.getElementById("reset-all").addEventListener("click", function () {
    let password = prompt("Enter password to reset all data:");
    if (password === "Ectash@+1") {
        localStorage.removeItem("workLog");
        workLog = {};
        updateCalendar();
        alert("All data has been reset!");
    } else {
        alert("Incorrect password. Reset canceled.");
    }
});

function calculateTimeToComplete(hoursWorkedPerDay) {
    let months = 60 / hoursWorkedPerDay;
    if (months >= 12) {
        let years = Math.floor(months / 12);
        return `${years} year${years > 1 ? 's' : ''}`;
    } else {
        return `${Math.round(months)} month${months > 1 ? 's' : ''}`;
    }
}

function updateCalendar() {
    let days = document.querySelectorAll(".day");
    days.forEach(day => {
        let date = day.dataset.date;
        day.innerHTML = date.split('-')[2];
        day.style.backgroundColor = "";

        if (workLog[date]) {
            let hoursWorked = workLog[date] / 3600000;
            let timeToComplete = calculateTimeToComplete(hoursWorked);
            day.style.backgroundColor = "lightblue";

            let timeText = document.createElement('div');
            timeText.classList.add('time-to-complete');
            timeText.innerText = timeToComplete;
            timeText.style.color = 'red';
            day.appendChild(timeText);
        }
    });
}

function createCalendar() {
    let calendarDiv = document.getElementById("calendar");
    let today = new Date();
    let months = [today.getMonth(), today.getMonth() + 1, today.getMonth() + 2];

    months.forEach(month => {
        let date = new Date(today.getFullYear(), month, 1);
        let monthDiv = document.createElement("div");
        monthDiv.classList.add("month");
        monthDiv.innerHTML = `<h3>${date.toLocaleString('default', { month: 'long' })}</h3>`;

        let daysDiv = document.createElement("div");
        daysDiv.classList.add("days");

        let lastDay = new Date(date.getFullYear(), month + 1, 0).getDate();
        for (let i = 1; i <= lastDay; i++) {
            let day = document.createElement("div");
            let fullDate = `${date.getFullYear()}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            day.classList.add("day");
            day.dataset.date = fullDate;
            day.innerText = i;

            day.addEventListener("click", function () {
                alert(workLog[fullDate] ? `Work time: ${formatTime(workLog[fullDate])}` : "No work logged");
            });

            daysDiv.appendChild(day);
        }
        monthDiv.appendChild(daysDiv);
        calendarDiv.appendChild(monthDiv);
    });
    updateCalendar();
}

function formatTime(milliseconds) {
    return `${Math.floor(milliseconds / 3600000)}h ${Math.floor((milliseconds % 3600000) / 60000)}m`;
}

document.addEventListener("DOMContentLoaded", createCalendar);
