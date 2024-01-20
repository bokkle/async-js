'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

// https://countries-api-836d.onrender.com/countries/

// OLD SCHOOL ajax api call
/*
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

getCountryData('italy');
getCountryData('canada');
getCountryData('germany');
getCountryData('usa');
*/

// 'CALLBACK HELL'
// a lot of nested call callbacks
// hard to read and maintain

const renderError = (msg) => {
  countriesContainer.insertAdjacentText('beforeend', msg);
  //   countriesContainer.style.opacity = 1;
};

const renderCountry = (data, className = '') => {
  const html = `
  <article class="country ${className}">
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
  countriesContainer.insertAdjacentHTML('beforeend', html);
  //   countriesContainer.style.opacity = 1;
};

/*
const getCountryAndNeighbour = (country) => {
  // AJAX call country 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v2/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    //render country 1
    renderCountry(data);

    // get neighbour country
    const neighbour = data.borders?.[0];

    // AJAX CALL COUNTRY 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`);
    request2.send();

    request2.addEventListener('load', function () {
      const data2 = JSON.parse(this.responseText);
      console.log(data2);

      renderCountry(data2, 'neighbour');
    });
  });
};

// getCountryAndNeighbour('portugal');
getCountryAndNeighbour('italy');
// getCountryAndNeighbour('canada');
// getCountryAndNeighbour('germany');
// getCountryAndNeighbour('greece');
*/
/////////////////////////

// MODERN WAY... PROMISES

// step 1: fetch
// returns a promise
// const request = fetch('https://restcountries.com/v2/name/italy');

// const getCountry = (country) => {
//   // fetch returns a promise
//   fetch(`https://restcountries.com/v2/name/${country}`)
//     // then handles the fetch promise
//     .then((response) => {
//       console.log(response);
//       // json method returns a promise
//       return response.json();
//     })
//     // then handles the json promise
//     .then((data) => {
//       console.log(data);
//       renderCountry(data[0]);
//     });
// };
// getCountry('italy');

// CHAINING PROMISES

// simplified version of above ^

const getJSON = (url, errorMsg = 'Something went wrong') => {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`${errorMsg} (${response.status})`);
    }

    return response.json();
  });
};

/*
const getCountry = (country) => {
  // country 1
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then((response) => {
      console.log(response);

      if (!response.ok) {
        throw new Error(`Country not found (${response.status})`);
      }

      return response.json();
    })
    .then((data) => {
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];
      // country 2
      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Country not found (${response.status})`);
      }
      response.json();
    })
    .then((data) => renderCountry(data, 'neighbour'))
    .catch((err) => {
      console.error(`${err} <3 <3 <3`);
      renderError(`Something went wrong <3 ${err} Try again!`);
    })
    // finally is when something needs to happen whether or not the promise fails
    // such as to hide a rotating spinner, etc
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountry('italy');
});

getCountry('topkek');

const getCountry = (country) => {
  // country 1
  getJSON(`https://restcountries.com/v2/name/${country}`, 'Country not found')
    .then((data) => {
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];

      if (!neighbour) {
        throw new Error('No neighbour found!');
      }

      // country 2
      return getJSON(
        `https://restcountries.com/v2/alpha/${neighbour}`,
        'Country not found'
      );
    })
    .then((data) => renderCountry(data, 'neighbour'))
    .catch((err) => {
      console.error(`${err} <3 <3 <3`);
      if (err.message !== 'No neighbour found!') {
        renderError(`Something went wrong <3 ${err.message} Try again!`);
      } else {
        renderError(err.message);
      }
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountry('australia');
});

// EVENT LOOP IN PRACTICE

console.log('Test start');
setTimeout(() => console.log('0 sec timer'), 0);
Promise.resolve('Resolved promise 1').then((res) => console.log(res));

Promise.resolve('Resolved promise 2').then((res) => {
  for (let i = 0; i < 1000000000; i++) {}
  console.log(res);
});

console.log('Test end');

// BUILDING A SIMPLE PROMISE

const lotteryPromise = new Promise((resolve, reject) => {
  console.log('Lotto draw is happening...');
  setTimeout(() => {
    if (Math.random() >= 0.5) {
      resolve('You WIN!');
    } else {
      reject(new Error('You lost your money!'));
    }
  }, 2000);
});

lotteryPromise
  .then((res) => console.log(res))
  .catch((err) => console.error(err));

// promisifying setTimeout
const wait = (seconds) => {
  // dont need to specify reject, bc timer is impossible to fail
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

wait(1)
  .then(() => {
    console.log('1 second passed');
    return wait(1);
  })
  .then(() => {
    console.log('2 seconds passed');
    return wait(1);
  })
  .then(() => {
    console.log('3 seconds passed');
    return wait(1);
  })
  .then(() => console.log('4 seconds passed'));

Promise.resolve('abc').then((x) => console.log(x));
Promise.reject(new Error('Problem!')).catch((x) => console.log(x));

console.log('Getting position');

const getPosition = () => {
  return new Promise((resolve, reject) => {
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => resolve(position),
    //     (err) => reject(err)
    //   );

    // below === above, simplified
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

getPosition().then((pos) => console.log(pos));

const whereAmI2 = () => {
  getPosition()
    .then((pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;

      return fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
    })
    .then((res) => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.countryName}`);

      return fetch(`https://bigdatacloud.net/${data.countryName}`);
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Country not found (${res.status})`);
      }
      return response.json();
    })
    .then((data) => renderCountry(data[0]))
    .catch((err) => console.error(`${err.message} :)`));
};

btn.addEventListener('click', whereAmI2);

// ASYNC AWAIT

const getPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// const whereAmI = async (country) => {
//   const pos = await getPosition();
//   const { latitude: lat, longitude: lng } = pos.coords;
//   // fetch(
//   //   'https://geocode.maps.co/search?q=${country}&api_key=65aab4d23ade5448425425xea1c7142'
//   // ).then((res) => console.log(res));

//   // below === above
//   const res = await fetch(
//     `https://geocode.maps.co/search?q=${country}&api_key=65aab4d23ade5448425425xea1c7142`
//   );
//   const data = res.json();
//   console.log(data);
//   renderCountry(data[0]);
// };
// whereAmI('Canada');
// console.log('FIRST');

// try {
//   let y = 1;
//   const x = 2;
//   y = 3;
// } catch (err) {
//   alert(err.message);
// }

const whereAmI = async () => {
  try {
    //geolocation
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    //reverse geocoding
    const resGeo = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (!resGeo.ok) throw new Error('Problem getting location data');
    const dataGeo = await resGeo.json();
    console.log(dataGeo);

    //country data
    const res = await fetch(`https://bigdatacloud.net/${dataGeo.countryName}`);
    if (!res.ok) throw new Error('Problem getting country');
    const data = await res.json();
    console.log(data);
    renderCountry(data[0]);
  } catch (err) {
    console.error(`${err} :):)`);
    renderError(`......${err.message}`);
  }
};
whereAmI();
*/

