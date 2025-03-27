const API_URL = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1'
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=eab119f4519b3c48189fd1039aea8fed&language=en-US&query="'


const form = document.getElementById('form')
const search = document.querySelector('.search')
const btn = document.querySelector('.btn')
const input = document.querySelector('.input')

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const searchTerm = input.value
if (searchTerm && searchTerm !== ''){
  getMovies(SEARCH_API + searchTerm)
  input.value = ''
} else {
  window.location.reload()
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
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYWIxMTlmNDUxOWIzYzQ4MTg5ZmQxMDM5YWVhOGZlZCIsIm5iZiI6MTczMzg5NTU2NS45Miwic3ViIjoiNjc1OTI1OGRkNWNmYTljODdkODkwMzdkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.sM6opl36s-j-fSrPdz4Iy0tThtl0yUoKjGBKHfXs-2w'
  }
}

getMovies(API_URL)

async function getMovies(url) {
  const res = await fetch(url, options)
  const data = await res.json()

  console.log(data.results)
}