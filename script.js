'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

// https://countries-api-836d.onrender.com/countries/

// OLD SCHOOL ajax api call
const getCountryData = (country) => {
  // step 1: create object
  const request = new XMLHttpRequest();
  // step 2: make request to API
  request.open('GET', `https://restcountries.com/v2/name/${country}`);
  // step 3: send the request
  request.send();
  // step 4: wait for load event
  request.addEventListener('load', function () {
    console.log(this.responseText);
    // step 5: convert string to object
    const [data] = JSON.parse(this.responseText);
    console.log(data);
    // step 6: update html
    const html = `
  <article class="country">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)}M</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;
    // step 7: insert HTML
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  });
};

getCountryData('italy')
getCountryData('canada')
getCountryData('germany')
getCountryData('usa')