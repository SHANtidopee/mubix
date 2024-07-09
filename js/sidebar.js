'use strict';

import { api_key, fetchDataFromServer } from "./api.js";

export function sidebar() {

  /**
   * fetch all genres eg: [ {"id": "123", "name": "action"} ]
   * then change genre format eg: { 123: "Action" }
   */
  const genreList = {};

  fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function({ genres }) {

    for (const { id, name } of genres) {
      genreList[id] = name;
    }

    genreLink();

  });

  const sidebarInner = document.createElement('div');
  sidebarInner.classList.add("sidebar-inner");

  sidebarInner.innerHTML = `

  <div class="sidebar-list-main">
      <a href="./index.html" menu-close class="sidebar-link"><strong>HOME</strong></a>
      <a href="./watch-later.html" menu-close class="sidebar-link"><strong>WATCH LATER</a>
      <a href="./movie-list.html" menu-close class="sidebar-link" onclick='getMovieList("week", "Trending")'><strong>TRENDING</strong></a>
      <a href="./movie-list.html" menu-close class="sidebar-link" onclick='getMovieList("top_rated", "Top Rated")'><strong>TOP RATED</strong></a>
      <a href="./movie-list.html" menu-close class="sidebar-link" onclick='getMovieList("upcoming", "Upcoming")'><strong>UPCOMING</strong></a>
    </div>

  
  <div class="sidebar-list">
      <p class="title-sidebar">GENRE</p>
    </div>

  
    <div class="sidebar-list">
      <p class="title-sidebar"><br>COUNTRY</p>
      <a href="./movie-list.html" menu-close class="sidebar-link" onclick='getMovieList("with_original_language=tl", "Philippines")'>Filipino</a>
      <a href="./movie-list.html" menu-close class="sidebar-link" onclick='getMovieList("with_original_language=en", "US")'>English</a>
      <a href="./movie-list.html" menu-close class="sidebar-link" onclick='getMovieList("with_original_language=hi", "India")'>Hindi</a>
    </div>

    <div class="sidebar-footer">
      <p class="copyright">
        &copy; 2023 <br><a href="">Sunga</a><br>
      </p>
      <a href="https://www.themoviedb.org"><img class="tmdb" src="./assets/images/tmdb-logo.svg" alt="the movie database logo" > </a> 
    </div>
  `;

  const genreLink = function() {
    for (const [genreId, genreName] of Object.entries(genreList)) {
      const link = document.createElement("a");
      link.classList.add("sidebar-link");
      link.setAttribute("href", "./movie-list.html");
      link.setAttribute("menu-close", "");
      link.setAttribute("onclick", `getMovieList("with_genres=${genreId}", "${genreName}")`);
      link.textContent = genreName;

      sidebarInner.querySelectorAll(".sidebar-list")[0].appendChild(link);
    }

    const sidebar = document.querySelector("[sidebar]");
    sidebar.appendChild(sidebarInner);
    toggleSidebar(sidebar);
  };

  const toggleSidebar = function(sidebar) {
    /**
     * Toggle sidebar in mobile screen mode
     */
  
    const sidebarBtn = document.querySelector("[menu-btn]");
    const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
    const sidebarClose = document.querySelector("[menu-close]");
    const overlay = document.querySelector("[overlay]");
  
    sidebarTogglers.forEach(function(toggler) {
      toggler.addEventListener("click", function() {
        sidebar.classList.toggle("active");
        sidebarClose.classList.toggle("active");
        sidebarBtn.classList.toggle("active");
        overlay.classList.toggle("active");
  
        if (sidebar.classList.contains("active")) {
          sidebar.style.transition = "transform 0.5s ease-out";
        } else {
          sidebar.style.transition = "transform 0.5s ease-out, opacity 0.5s ease-out";
        }
      });
    });
  
    sidebarClose.addEventListener("click", function() {
      sidebar.classList.remove("active");
      sidebarClose.classList.remove("active");
      sidebarBtn.classList.remove("active");
      overlay.classList.remove("active");
      sidebar.style.transition = "transform 0.5s ease-out, opacity 0.5s ease-out";
    });
  };
  
  const sidebar = document.getElementById("mySidenav");
  toggleSidebar(sidebar);
  

}
