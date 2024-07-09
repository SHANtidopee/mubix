'use strict';

import { api_key, imageBaseUrl, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { search } from "./search.js";

const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");
const movieContainer = document.querySelector(".movie-container");

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

// return only trailers and teasers as array
const filterVideos = function (videoList) {
  const clipVideo = videoList.find(({ type }) => type === "Trailer");
  return clipVideo ? [clipVideo] : [];
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`,
  function (movie) {
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
            certification,
          },
        ],
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
      <div class="backdrop-image" style="background-image: url('${
        imageBaseUrl + ("w1280" || "original") + (backdrop_path || poster_path)
      }')"></div>
      
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
                  
                  
                  <p class="overview">
                      ${overview}
                  </p>

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
              <h3 class="title-large">MOVIE</h3>
          </div>

          <div class="slider-list">
          
              <div class="slider-inner-video"></div>
              
          </div>

      </div>
    `;

    pageContent.appendChild(movieDetail);


    for (const { name } of filterVideos(videos)) {
      const videoLink = getVideoLink(movieId);

      const videoCard = document.createElement("div");
      videoCard.classList.add("video-card");

      if (videoLink) {
        videoCard.innerHTML = `
          <iframe width="495" height="290" src="${videoLink}" frameborder="0" allowfullscreen="1" title="${name}" class="img-cover" loading="lazy"></iframe>
        `;
      } else {
        videoCard.innerHTML = `<p class="message" ><br> <br> <br> <br> <br>Movie Unavailable<br> <br> <br> <br> <br> <br></p>`;
      }

      movieDetail.querySelector(".slider-inner-video").appendChild(videoCard);
    }
  }
);

const getVideoLink = function (movieId) {
  // Provide the specified video link for the specified ID
  if (movieId === "603692") {
    return "https://doc.viload.org/watch/?v21#bldRZGdEeWFrYlNiNkJkeXdWMWJOdVZ0UmhLTUhaR29PWVpyTlB0cmFhT3Zoam9JWEFTamJVZXE5dGNOWG5qSGx2R3Fvbmo0MVRVPQ";
  } else if (movieId === "502356") {
    return "https://doc.viload.org/watch/?v21#ZnJnVFcxR2xmaC9OemFjbC92WFF1NWduOFBDVG8vNXpoWVFBRWRvOGowS0Z6VkIwOEJtdHYxbWtqL05hZFBsVHE2UjYva014bUw4PQ";
  } else if (movieId === "385687") {
    return "https://doc.viload.org/watch/?v21#Q21UcTJzeTAxc2daK0RpQzR6VHljSnN1TVdVZjNLcTBMU2NEaWEwQXdXZXB2NEtIRWdtaklnT1lNamhORmNvWDR3dW5jZzZEdTRBPQ";
  }

  return null;
};

search();
