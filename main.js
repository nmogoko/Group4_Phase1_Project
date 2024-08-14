document.addEventListener('DOMContentLoaded', () => {
    // =========================
    // Calendar Modal Management
    // =========================
  
    // DOM elements for Calendar Modal
    const calendarModal = document.getElementById("calendarModal");
    const eventModal = document.getElementById("eventModal");
    const eventForm = document.getElementById("eventForm");
    const eventTitle = document.getElementById("eventTitle");
    const eventDate = document.getElementById("eventDate");
    const eventStartTime = document.getElementById("eventStartTime");
    const eventEndTime = document.getElementById("eventEndTime");
    const eventLocation = document.getElementById("eventLocation");
    const monthYearElement = document.getElementById("monthYear");
    const contentCalendar = document.getElementById("content-calendar-button");
    const prevMonthButton = document.getElementById("prevMonthButton");
    const nextMonthButton = document.getElementById("nextMonthButton");
  
    let events = [];
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
  
    const API_URL = 'http://localhost:4001/calendar'; // Replace with your actual API endpoint
  
    // Fetch and display events
    async function fetchEvents(year, month) {
      try {
        const response = await fetch(`${API_URL}?year=${year}&month=${month + 1}`);
        if (!response.ok) throw new Error('Failed to fetch events');
        events = await response.json();
        displayCalendar();
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
  
    // Send a new event to the API
    async function sendEventToAPI(newEvent) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEvent),
        });
        if (!response.ok) throw new Error('Failed to send event');
        const savedEvent = await response.json();
        events.push(savedEvent);
        displayCalendar();
      } catch (error) {
        console.error('Error sending event:', error);
      }
    }
  
    // Display the calendar
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
  
              const eventDetails = document.createElement("div");
              eventDetails.classList.add("event-details");
              eventsForDate.forEach(event => {
                const eventElement = document.createElement("p");
                eventElement.textContent = `${event.title} (${event.startTime})`;
                eventDetails.appendChild(eventElement);
              });
              cell.appendChild(eventDetails);
            }
            date++;
          }
          row.appendChild(cell);
        }
        calendarDays.appendChild(row);
      }
    }
  
    // Open calendar modal
    contentCalendar.addEventListener('click', function (e) {
      e.preventDefault();
      calendarModal.style.display = "block";
      displayCalendar();
    });
  
    // Open modal for adding or editing events
    function openEventModal(e) {
      e.preventDefault();
      const selectedDate = e.target.dataset.date;
      eventDate.value = selectedDate;
      eventModal.style.display = "block";
  
      eventForm.reset();
      eventDate.value = selectedDate;
  
      const eventsForDate = events.filter(event => event.date === selectedDate);
      if (eventsForDate.length > 0) {
        const event = eventsForDate[0];
        eventTitle.value = event.title;
        eventStartTime.value = event.startTime;
        eventEndTime.value = event.endTime;
        eventLocation.value = event.location;
      }
    }
  
    // Close modals
    document.querySelectorAll(".close").forEach(close => {
      close.onclick = function (e) {
        e.preventDefault();
        calendarModal.style.display = "none";
        eventModal.style.display = "none";
      };
    });
  
    // Close modals when clicking outside of them
    window.onclick = function (event) {
      if (event.target === calendarModal || event.target === eventModal) {
        calendarModal.style.display = "none";
        eventModal.style.display = "none";
      }
    };
  
    // Handle event form submission
    eventForm.onsubmit = async function (e) {
      e.preventDefault();
      const newEvent = {
        title: eventTitle.value,
        date: eventDate.value,
        startTime: eventStartTime.value,
        endTime: eventEndTime.value,
        location: eventLocation.value,
      };
      await sendEventToAPI(newEvent);
      eventModal.style.display = "none";
      eventForm.reset();
    };
  
    // Handle month navigation
    prevMonthButton.onclick = (e) => {
      e.preventDefault();
      currentMonth = (currentMonth - 1 + 12) % 12;
      if (currentMonth === 11) currentYear--;
      fetchEvents(currentYear, currentMonth);
    };
  
    nextMonthButton.onclick = (e) => {
      e.preventDefault();
      currentMonth = (currentMonth + 1) % 12;
      if (currentMonth === 0) currentYear++;
      fetchEvents(currentYear, currentMonth);
    };
  
    // Initialize calendar display
    fetchEvents(currentYear, currentMonth);
  
    // =========================
    // Reading List Management
    // =========================
  
    const modal = document.getElementById("modal-info");
    const addButton = document.querySelector("#add-button");
    const bookListContainer = document.getElementById("book-list");
    const titleInput = document.querySelector("#title");
    const authorInput = document.querySelector("#author");
    const genreInput = document.querySelector("#genre");
  
    // Display the reading list
    const displayBookList = () => {
      fetch("http://localhost:4001/readingList")
        .then((response) => response.json())
        .then((books) => {
          bookListContainer.innerHTML = "";
          books.forEach((book) => {
            const bookItem = document.createElement("ul");
            bookItem.className = "list-group";
  
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.innerText = `${book.title} by ${book.author} (${book.genre})`;
  
            const deleteIcon = document.createElement("button");
            deleteIcon.className = "btn btn-danger btn-sm";
            deleteIcon.innerHTML = "&#x1F5D1;";
  
            const readButton = document.createElement("button");
            readButton.className = "btn btn-success btn-sm";
            readButton.innerText = "Read";
  
            readButton.addEventListener("click", () => {
              if (readButton.innerText === "Unread") {
                readButton.innerText = "Read";
                readButton.classList.add("highlighted");
              } else {
                readButton.innerText = "Unread";
                readButton.classList.remove("highlighted");
              }
            });
  
            deleteIcon.addEventListener("click", (e) => {
              e.preventDefault();
              if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
                fetch(`http://localhost:4001/readingList/${book.id}`, {
                  method: "DELETE",
                })
                  .then((response) => {
                    if (response.ok) {
                      bookListContainer.removeChild(bookItem);
                      console.log(`Deleted book: ${book.title}`);
                    } else {
                      console.error("Failed to delete the book:", response.statusText);
                    }
                  })
                  .catch((error) => {
                    console.error("Error deleting the book:", error);
                  });
              }
            });
  
            listItem.appendChild(readButton);
            listItem.appendChild(deleteIcon);
            bookItem.appendChild(listItem);
            bookListContainer.appendChild(bookItem);
          });
        })
        .catch((error) => {
          console.error("Error fetching the book list:", error);
        });
    };
  
    // Add a new book to the reading list
    addButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (!titleInput.value || !authorInput.value || !genreInput.value) return;
  
      const newBook = {
        title: titleInput.value,
        author: authorInput.value,
        genre: genreInput.value,
      };
  
      fetch("http://localhost:4001/readingList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      })
        .then((response) => response.json())
        .then((book) => {
          displayBookList();
        })
        .catch((error) => {
          console.error("Error adding the book:", error);
        });
  
      titleInput.value = "";
      authorInput.value = "";
      genreInput.value = "";
    });
  
    // Open modal for adding a new book
    document.getElementById("reading-list-button").addEventListener("click", function (e) {
      e.preventDefault();
      modal.style.display = "block";
    });
  
    // Close modal when clicking outside of it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  
    // Initialize book list display
    displayBookList();
  
    // =========================
    // Quick Notes Management
    // =========================
  
    const quickNotesButton = document.getElementById("quick-notes-button");
    const quickNotesModal = document.getElementById("quickNotesModal");
    const addNoteButton = document.getElementById("add-note");
    const noteInput = document.getElementById("note-input");
    const notesList = document.getElementById("notes-list");
    const closeQuickNotesButton = document.querySelector(".close-quick-notes");
  
    // Show Quick Notes Modal
    quickNotesButton.addEventListener("click", function () {
      quickNotesModal.style.display = "block";
    });
  
    // Close Quick Notes Modal
    closeQuickNotesButton.addEventListener("click", function () {
      quickNotesModal.style.display = "none";
    });
  
    // Add note functionality
    addNoteButton.addEventListener("click", function () {
      const noteText = noteInput.value.trim();
      if (noteText) {
        const li = document.createElement("li");
        li.classList.add("note-item");
  
        const noteTextElement = document.createElement("span");
        noteTextElement.classList.add("note-text");
        noteTextElement.textContent = noteText;
  
        const editInput = document.createElement("input");
        editInput.classList.add("edit-input");
        editInput.type = "text";
        editInput.value = noteText;
        editInput.style.display = "none";
  
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-button");
        editButton.style.backgroundColor = "#4CAF50";
        editButton.style.color = "white";
        editButton.style.border = "none";
        editButton.style.padding = "5px 10px";
        editButton.style.margin = "5px";
        editButton.style.borderRadius = "5px";
        editButton.style.cursor = "pointer";
  
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.style.backgroundColor = "#f44336";
        deleteButton.style.color = "white";
        deleteButton.style.border = "none";
        deleteButton.style.padding = "5px 10px";
        deleteButton.style.margin = "5px";
        deleteButton.style.borderRadius = "5px";
        deleteButton.style.cursor = "pointer";
  
        li.appendChild(noteTextElement);
        li.appendChild(editInput);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        notesList.appendChild(li);
        noteInput.value = "";
  
        // Edit note functionality
        editButton.addEventListener("click", function () {
          if (editInput.style.display === "none") {
            editInput.style.display = "inline";
            editButton.textContent = "Save";
            noteTextElement.style.display = "none";
          } else {
            const newNoteText = editInput.value.trim();
            if (newNoteText) {
              noteTextElement.textContent = newNoteText;
              editInput.style.display = "none";
              noteTextElement.style.display = "inline";
              editButton.textContent = "Edit";
            }
          }
        });
  
        // Delete note functionality
        deleteButton.addEventListener("click", function () {
          notesList.removeChild(li);
        });
      }
    });
  });
  