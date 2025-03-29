const API_URL = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1'
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=eab119f4519b3c48189fd1039aea8fed&language=en-US&query="'
const API_POPULAR = 'https://api.themoviedb.org/3/movie/popular?api_key=eab119f4519b3c48189fd1039aea8fed&language=en-US&page=1'
const API_UPCOMING = 'https://api.themoviedb.org/3/movie/upcoming?api_key=eab119f4519b3c48189fd1039aea8fed&language=en-US&page=1'

const form = document.getElementById('form')
const search = document.querySelector('.search')
const btn = document.querySelector('.btn')
const input = document.querySelector('.input')
const next = document.getElementById('next')
const prev = document.getElementById('prev')

let items 
let thumbnails

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const searchTerm = input.value
  if (searchTerm && searchTerm !== '') {
    getMovies(SEARCH_API + searchTerm)
    input.value = ''
  } else {
    getMovies(API_URL)
  }
})

btn.addEventListener('click', () => {
  search.classList.toggle('active')
  input.focus()
})

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYWIxMTlmNDUxOWIzYzQ4MTg5ZmQxMDM5YWVhOGZlZCIsIm5iZiI6MTczMzg5NTU2NS45Miwic3ViIjoiNjc1OTI1OGRkNWNmYTljODdkODkwMzdkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.sM6opl36s-j-fSrPdz4Iy0tThtl0yUoKjGBKHfXs-2w',
  },
}

getMovies(API_URL)
getPopularMovies(API_POPULAR)

async function getMovies(url) {
  const res = await fetch(url, options)
  const data = await res.json()

  displayMovies(data.results)
}

async function getPopularMovies(url) {
  const res = await fetch(url, options)
  const data = await res.json()

  displayPopularMovies(data.results)
}

let countItem = 0
let itemActive = 0
function showSlider() {
  if (!items || items.length === 0 || !thumbnails || thumbnails.length === 0) return
  //remove Item active from old Item
  let oldActiveItem = document.querySelector('.hero-slider  .hero-list .hero-item.active')
  let oldThumActive = document.querySelector('.thumbnail .thum-item.active')

  if (oldActiveItem) {
    oldActiveItem.classList.remove('active')
  }
  if (oldThumActive) {
    oldThumActive.classList.remove('active')
  }
  // asign the active class to the new location
  items[itemActive].classList.add('active')
  thumbnails[itemActive].classList.add('active')
}

function displayMovies(movies) {
  const heroList = document.querySelector('.hero-list')
  const thumbnailList = document.querySelector('.thumbnail')

  if (!heroList || !thumbnailList) {
    console.error("hero-list or thumbnail element not found in HTML")
    return
  }
  heroList.innerHTML = ''
  thumbnailList.innerHTML = ''

  movies.forEach((movie, index) => {
    const movieItem = document.createElement('div')
    movieItem.classList.add('hero-item')
    if (index === 0) movieItem.classList.add('active')
    movieItem.innerHTML = `
          <img src="${IMG_PATH + movie.backdrop_path}" alt="${movie.title}}">
          <div class="content">
            <p>${movie.original_language}</p>
            <h2>${movie.title}</h2>
            <p>${movie.overview}</p>
          </div>
        `
    heroList.appendChild(movieItem)

    const thumbItem = document.createElement('div')
    thumbItem.classList.add('thum-item')
    if (index === 0) thumbItem.classList.add('active')
    thumbItem.innerHTML = `<img src="${IMG_PATH + movie.poster_path}" alt="${movie.title} thumbnail">`
    thumbnailList.appendChild(thumbItem)
  })

  // Update the global variables.
  items = document.querySelectorAll('.hero-slider .hero-list .hero-item')
  thumbnails = document.querySelectorAll('.thumbnail .thum-item')
  countItem = items.length
  itemActive = 0
  showSlider()
  if (next && prev) {
    next.addEventListener('click', () => {
      itemActive += 1
      if (itemActive >= countItem) {
        itemActive = 0
      }
      showSlider()
    })

    prev.addEventListener('click', () => {
      itemActive -= 1
      if (itemActive < 0) {
        itemActive = countItem - 1
      }
      showSlider()
    })
  }

  //click thumnail
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      itemActive = index
      showSlider()
    })
  })
}

//Popular section
function displayPopularMovies(movies) {
  const popularList = document.querySelector('.movie-container')
  if(!popularList){
    console.error('Popular list element not found in html')
  }
  popularList.innerHTML = ''
  if (!Array.isArray(movies)) {
    console.error("Movies is not an array:", movies);
    return;
  }

  if (!movies || movies.length === 0) {
    console.warn("Movies array is empty");
    return;
  }

  movies.forEach((movie, index) => {
    const movieItem = document.createElement('div')
    movieItem.classList.add('movie-card')

    movieItem.innerHTML = `
      <div class="movie-poster">
        <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}" >
      </div>
      <div class="movie-info">
        <h3 class="movie-title">${movie.title}</h3>
        <p class="movie-rating">
          <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z"/>
          </svg> 
        ${movie.vote_average}</p>
      </div>
    `
    popularList.appendChild(movieItem)
  })
}
