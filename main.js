// DOM elements
const calendarModal = document.getElementById("calendarModal");
const eventModal = document.getElementById("eventModal");
const eventForm = document.getElementById("eventForm");
const eventTitle = document.getElementById("eventTitle");
const eventDate = document.getElementById("eventDate");
const eventStartTime = document.getElementById("eventStartTime");
const eventEndTime = document.getElementById("eventEndTime");
const eventFrequency = document.getElementById("eventFrequency");
const eventLocation = document.getElementById("eventLocation");
const eventCalendar = document.getElementById("eventCalendar");
const modalClose = document.querySelectorAll(".close");
const monthYearElement = document.getElementById("monthYear");
const contentCalendar = document.querySelector(".item:nth-child(3)"); // Select the content calendar item
const prevMonthButton = document.getElementById("prevMonthButton");
const nextMonthButton = document.getElementById("nextMonthButton");

let events = [];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Display calendar
function displayCalendar() {
    const calendarDays = document.getElementById("calendarDays");
    calendarDays.innerHTML = ""; // Clear existing content
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    monthYearElement.textContent = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement("td");

            if (i === 0 && j < firstDay) {
                cell.classList.add("empty-cell");
            } else if (date > daysInMonth) {
                cell.classList.add("empty-cell");
            } else {
                cell.textContent = date;
                cell.dataset.date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                cell.addEventListener("click", openEventModal);

                const eventsForDate = events.filter(event => event.date === cell.dataset.date);
                if (eventsForDate.length > 0) {
                    cell.classList.add("has-events");
                    const eventIndicator = document.createElement("div");
                    eventIndicator.classList.add("event-indicator");
                    eventIndicator.textContent = eventsForDate.length;
                    cell.appendChild(eventIndicator);
                }

                date++;
            }
            row.appendChild(cell);
        }
        calendarDays.appendChild(row);
    }
}

// Open calendar modal
contentCalendar.addEventListener('click', function() {
    calendarModal.style.display = "block";
    displayCalendar();
});

// Open modal to show events for selected date
function openEventModal(e) {
    const selectedDate = e.target.dataset.date;
    eventDate.value = selectedDate;
    eventModal.style.display = "block";

    // Clear previous form content
    eventForm.reset();
    eventDate.value = selectedDate;

    // Find events for the selected date
    const eventsForDate = events.filter(event => event.date === selectedDate);

    if (eventsForDate.length > 0) {
        // Fill the form with the first event's details
        const event = eventsForDate[0];
        eventTitle.value = event.title;
        eventStartTime.value = event.startTime;
        eventEndTime.value = event.endTime;
        eventLocation.value = event.location;
    }
}

// Close modals
modalClose.forEach(close => {
    close.onclick = function() {
        calendarModal.style.display = "none";
        eventModal.style.display = "none";
    };
});

// Close modals when clicking outside of them
window.onclick = function(event) {
    if (event.target === calendarModal) {
        calendarModal.style.display = "none";
    }
    if (event.target === eventModal) {
        eventModal.style.display = "none";
    }
};

// Handle event form submission
eventForm.onsubmit = function(e) {
    e.preventDefault();
    const newEvent = {
        title: eventTitle.value,
        date: eventDate.value,
        startTime: eventStartTime.value,
        endTime: eventEndTime.value,
        location: eventLocation.value,
        calendar: eventCalendar.value,
    };

    // Add event to list and close modal
    events.push(newEvent);
    eventModal.style.display = "none";
    displayCalendar();
};

// Handle month navigation
prevMonthButton.onclick = () => {
    currentMonth = (currentMonth - 1 + 12) % 12;
    if (currentMonth === 11) currentYear--;
    displayCalendar();
};

nextMonthButton.onclick = () => {
    currentMonth = (currentMonth + 1) % 12;
    if (currentMonth === 0) currentYear++;
    displayCalendar();
};

// Initialize calendar display
displayCalendar();