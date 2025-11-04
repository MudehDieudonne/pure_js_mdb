const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMG_PATH = import.meta.env.VITE_TMDB_IMG_URL;

const API_URL = `${BASE_URL}/movie/now_playing?language=en-US&page=1&api_key=${API_KEY}`;
const SEARCH_API = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query="`;
const API_POPULAR = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
const API_UPCOMING = `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`;

console.log("API_KEY:", API_KEY);
const form = document.getElementById('form');
const search = document.querySelector('.search');
const btn = document.querySelector('.btn');
const input = document.querySelector('.input');
const next = document.getElementById('next');
const prev = document.getElementById('prev');

let items;
let thumbnails;
let watchList = JSON.parse(localStorage.getItem('watchList')) || [];
let likedMovies = JSON.parse(localStorage.getItem('likedMovies')) || [];

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYWIxMTlmNDUxOWIzYzQ4MTg5ZmQxMDM5YWVhOGZlZCIsIm5iZiI6MTczMzg5NTU2NS45Miwic3ViIjoiNjc1OTI1OGRkNWNmYTljODdkODkwMzdkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.sM6opl36s-j-fSrPdz4Iy0tThtl0yUoKjGBKHfXs-2w',
  },
};

// Initial Fetches & UI Updates
getMovies(API_URL);
getPopularMovies(API_POPULAR);
getUpcomingMovies(API_UPCOMING);
updateWatchlistUI();
updateLikelistUI();

// Event Listeners
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = input.value;
  if (searchTerm && searchTerm.trim() !== '') {
    getPopularMovies(SEARCH_API + searchTerm);
    input.value = '';
  } else {
    getMovies(API_URL);
  }
});

btn.addEventListener('click', () => {
  search.classList.toggle('active');
  input.focus();
});

// Generic Fetch Function
async function fetchMovies(url) {
    try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        return data.results;
    } catch (error) {
        console.error("Failed to fetch movies:", error);
        return [];
    }
}

async function getMovies(url) {
  const movies = await fetchMovies(url);
  displayMovies(movies);
}

async function getPopularMovies(url) {
  const movies = await fetchMovies(url);
  displayMovieCards(movies, '.movie-container');
}

async function getUpcomingMovies(url) {
  const movies = await fetchMovies(url);
  displayMovieCards(movies, '.upcoming-movie-container');
}

// Hero Slider Logic remains the same...
let countItem = 0;
let itemActive = 0;
let refInterval = setInterval(() => { if(next) next.click() }, 5000);

function showSlider() {
  if (!items || items.length === 0 || !thumbnails || thumbnails.length === 0) return;

  let oldActiveItem = document.querySelector('.hero-slider .hero-list .hero-item.active');
  let oldThumActive = document.querySelector('.thumbnail .thum-item.active');

  if (oldActiveItem) oldActiveItem.classList.remove('active');
  if (oldThumActive) oldThumActive.classList.remove('active');

  items[itemActive].classList.add('active');
  thumbnails[itemActive].classList.add('active');

  clearInterval(refInterval);
  refInterval = setInterval(() => { if(next) next.click() }, 5000);
}

function displayMovies(movies) {
  const heroList = document.querySelector('.hero-list');
  const thumbnailList = document.querySelector('.thumbnail');

  if (!heroList || !thumbnailList) return;

  heroList.innerHTML = '';
  thumbnailList.innerHTML = '';

  movies.slice(0, 15).forEach((movie, index) => {
    const movieItem = document.createElement('div');
    movieItem.classList.add('hero-item');
    if (index === 0) movieItem.classList.add('active');
    movieItem.innerHTML = `
      <img src="${IMG_PATH + movie.backdrop_path}" alt="${movie.title}">
      <div class="content">
        <p>${movie.original_language}</p>
        <h2>${movie.title}</h2>
        <p>${movie.overview}</p>
      </div>
    `;
    heroList.appendChild(movieItem);

    const thumbItem = document.createElement('div');
    thumbItem.classList.add('thum-item');
    if (index === 0) thumbItem.classList.add('active');
    thumbItem.innerHTML = `<img src="${IMG_PATH + movie.poster_path}" alt="${movie.title} thumbnail">`;
    thumbnailList.appendChild(thumbItem);
  });

  items = document.querySelectorAll('.hero-slider .hero-list .hero-item');
  thumbnails = document.querySelectorAll('.thumbnail .thum-item');
  countItem = items.length;
  itemActive = 0;
  showSlider();

  if (next && prev) {
    next.onclick = () => {
      itemActive = (itemActive + 1) % countItem;
      showSlider();
    };
    prev.onclick = () => {
      itemActive = (itemActive - 1 + countItem) % countItem;
      showSlider();
    };
  }

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      itemActive = index;
      showSlider();
    });
  });
}

