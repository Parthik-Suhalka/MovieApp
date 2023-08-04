const API_KEY = '637526fb495fa4159cc28bf14a864c87';


async function fetchMovieDetails(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
}


async function fetchMovieTrailer(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const trailers = data.results.filter((video) =>
                ["Trailer"].includes(video.type)
            )
            if (trailers.length > 0) {
                return `https://www.youtube.com/embed/${trailers[0].key}`;
            }
        }
        return null;
    } catch (error) {
        console.error('Error fetching movie trailer:', error);
        return null;
    }
}


async function displayMovieDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (movieId){
        const movieDetails = await fetchMovieDetails(movieId);
        if (movieDetails) {
            const movieTrailer = document.getElementById('movieTrailer');
            const movieDetailsContainer = document.getElementById('movieDetails')
            const movieCast = document.getElementById('movieCast');

            movieDetailsContainer.innerHTML = `
            <h1 id="movieTitle">${movieDetails.title}</h1>
            <p class="tac">RELEASE DATE : ${movieDetails.release_date}</p>
            <p id="movieRating" class="tac">IMDB RATING : ${movieDetails.vote_average}</p>
            <p class="tac">DESCRIPTION : ${movieDetails.overview}</p>
            `;

            const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`;
            const creditsResponse = await fetch(creditsUrl);
            const creditsData = await creditsResponse.json();

            let cast = creditsData.cast
            cast = cast.slice(0, 14)

            movieCast.innerHTML = '';
            cast.forEach((castMember) => {
                const castCard = createCastCard(castMember);
                movieCast.appendChild(castCard);
            });

            const trailerLink = await fetchMovieTrailer(movieId);
            if (trailerLink) {
                const iframe = document.createElement('iframe');
                iframe.src = trailerLink;
                iframe.width = '600';
                iframe.height = '400';
                iframe.allowFullscreen = true;
                movieTrailer.appendChild(iframe);
            }
        }
    } else {
        console.error('Movie ID not found in URL parameters.');
    }
}


function createCastCard(castMember) {
    const castCard = document.createElement('div');

    castCard.classList.add(
        "movie-card",
        "data-cast");

    const castImage = document.createElement('img');
    castImage.src = `https://image.tmdb.org/t/p/w500${castMember.profile_path}`;
    castImage.alt = castMember.name;
    castImage.classList.add('img-fluid');

    const castName = document.createElement('h5');
    castName.classList.add('mt-3');
    castName.textContent = castMember.name;

    castCard.appendChild(castImage);
    castCard.appendChild(castName);

    return castCard;
}


displayMovieDetails();