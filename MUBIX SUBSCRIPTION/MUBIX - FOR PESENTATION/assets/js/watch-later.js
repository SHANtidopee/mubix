'use strict';

import { api_key, fetchDataFromServer, imageBaseUrl } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";
import { sidebar } from "./sidebar.js";

document.title = `Your List - MUBIX`;

const pageContent = document.querySelector("[page-content]");

sidebar();

const watchLaterList = JSON.parse(localStorage.getItem("watchLater")) || [];
const movieListElem = document.createElement('section');
movieListElem.classList.add("movie-list");
movieListElem.innerHTML = `
  <div class="title-wrapper">
    <h1 class="heading">Your List . . .</h1>
  </div>
  <div class="sort-wrapper">
    <label for="sort-select" class="sort-label">Sort By : </label>
    <select id="sort-select" class="sort-select">
      <option value="release_date">Release Date</option>
      <option value="az">A to Z</option>
      <option value="za">Z to A</option>
    </select><br>
  </div>
  <div class="grid-list"></div>
`;

const gridListContainer = movieListElem.querySelector(".grid-list");
const sortSelectElem = movieListElem.querySelector("#sort-select");

if (watchLaterList.length === 0) {
  const emptyMessageElem = document.createElement('p');
  emptyMessageElem.textContent = "No movies added to Watch Later.";
  gridListContainer.appendChild(emptyMessageElem);
} else {
  const addedMovieIds = new Set(watchLaterList);

  const fetchMovieDetails = async (movieId) => {
    const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}`;
    try {
      const response = await fetch(movieUrl);
      const movie = await response.json();
      const movieCard = createMovieCard(movie);
  
      // Create remove button
      const removeButton = document.createElement('a');
      removeButton.classList.add('btn', 'btn-remove', 'watch-later');
      removeButton.innerHTML = `
        <a href="#" class="btn-remove">
          <img src="./assets/images/remove.png" width="24" height="24" aria-hidden="true" alt="remove">
          <span class="span">Remove</span>
        </a>
      `;
      removeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const confirmRemove = confirm("Are you sure you want to remove this movie from Watch Later?");
        if (confirmRemove) {
          removeFromWatchLater(movieId);
          const movieCardContainer = event.target.closest('.movie-card-container');
          if (movieCardContainer) {
            movieCardContainer.remove();
          }
        }
      });
  
      // Create button container and append the remove button
      const buttonContainer = document.createElement('div');
      buttonContainer.appendChild(removeButton);
  
      // Append movie card and button container to grid list container
      const movieCardContainer = document.createElement('div');
      movieCardContainer.classList.add('movie-card-container');
      movieCardContainer.appendChild(movieCard);
      movieCardContainer.appendChild(buttonContainer);
      gridListContainer.appendChild(movieCardContainer);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };
  

  const fetchAllMovies = async () => {
    for (const movieId of addedMovieIds) {
      await fetchMovieDetails(movieId);
    }
  };

  const sortMovies = (option) => {
    const movieCards = Array.from(gridListContainer.querySelectorAll('.movie-card-container'));
  
    movieCards.sort((a, b) => {
      const movieA = a.querySelector('.movie-card').dataset.title;
      const movieB = b.querySelector('.movie-card').dataset.title;
      const releaseDateA = new Date(a.querySelector('.movie-card').dataset.releaseDate);
      const releaseDateB = new Date(b.querySelector('.movie-card').dataset.releaseDate);
  
      if (option === 'az') {
        return movieA && movieB ? movieA.toLowerCase().localeCompare(movieB.toLowerCase()) : 0;
      } else if (option === 'za') {
        return movieA && movieB ? movieB.toLowerCase().localeCompare(movieA.toLowerCase()) : 0;
      } else if (option === 'release_date') {
        return releaseDateA - releaseDateB;
      }
  
      return 0;
    });
  
    // Clear the current grid list
    gridListContainer.innerHTML = '';
  
    // Append sorted movie cards to the grid list
    movieCards.forEach((card) => {
      gridListContainer.appendChild(card);
    });
  };
  
  

  // Event listener for sort select
  sortSelectElem.addEventListener('change', (event) => {
    const selectedOption = event.target.value;
    sortMovies(selectedOption);
  });

  // Set the default sort order to "Release Date"
  sortMovies('release_date');

  fetchAllMovies();
}

// Remove movie from watchLaterList and update the UI
const removeFromWatchLater = (movieId) => {
  const updatedWatchLaterList = watchLaterList.filter((id) => id !== movieId);
  localStorage.setItem("watchLater", JSON.stringify(updatedWatchLaterList));
  console.log("Movie removed from Watch Later:", movieId);
};

pageContent.appendChild(movieListElem);

search();
