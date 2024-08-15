document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000/movies';
    
    // Custom cursor
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // Fetch and display movies
    function fetchMovies() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(movies => {
                movies.sort((a, b) => a.watched - b.watched); // Sort by watched status
                const movieList = document.getElementById('movieList');
                movieList.innerHTML = '';
                movies.forEach(movie => addMovieToList(movie));
            })
            .catch(error => console.error('Error:', error));
    }

    // Add movie to list
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

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteMovie(movie.id));
        movieActions.appendChild(deleteButton);

        li.appendChild(movieInfo);
        li.appendChild(movieActions);
        movieList.appendChild(li);
    }

    // Add a new movie
    document.getElementById('movieForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;

        if (title.trim() === '') return;

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, watched: false })
        })
        .then(response => response.json())
        .then(movie => {
            addMovieToList(movie);
            document.getElementById('movieForm').reset();
        })
        .catch(error => console.error('Error:', error));
    });

    // Mark a movie as watched
    function markAsWatched(movieId) {
        fetch(`${apiUrl}/${movieId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ watched: true })
        })
        .then(response => response.json())
        .then(() => {
            fetchMovies(); // Re-render the list after marking as watched
        })
        .catch(error => console.error('Error:', error));
    }

    // Delete a movie
    function deleteMovie(movieId) {
        fetch(`${apiUrl}/${movieId}`, {
            method: 'DELETE'
        })
        .then(() => {
            fetchMovies(); // Re-render the list after deletion
        })
        .catch(error => console.error('Error:', error));
    }

    // Initial fetch to populate the list
    fetchMovies();
});
