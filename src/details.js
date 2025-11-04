const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const API_KEY = import.meta.env.VITE_API_KEY;

const detailsContainer = document.getElementById('movie-details-container');
const form = document.getElementById('form');

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYWIxMTlmNDUxOWIzYzQ4MTg5ZmQxMDM5YWVhOGZlZCIsIm5iZiI6MTczMzg5NTU2NS45Miwic3ViIjoiNjc1OTI1OGRkNWNmYTljODdkODkwMzdkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.sM6opl36s-j-fSrPdz4Iy0tThtl0yUoKjGBKHfXs-2w',
  },
};

// Get movie ID from URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

async function fetchMovieDetails(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`;
    try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        displayMovieDetails(data);
    } catch (error) {
        console.error("Failed to fetch movie details:", error);
        detailsContainer.innerHTML = `<p class="error-message">Could not load movie details. Please try again later.</p>`;
    }
}

function displayMovieDetails(movie) {
    detailsContainer.innerHTML = '';

    const movieEl = document.createElement('div');
    movieEl.classList.add('movie-detail-card');

    const genres = movie.genres.map(genre => `<span>${genre.name}</span>`).join('');

    movieEl.innerHTML = `
        <div class="detail-backdrop" style="background-image: url('${IMG_PATH + movie.backdrop_path}')"></div>
        <div class="detail-content">
            <div class="detail-poster">
                <img src="${movie.poster_path ? IMG_PATH + movie.poster_path : 'https://via.placeholder.com/300x450'}" alt="${movie.title}">
            </div>
            <div class="detail-info">
                <h1>${movie.title} (${new Date(movie.release_date).getFullYear()})</h1>
                <p class="tagline"><em>${movie.tagline}</em></p>
                <div class="genres">${genres}</div>
                <div class="rating-runtime">
                    <p class="movie-rating">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"/></svg>
                        <b>${movie.vote_average.toFixed(1)}</b> / 10
                    </p>
                    <p class="runtime">${movie.runtime} minutes</p>
                </div>
                <h3>Overview</h3>
                <p class="overview">${movie.overview}</p>
            </div>
        </div>
    `;

    detailsContainer.appendChild(movieEl);
}


if (movieId) {
    fetchMovieDetails(movieId);
} else {
    detailsContainer.innerHTML = `<p class="error-message">No movie ID provided.</p>`;
}
