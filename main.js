const API_KEY = '637526fb495fa4159cc28bf14a864c87';



// Carousel Movies

function fetchcarouselmovies() {

  fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
    .then((response) => response.json())
    .then((data) => {

      const indicators = document.querySelector(".carousel-indicators");

      data = data.results.slice(0, 3)

      data.forEach((movie, index) => {
        const indicator = document.createElement("li");
        indicator.setAttribute("data-target", "#carouselExampleIndicators");
        indicator.setAttribute("data-slide-to", index);
        if (index === 0) {
          indicator.classList.add("active");
        }
        indicators.appendChild(indicator);

        const carouselInner = document.querySelector(".carousel-inner");
        const carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");
        if (index === 0) {
          carouselItem.classList.add("active");
        }
        const img = document.createElement("img");
        img.classList.add("d-block", "w-100");
        img.src = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
        img.alt = movie.title;

        img.addEventListener("click", () => {
          window.location.href = `movie.html?id=${movie.id}`;
        });

        carouselItem.style.background = "linear-gradient(#0d253f, #01b4e4, #90cea1)";

        carouselItem.appendChild(img);
        carouselInner.appendChild(carouselItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

fetchcarouselmovies();



// Popular Movies

const popularMoviesDiv = document.getElementById("popularMovies");

async function fetchPopularMovies() {
  let url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    popularMoviesDiv.innerHTML = "";

    data.results.forEach((movie) => {
      const movieCard = createMovieCard(movie);
      popularMoviesDiv.appendChild(movieCard);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchPopularMovies();



// Movie Cards

function createMovieCard(movie) {
  const movieCard = document.createElement("div");
  movieCard.classList.add(
    "col-lg-2",
    "col-md-3",
    "col-sm-3",
    "mb-4",
    "movie-card"
  );

  movieCard.addEventListener("click", () => {
    window.location.href = `movie.html?id=${movie.id}`;
  });

  const movieImage = document.createElement("img");
  movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  movieImage.alt = movie.title;
  movieImage.classList.add("img-fluid");
  movieImage.loading = "lazy";

  const movieTitle = document.createElement("h5");
  movieTitle.classList.add("mt-3");
  movieTitle.textContent = movie.title;

  const movieRate = document.createElement('div')
  movieRate.style.color = 'rgb(219, 165, 6)';
  movieRate.innerHTML = `<h5>IMDB Rating: ${movie.vote_average}</h5>`;

  const movieReleaseDate = document.createElement('div')
  movieReleaseDate.innerHTML = `<h5>Release: ${movie.release_date}</h5>`;

  movieCard.appendChild(movieImage);
  movieCard.appendChild(movieTitle);
  movieCard.append(movieRate);
  movieCard.appendChild(movieReleaseDate);

  return movieCard;
}



// All Movies

let page = 1;

async function fetchMovies(page) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&page=${page}`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}


async function loadAllMovies() {
  const movieCardContainer = document.getElementById('movieCardContainer');
  const movies = await fetchMovies(page);

  movies.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    movieCardContainer.appendChild(movieCard);
  });

  page++;
}



// Searched Movies

const searchResultsDiv = document.getElementById("searchResults");
document.getElementById('searchSection').style.display = "none";


async function searchMovies(query, searchPage) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${searchPage}`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching search results:', error);
    return [];
  }
}


let searchPage = 1;

document.getElementById('search-form').addEventListener('submit', (event) => {
  event.preventDefault()
  const searchInput = document.getElementById('search-input');
  const query = searchInput.value.trim();

  if (query === '') {
    alert('Please Enter a Movie Name.');
    return;
  }

  searchPage = 1;
  loadSearchResults(query, searchPage);
});


async function loadSearchResults(query, searchPage) {

  const movies = await searchMovies(query, searchPage);

  if (searchPage === 1) {
    searchResultsDiv.innerHTML = ""
    if (movies.length === 0) {
      document.getElementById('searchSection').style.display = "block";
      document.getElementById('trendingSection').style.display = 'none';
      document.getElementById('popularSection').style.display = 'none';
      searchResultsDiv.innerHTML = '<p>No Movies Found</p>';
      return;
    }
  }

  movies.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    searchResultsDiv.appendChild(movieCard);
  });

  document.getElementById('searchSection').style.display = "block";
  document.getElementById('trendingSection').style.display = 'none';
  document.getElementById('popularSection').style.display = 'none';
}



// On Window Scroll

window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {

    searchInput = document.getElementById('search-input');
    query = searchInput.value.trim();

    if (query !== '') {
      searchPage++;
      loadSearchResults(query, searchPage);
      return;
    }

    loadAllMovies();
  }
});



// Clear Button

document.getElementById('clearBtn').addEventListener('click', () => {
  document.getElementById('search-form').reset()
  document.getElementById('searchSection').style.display = "none";
  document.getElementById('trendingSection').style.display = 'block';
  document.getElementById('popularSection').style.display = 'block';
})