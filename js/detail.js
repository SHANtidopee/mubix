'use strict';

import { api_key, imageBaseUrl, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");

sidebar();

const getGenres = function (genreList) {
  const newGenreList = [];

  for (const { name } of genreList) newGenreList.push(name);

  return newGenreList.join(", ");
};

const getCasts = function (castList) {
  const newCastList = [];

  for (let i = 0, len = castList.length; i < len && i < 10; i++) {
    const { name } = castList[i];
    newCastList.push(name);
  }

  return newCastList.join(", ");
};

const getDirectors = function (crewList) {
  const directors = crewList.filter(({ job }) => job === "Director");

  const directorList = [];
  for (const { name } of directors) directorList.push(name);

  return directorList.join(", ");
};

const filterVideos = function (videoList) {
  return videoList.filter(({ type, site }) => (type === "Trailer" || type === "Teaser") && site === "YouTube");
};

fetchDataFromServer(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`, function(movie) {

  const {
    backdrop_path,
    poster_path,
    title,
    release_date,
    runtime,
    vote_average,
    releases: {
      countries: [
        {
          certification
        }
      ]
    },
    genres,
    overview,
    casts: { cast, crew },
    videos: { results: videos },
  } = movie;

  document.title = `${title} - MUBIX`;

  const movieDetail = document.createElement("div");
  movieDetail.classList.add("movie-detail");

  movieDetail.innerHTML = `
    <div class="backdrop-image" style="background-image: url('${imageBaseUrl}${"w1280" || "original"}${backdrop_path || poster_path}')"></div>
    
    <figure class="poster-box movie-poster">
      <img src="${imageBaseUrl}w342${poster_path}" alt="${title}" class="img-cover">
    </figure>

    <div class="detail-box">
      <div class="detail-content">
        <h1 class="heading">${title}</h1>
        <div class="meta-list">
          <div class="meta-item">
            <img src="./assets/images/star.png" width="20" height="20" alt="rating">
            <span class="span">${vote_average.toFixed(1)}</span>
          </div>
          <div class="separator"></div>
          <div class="meta-item">${runtime}m</div>
          <div class="separator"></div>
          <div class="meta-item">${release_date}</div>
          <div class="meta-item card-badge">${certification}</div>
          <p class="genre">${getGenres(genres)}</p>
          <p class="overview">${overview}</p>
          <ul class="detail-list">
            <div class="list-item">
              <p class="list-name">STARRING: </p>
              <p>${getCasts(cast)}</p>
            </div>
            <div class="list-item">
              <p class="list-name">DIRECTED BY: </p>
              <p>${getDirectors(crew)}</p>
            </div>
          </ul>
        </div>
      </div>
      
      <div class="title-wrapper">
        <a href="#" class="btn btn-add watch-later" onclick="addToWatchLater()">
          <img src="./assets/images/add.png" width="24" height="24" aria-hidden="true" alt="play">
          <span class="span">Watch Later</span>
        </a>
      </div>

      <div class="title-wrapper">
        <h3 class="title-large">Trailers and Clips</h3>
      </div>

      <div class="slider-list">
        <div class="slider-inner-video"></div>
      </div>
    </div>
  `;

  for (const { key, name } of filterVideos(videos)) {
    const videoCard = document.createElement("div");
    videoCard.classList.add("video-card");

    videoCard.innerHTML = `
      <iframe width="495" height="290" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0" frameborder="0" allowfullscreen="1" title="${name}" class="img-cover" loading="lazy"></iframe>
    `;

    movieDetail.querySelector(".slider-inner-video").appendChild(videoCard);
  }

  pageContent.appendChild(movieDetail);

  fetchDataFromServer(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`, addSuggestedMovies);


  const watchLaterButton = movieDetail.querySelector(".watch-later");
  watchLaterButton.addEventListener("click", addToWatchLater);
});


const addToWatchLater = function(event) {
  const movieId = window.localStorage.getItem("movieId");
  const watchLaterList = JSON.parse(localStorage.getItem("watchLater")) || [];

  if (watchLaterList.includes(movieId)) {
    alert("Movie is already added to Watch Later");
  } else {
    watchLaterList.push(movieId);
    localStorage.setItem("watchLater", JSON.stringify(watchLaterList));
    console.log("Movie added to Watch Later:", watchLaterList);
    alert("Movie added to Watch Later");

    fetchMovieDetails(movieId); // Fetch and display the movie details
  }

  event.preventDefault();
};



  
  const addSuggestedMovies = function({ results: movieList }) {

    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list");
    movieListElem.ariaLabel = `You May Also Like`;

    movieListElem.innerHTML = `
    <div class="title-wrapper">
        <h3 class="title-large">You May Also Like</h3>
    </div>

    <div class="slider-list">
        <div class="slider-inner"></div>
    </div>
    `;

    for(const movie of movieList) {
        const movieCard = createMovieCard(movie); // called from component movie_card.js

        movieListElem.querySelector(".slider-inner").appendChild(movieCard);
    }

    pageContent.appendChild(movieListElem);

}


search();
