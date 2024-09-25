'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const renderCountry = function (data, className = '') {
  //COUNTRY PROPERTIES

  // Fallback values if data is missing
  const flag = data.flags ? data.flags.svg : 'default-flag.png';
  const countryName = data.name ? data.name.common : 'N/A';
  const region = data.region || 'N/A';
  const population = data.population
    ? (data.population / 1000000).toFixed(2)
    : 'N/A';
  const language = data.languages ? Object.values(data.languages)[0] : 'N/A';
  const currency = data.currencies
    ? Object.values(data.currencies)[0].name
    : 'N/A';
  //HTML
  const html = `
      <article class="country ${className}">
        <img class="country__img" src="${flag}" />
        <div class="country__data">
          <h3 class="country__name">${countryName}</h3>
          <h4 class="country__region">${region}</h4>
          <p class="country__row"><span>👫</span>${population} people</p>
          <p class="country__row"><span>🗣️</span>${language}</p>
          <p class="country__row"><span>💰</span>${currency}</p>
        </div>
      </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};
/*
const getCountryAndNeighbour = function (country) {
  //ajax call 1 for main country:
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();
  request.addEventListener('load', function () {
    //NOTE:responseText is actually string in JSON format.Converting js object:
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    //render country:
    renderCountry(data);

    //get neighbours:
    const neighbours = data.borders[0];
    if (!neighbours) return;
    //ajax call 2 for neighbours:

    const request2 = new XMLHttpRequest();
    request2.open(
      'GET',
      `https://restcountries.com/v3.1/alpha/${neighbours}
      `
    );
    request2.send();
    request2.addEventListener('load', function () {
      const [data2] = JSON.parse(this.responseText);
      console.log(data2);

      //render country:
      renderCountry(data2, 'neighbour');
    });
  });
};

getCountryAndNeighbour('sakartvelo');

setTimeout(() => {
  console.log('1 second passed');
  setTimeout(() => {
    console.log('2 second passed');
    setTimeout(() => {
      console.log('3 second passed');
      setTimeout(() => {
        console.log('4 second passed');
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);

// getCountryAndNeighbour('armenia');
// getCountryDataAndNeighbourhood('azerbaijan');
*/

const getCountryData = function (country) {
  // Fetch country data
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(res => res.json())
    .then(data => {
      renderCountry(data[0]);
      console.log(data);
      const neighbour = data[0].borders[0];
      console.log(neighbour);
      if (!neighbour) return;
      // Country 2
      return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}
      `);
    })
    .then(res => {
      res.json();
    })
    .then(data => {
      renderCountry(data, 'neighbour');
    });
};

// Start fetching the country data for Sakartvelo
getCountryData('sakartvelo');
