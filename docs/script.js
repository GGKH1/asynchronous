'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const inputCountry = document.querySelector('.input-country'); // Input field for country name

///////////////////////////////////////

// Function to render country data
const renderCountry = function (data, className = '') {
  const countryData = Array.isArray(data) ? data[0] : data;

  const flag =
    countryData?.flags?.svg ||
    countryData?.flags?.png ||
    `https://flagcdn.com/${countryData.cca2.toLowerCase()}.svg`;
  const countryName = countryData?.name?.common || 'N/A';
  const region = countryData?.region || 'N/A';
  const population = countryData?.population
    ? (countryData.population / 1000000).toFixed(2)
    : 'N/A';

  const language = countryData?.languages
    ? Object.values(countryData.languages)[0]
    : 'N/A';
  const currency = countryData?.currencies
    ? Object.values(countryData.currencies)[0]?.name
    : 'N/A';

  const html = `
      <article class="country ${className}">
        <img class="country__img" src="${flag}" />
        <div class="country__data">
          <h3 class="country__name">${countryName}</h3>
          <h4 class="country__region">${region}</h4>
          <p class="country__row"><span>👫</span>${population} million people</p>
          <p class="country__row"><span>🗣️</span>${language}</p>
          <p class="country__row"><span>💰</span>${currency}</p>
        </div>
      </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
};

// Render error message
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

// Fetch JSON data and handle errors
const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(res => {
    if (!res.ok) throw new Error(`${errorMsg} (${res.status})`);
    return res.json();
  });
};

// Fetch country data based on the country input
const getCountryData = function (country) {
  // Clear previous country data
  countriesContainer.innerHTML = '';

  // Fetch main country data
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);

      // Check if there is a neighbor
      const neighbour = data[0].borders ? data[0].borders[0] : null;

      if (!neighbour) throw new Error('No neighbour found!');

      // Fetch neighbor country data
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        'Country not found'
      );
    })
    .then(data => {
      // Render neighbor country
      renderCountry(data, 'neighbour');
    })
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong 💥💥💥 ${err.message} Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

// Function to handle button click or 'Enter' key press
const handleCountrySearch = function () {
  const country = inputCountry.value;

  if (country) {
    getCountryData(country);
  } else {
    renderError('Please enter a country name!');
  }
};

// Event listener for the "Where Am I" button
btn.addEventListener('click', handleCountrySearch);

// Event listener for the 'Enter' key press
inputCountry.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    handleCountrySearch();
  }
});

// const getCountryData = function (country) {
//   // Fetch main country data
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     // .then(res => {
//     //   console.log(res);
//     //   if (!res.ok) throw new Error(`Country not found (${res.status})`);
//     //   return res.json();
//     // })
//     .then(data => {
//       // Render main country
//       renderCountry(data[0]);

//       // Check if there is a neighbor
//       const neighbour = data[0].borders ? data[0].borders[0] : null;

//       if (!neighbour) return;

//       // Fetch neighbor country data
//       return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
//     })
//     .then(res => {
//       if (!res.ok) throw new Error(`Country not found (${res.status})`);
//       return res.json();
//     })
//     .then(data => {
//       // Render neighbor country
//       renderCountry(data, 'neighbour');
//     })
//     .catch(err => {
//       console.error(`${err} 💥💥💥`);
//       renderError(`Something went wrong 💥💥💥 ${err.message}. Try again!`);
//     })
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });
// };

// getCountryAndNeighbour('sakartvelo');

//  const getCountryAndNeighbour = function (country) {
//   //ajax call 1 for main country:
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();
//   request.addEventListener('load', function () {
//     //NOTE:responseText is actually string in JSON format.Converting js object:
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);

//     //render country:
//     renderCountry(data);

//     //get neighbours:
//     const neighbours = data.borders[0];
//     if (!neighbours) return;
//     //ajax call 2 for neighbours:

//     const request2 = new XMLHttpRequest();
//     request2.open(
//       'GET',
//       `https://restcountries.com/v3.1/alpha/${neighbours}
//       `
//     );
//     request2.send();
//     request2.addEventListener('load', function () {
//       const [data2] = JSON.parse(this.responseText);
//       console.log(data2);

//       //render country:
//       renderCountry(data2, 'neighbour');
//     });
//   });
// };

/* 
Coding Challenge #1 
In this challenge you will build a function 'whereAmI' which renders a country 
only based on GPS coordinates. For that, you will use a second API to geocode 
coordinates. So in this challenge, you’ll use an API on your own for the first time 
�
� 
Your tasks: 
PART 1 
1. Create a function 'whereAmI' which takes as inputs a latitude value ('lat') 
and a longitude value ('lng') (these are GPS coordinates, examples are in test 
data below). 
2. Do “reverse geocoding” of the provided coordinates. Reverse geocoding means 
to convert coordinates to a meaningful location, like a city and country name. 
Use this API to do reverse geocoding: https://geocode.xyz/api. The AJAX call 
will be done to a URL with this format: 
https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and 
promises to get the data. Do not use the 'getJSON' function we created, that 
is cheating 
�
� 
3. Once you have the data, take a look at it in the console to see all the attributes 
that you received about the provided location. Then, using this data, log a 
message like this to the console: “You are in Berlin, Germany” 
4. Chain a .catch method to the end of the promise chain and log errors to the 
console 
5. This API allows you to make only 3 requests per second. If you reload fast, you 
will get this error with code 403. This is an error with the request. Remember, 
fetch() does not reject the promise in this case. So create an error to reject 
the promise yourself, with a meaningful error message 
PART 2 
6. Now it's time to use the received data to render a country. So take the relevant 
attribute from the geocoding API result, and plug it into the countries API that 
we have been using. 
7. Render the country and catch any errors, just like we have done in the last 
lecture (you can even copy this code, no need to type the same code) 
30 
The Complete JavaScript Course 
Test data: 
§ Coordinates 1: 52.508, 13.381 (Latitude, Longitude) 
§ Coordinates 2: 19.037, 72.873 
§ Coordinates 3: -33.933, 18.474 
GOOD LUCK 


const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

// HTML template
const renderCountry = function (data) {
  const html = `
    <article class="country">
      <img class="country__img" src="${data.flags.png}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          data.population / 1000000
        ).toFixed(1)} million people</p>
        <p class="country__row"><span>🗣️</span>${
          data.languages[Object.keys(data.languages)[0]]
        }</p>
        <p class="country__row"><span>💰</span>${
          data.currencies[Object.keys(data.currencies)[0]].name
        }</p>
      </div>
    </article>
  `;
  countriesContainer.innerHTML += html;
  countriesContainer.style.opacity = 1;
};

const getCountryData = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Country not found (${response.status})`);
      }
      return res.json();
    })
    .then(data => {
      renderCountry(data[0]);
    })
    .catch(err => {
      console.log(`${err} 💥💥💥`);
      countriesContainer.innerHTML = `<p>${err.message}<p>`;
    });
};

// Function to display the result on the screen
const whereAmI = function (lat, lng) {
  const apiKey = '868798ea49ce41ef957bd2787ecb87b2';
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

  fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Something went wrong ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log(data);
      const location = data.results[0].formatted;
      const country = data.results[0].components.country;
      console.log(`You are in ${location}`);
      console.log(`Country: ${country}`);

      // Fetch and render country details
      getCountryData(country);
    })
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      countriesContainer.innerHTML = `<p>${err.message}</p>`;
    });
};

// Event listener for button click
btn.addEventListener('click', function () {
  whereAmI(52.508, 13.381);
  countriesContainer.style.opacity = 1;
});

// Initial function call
whereAmI(52.508, 13.381);
whereAmI(19.037, 72.873);
whereAmI(-33.933, 18.474);

/*
§ Coordinates 1: 52.508, 13.381 (Latitude, Longitude) 
§ Coordinates 2: 19.037, 72.873 
§ Coordinates 3: -33.933, 18.474 
GOOD LUCK 
*/