function displayMovieCards(movies, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    if (movies.length === 0 && (containerSelector === '.your-likes-container' || containerSelector === '.watchlist-movie-container')) {
        container.innerHTML = `<p style="padding-left: 10px; color: #888;">This list is empty.</p>`;
        return;
    }

    container.innerHTML = '';
    movies.forEach(movie => {
        const isWatchlisted = watchList.some(wlMovie => wlMovie.id === movie.id);
        const isLiked = likedMovies.some(lkMovie => lkMovie.id === movie.id);
        
        // Create an anchor tag to wrap the card
        const movieLink = document.createElement('a');
        movieLink.href = `./details.html?id=${movie.id}`;
        movieLink.classList.add('movie-card-link');

        movieLink.innerHTML = `
            <div class="movie-card">
                <button class="like-icon ${isLiked ? 'like-icon-active' : ''}" data-movie-id=${movie.id}>
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z"/></svg>
                </button>
                <button class="add-to-watchlist-btn ${isWatchlisted ? 'active' : ''}" data-movie-id=${movie.id}>
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M7.833 2c-.507 0-.98.216-1.318.576A1.92 1.92 0 0 0 6 3.89V21a1 1 0 0 0 1.625.78L12 18.28l4.375 3.5A1 1 0 0 0 18 21V3.889c0-.481-.178-.954-.515-1.313A1.808 1.808 0 0 0 16.167 2H7.833Z"/></svg>
                </button>
                <div class="movie-poster">
                    <img src="${movie.poster_path ? IMG_PATH + movie.poster_path : 'https://via.placeholder.com/250x340'}" alt="${movie.title}">
                </div>
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <p class="movie-rating">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"/></svg>
                        ${movie.vote_average.toFixed(1)}
                    </p>
                </div>
            </div>
        `;
        container.appendChild(movieLink);
    });
    addCardButtonListeners(container, movies); 
}

function addCardButtonListeners(container, movies) {
  container.querySelectorAll('.add-to-watchlist-btn').forEach(button => {
    if (button.onclick) return; 
    button.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const movieId = parseInt(button.dataset.movieId);
      const movieIndex = watchList.findIndex(movie => movie.id === movieId);

      if (movieIndex > -1) {
        watchList.splice(movieIndex, 1);
        button.classList.remove('active');
      } else {
        const movieToAdd = movies.find(movie => movie.id === movieId);
        if (movieToAdd) {
            watchList.push(movieToAdd);
            button.classList.add('active');
        }
      }
      localStorage.setItem('watchList', JSON.stringify(watchList));
      updateWatchlistUI();
    };
  });

  container.querySelectorAll('.like-icon').forEach(button => {
    if (button.onclick) return;
    button.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const movieId = parseInt(button.dataset.movieId);
        const movieIndex = likedMovies.findIndex(movie => movie.id === movieId);

        if (movieIndex > -1) {
            likedMovies.splice(movieIndex, 1);
            button.classList.remove('like-icon-active');
        } else {
            const movieToAdd = movies.find(movie => movie.id === movieId);
            if (movieToAdd) {
                likedMovies.push(movieToAdd);
                button.classList.add('like-icon-active');
            }
        }
        localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
        updateLikelistUI();
    };
  });
}

function updateWatchlistUI() {
  displayMovieCards(watchList, '.watchlist-movie-container');
}

function updateLikelistUI() {
  displayMovieCards(likedMovies, '.your-likes-container');
}
