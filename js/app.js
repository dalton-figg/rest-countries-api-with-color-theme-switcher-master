// --- API Calls ---

// Filtering by the fields that are needed for a slightly faster response

const url =
  'https://restcountries.com/v3.1/independent?status=true&fields=name,flags,capital,region,population';

// fetch(url) returns a promise
// .then(response) returns an object

fetch(url)
  // Checks the response object status and throws an error if the response went wrong
  .then((response) =>
    response.ok ? response.json() : new Error('Request failed')
  )
  .then((data) => populateCountryGrid(data));

// Generate each country element

const countryGrid = document.querySelector('.grid-container');

const createElement = (elem, classes, content) => {
  let element = document.createElement(elem);
  if (classes) element.classList.add(...classes);
  if (content) element.innerHTML = content;

  return element;
};

const populateCountryGrid = (data) => {
  countryGrid.innerHTML = '';

  data.forEach((country) => {
    // Creates the parent container div, country
    let countryContainer = createElement('div', ['country']);

    const countryFlag = generateCountryFlag(country);
    const countryDetails = generateCountryDetails(country);

    countryContainer.appendChild(countryFlag);
    countryContainer.appendChild(countryDetails);

    countryGrid.appendChild(countryContainer);
  });

  console.log(data);
};

const generateCountryFlag = (country) => {
  // Create the flag image and set all the correct attributes
  let countryFlag = createElement('img', ['country-flag']);
  // countryFlag.width = '265';
  countryFlag.height = '150';
  countryFlag.src = country.flags.png;
  countryFlag.alt = country.flags.alt;

  return countryFlag;
};

const generateCountryDetails = (country) => {
  let countryDetails = createElement('div', ['country-details']);

  let countryName = createElement('h2', ['country-name'], country.name.common);

  countryDetails.appendChild(countryName);

  let countryPopulation = createElement(
    'p',
    null,
    `<strong>Population:</strong> ${country.population.toLocaleString()}`
  );
  let countryRegion = createElement(
    'p',
    null,
    `<strong>Region:</strong> ${country.region}`
  );
  let countryCapital = createElement(
    'p',
    null,
    `<strong>Capital:</strong> ${country.capital}`
  );

  let children = [countryPopulation, countryRegion, countryCapital];

  children.forEach((child) => countryDetails.appendChild(child));

  return countryDetails;
};

// Searching

const searchInput = document.getElementById('country-search');

const countries = countryGrid.children;

searchInput.addEventListener('keyup', (e) => {
  let searchedValue = e.target.value;
  updateShownCountries(searchedValue);
});

const updateShownCountries = (searched) => {
  for (let i = 0; i < countries.length; i++) {
    let countryTitle = countries[i].children[1].children[0].innerHTML;
    countries[i].hidden = true;

    if (countryTitle.toLowerCase().includes(searched))
      countries[i].hidden = false;
  }
};

// Filtering

const regionSelection = document.getElementById('region-filter');

regionSelection.addEventListener('change', (e) => {
  let region = e.target.value;
  for(let i = 0; i < countries.length; i++){
    let countryRegion = countries[i].children[1].children[2].innerHTML;
    countryRegion = countryRegion.split(' ')[1];
    countries[i].hidden = true;

    if(countryRegion.toLowerCase() === region) countries[i].hidden = false;
  }
});