document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // Constants & Variables
    // =========================

    const API_URL = 'http://localhost:4001';
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

    // =========================
    // Calendar Modal Management
    // =========================

    async function fetchEvents(year, month) {
        try {
            const response = await fetch(`${API_URL}/calendar?year=${year}&month=${month + 1}`);
            if (!response.ok) throw new Error('Failed to fetch events');
            events = await response.json();
            displayCalendar();
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    async function sendEventToAPI(newEvent) {
        try {
            const response = await fetch(`${API_URL}/calendar`, {
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
                if (i === 0 && j < firstDay || date > daysInMonth) {
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

    contentCalendar.addEventListener('click', (e) => {
        e.preventDefault();
        calendarModal.style.display = "block";
        displayCalendar();
    });

    function openEventModal(e) {
        e.preventDefault();
        const selectedDate = e.target.dataset.date;
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

    document.querySelectorAll(".close").forEach(close => {
        close.onclick = (e) => {
            e.preventDefault();
            calendarModal.style.display = "none";
            eventModal.style.display = "none";
        };
    });

    window.onclick = function (event) {
        if (event.target === calendarModal || event.target === eventModal) {
            calendarModal.style.display = "none";
            eventModal.style.display = "none";
        }
    };

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

    const displayBookList = () => {
        fetch(`${API_URL}/readingList`)
            .then(response => response.json())
            .then(books => {
                bookListContainer.innerHTML = "";
                books.forEach(book => {
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
                        readButton.innerText = readButton.innerText === "Unread" ? "Read" : "Unread";
                        readButton.classList.toggle("highlighted");
                    });

                    deleteIcon.addEventListener("click", (e) => {
                        e.preventDefault();
                        if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
                            fetch(`${API_URL}/readingList/${book.id}`, {
                                method: "DELETE",
                            })
                                .then(response => {
                                    if (response.ok) {
                                        bookListContainer.removeChild(bookItem);
                                        console.log(`Deleted book: ${book.title}`);
                                    } else {
                                        console.error("Failed to delete the book:", response.statusText);
                                    }
                                })
                                .catch(error => {
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
            .catch(error => console.error("Error fetching the book list:", error));
    };

    addButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (!titleInput.value || !authorInput.value || !genreInput.value) return;

        const newBook = {
            title: titleInput.value,
            author: authorInput.value,
            genre: genreInput.value,
        };

        fetch(`${API_URL}/readingList`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newBook),
        })
            .then(response => response.json())
            .then(() => {
                displayBookList();
            })
            .catch(error => console.error("Error adding the book:", error));

        titleInput.value = "";
        authorInput.value = "";
        genreInput.value = "";
    });

    document.getElementById("reading-list-button").addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "block";
    });

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    document.getElementById("close-reading-list").addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = "none";
    });

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

    quickNotesButton.addEventListener("click", (e) => {
        e.preventDefault();
        quickNotesModal.style.display = "block";
    });

    closeQuickNotesButton.addEventListener("click", () => {
        quickNotesModal.style.display = "none";
    });

    addNoteButton.addEventListener("click", (e) => {
        e.preventDefault();
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
            Object.assign(editButton.style, {
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                padding: "5px 10px",
                margin: "5px",
                borderRadius: "5px",
                cursor: "pointer",
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete-button");
            Object.assign(deleteButton.style, {
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                padding: "5px 10px",
                margin: "5px",
                borderRadius: "5px",
                cursor: "pointer",
            });

            li.appendChild(noteTextElement);
            li.appendChild(editInput);
            li.appendChild(editButton);
            li.appendChild(deleteButton);
            notesList.appendChild(li);
            noteInput.value = "";

            editButton.addEventListener("click", (e) => {
                e.preventDefault();
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

            deleteButton.addEventListener("click", (e) => {
                e.preventDefault();
                notesList.removeChild(li);
            });
        }
    });

    // =========================
    // Movie List Management
    // =========================

    const movieListButton = document.getElementById('movie-list-button');
    const movieModal = document.getElementById('movieModal');
    const closeMovieModal = document.getElementById('close-movieList');

    function fetchMovies() {
        fetch(`${API_URL}/movieList`)
            .then(response => response.json())
            .then(movies => {
                movies.sort((a, b) => a.watched - b.watched); // Sort by watched status
                const movieList = document.getElementById('movieList');
                movieList.innerHTML = '';
                movies.forEach(movie => addMovieToList(movie));
            })
            .catch(error => console.error('Error:', error));
    }

    function addMovieToList(movie) {
        const movieList = document.getElementById('movieList');

        const li = document.createElement('li');
        li.className = 'movie-item';

        const movieInfo = document.createElement('div');
        movieInfo.className = 'movie-info';
        movieInfo.innerHTML = `
            <strong>${movie.title}</strong> 
            ${movie.watched ? '<span class="watched-badge">Watched</span>' : ''}
        `;

        const movieActions = document.createElement('div');
        movieActions.className = 'movie-actions';

        if (!movie.watched) {
            const watchButton = document.createElement('button');
            watchButton.className = 'watched';
            watchButton.textContent = 'Mark as Watched';
            watchButton.addEventListener('click', () => markAsWatched(movie.id));
            movieActions.appendChild(watchButton);
        }

        const editButton = document.createElement('button');
        editButton.className = 'edit';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editMovie(movie));
        movieActions.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteMovie(movie.id));
        movieActions.appendChild(deleteButton);

        li.appendChild(movieInfo);
        li.appendChild(movieActions);
        movieList.appendChild(li);
    }

    document.getElementById('movieForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('movieTitle').value;

        if (title.trim() === '') return;

        fetch(`${API_URL}/movieList`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, watched: false })
        })
        .then(response => response.json())
        .then(movie => {
            addMovieToList(movie);
            document.getElementById('movieForm').reset();
        })
        .catch(error => console.error('Error:', error));
    });

    function markAsWatched(movieId) {
        
        fetch(`${API_URL}/movieList/${movieId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ watched: true })
        })
        .then(() => {
            movieModal // Re-render the list after marking as watched
        })
        .catch(error => console.error('Error:', error));
    }

    function deleteMovie(movieId) {
        fetch(`${API_URL}/movieList/${movieId}`, {
            method: 'DELETE'
        })
        .then(() => {
            fetchMovies(); // Re-render the list after deletion
        })
        .catch(error => console.error('Error:', error));
    }

    function editMovie(movie) {
        const newTitle = prompt('Enter the new title for the movie:', movie.title);

        if (newTitle !== null && newTitle.trim() !== '') {
            fetch(`${API_URL}/movieList/${movie.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: newTitle })
            })
            .then(() => {
                fetchMovies(); // Re-render the list after editing
            })
            .catch(error => console.error('Error:', error));
        }
    }

    movieListButton.onclick = function() {
        movieModal.style.display = 'block';
        fetchMovies(); // Fetch movies when the modal opens
    }

    closeMovieModal.onclick = function() {
        movieModal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target === movieModal) {
            movieModal.style.display = 'none';
        }
    }

});
