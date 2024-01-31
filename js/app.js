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
  .then((data) => {
    data = data.sort((a, b) => b.population - a.population);
    populateCountryGrid(data);
  });

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
  for (let i = 0; i < countries.length; i++) {
    let countryRegion = countries[i].children[1].children[2].innerHTML;
    countryRegion = countryRegion.split(' ')[1];
    countries[i].hidden = true;

    if (countryRegion.toLowerCase().includes(region) || region === 'all')
      countries[i].hidden = false;
  }
});

// --- Theme Switcher ---

let currTheme = 'light';

const themeSwitch = document.querySelector('.theme-switcher');

const themeMap = [
  {
    property: '--clr-neutral-100',
    color: 'white',
  },
  {
    property: '--clr-neutral-900',
    color: 'hsl(207, 26%, 17%)',
  },
  {
    property: '--clr-neutral-999',
    color: 'hsl(209, 23%, 22%)',
  },
];

const switchTheme = () => {
  switch (currTheme) {
    case 'dark':
      themeMap.forEach((mapping) => {
        document.documentElement.style.setProperty(
          mapping.property,
          mapping.color
        );
      });
      currTheme = 'light';
      break;

    case 'light':
      themeMap.forEach((mapping) => {
        document.documentElement.style.removeProperty(mapping.property);
      });
      currTheme = 'dark';
      break;
  }
};

themeSwitch.addEventListener('click', () => switchTheme());

// --- Additional Details ---

const section = document.getElementById('section');
const countryDetails = document.getElementById('country-details');

// Listen for any click and get the closest country

document.addEventListener('click', (e) => {
  let clickedCountry = e.target.closest('.country');

  // Clicked country will only not be null when clicking inside a country

  if (clickedCountry) {
    // 'Swap the pages'
    section.hidden = true;
    countryDetails.hidden = false;
    countryDetails.innerHTML = '';
    countryDetails.appendChild(clickedCountry.cloneNode(true));
  }
});