const get3Countries = async (c1, c2, c3) => {
  try {
    // const [data1] = await getJSON(
    //   `https://restcountries.eu/rest/v2/name/${c1}`
    // );
    // const [data2] = await getJSON(
    //   `https://restcountries.eu/rest/v2/name/${c2}`
    // );
    // const [data3] = await getJSON(
    //   `https://restcountries.eu/rest/v2/name/${c3}`
    // );

    // all 3 of these run/load at the same time, instead of linearly as above
    const data = await Promise.all([
      getJSON(`https://restcountries.eu/rest/v2/name/${c1}`),
      getJSON(`https://restcountries.eu/rest/v2/name/${c2}`),
      getJSON(`https://restcountries.eu/rest/v2/name/${c3}`),
    ]);
    console.log(data.map((d) => d[0].capital));

    // console.log([data1.capital, data2.capital, data3.capital]);
  } catch (err) {
    console.error(err);
  }
};
get3Countries('portugal', 'canada', 'tanzania');

// other promise combinators

// Promise.race
// recieves array of promises, returns a promise
// good to prevend against never ending promises (like if user has bad internet)
/*
async () => {
  const res = await Promise.race([
    //these 3 promises will race against each other
    //whichever loads the fastest, is the result that wins the race
    //if all get rejected, the first one to get rejected is returned
    getJSON(`https://restcountries.eu/rest/v2/name/italy`),
    getJSON(`https://restcountries.eu/rest/v2/name/germany`),
    getJSON(`https://restcountries.eu/rest/v2/name/canada`),
  ]);
  console.log(res[0]);
};

const timeout = (sec) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Request took too long!'));
    }, sec * 1000);
  });
};

Promise.race([
  getJSON(`https://restcountries.eu/rest/v2/name/canada`),
  timeout(5),
]).then(((res) => console.log(res[0])).catch((err) => console.error(err)));

// Promise.allSettled
// takes array of promises, returns array of all the settled promises, regardless of result
Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another Success'),
]).then((res) => console.log(res));

// Promise.all short circuits if there is an error, allSettled does not
Promise.all([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another Success'),
])
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
*/

// Promise.any
// returns the first fulfilled promise
// ignores rejected promise
Promise.any([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another Success'),
])
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
