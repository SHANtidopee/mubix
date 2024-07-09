'use strict';

/* Add event on multiple elements */

const addEventOnElements = function (elements, eventType, callback) {
    if(elements.length > 1) {
        for (const element of elements) {
            element.addEventListener(eventType, callback);
        }
    } else {
        elements.addEventListener(eventType, callback);
    }
}

/* Toggle search box in mobile devices || small device */

const searchBox = document.querySelector("[search-box]");
const searchTogglers = document.querySelectorAll("[search-toggler]");

addEventOnElements(searchTogglers, "click", function () {
    searchBox.classList.toggle("active");
})

/*store movieId in `localStorage` when you click any movie card */

const getMovieDetail = function(movieId) {
    window.localStorage.setItem("movieId", String(movieId));
}

const getMovieList = function(urlParam, genreName) {
    window.localStorage.setItem("urlParam", urlParam);
    window.localStorage.setItem("genreName", String(genreName));
}