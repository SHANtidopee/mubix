'use strict';

const api_key = 'fbc84e15811e45b15a243cd5e5b2451e';
const imageBaseUrl = 'https://image.tmdb.org/t/p/';

/* fetch data from a server using 'url' passes
the result in JSON data to a 'callback' function, 
along with an optional parameter if has 'optionalParam'*/

const fetchDataFromServer = function(url, callback, optionalParameters) {
    fetch(url)
    .then(response => response.json())
    .then(data => callback(data, optionalParameters));
}

export { imageBaseUrl, api_key, fetchDataFromServer };