// API Calls

const url = 'https://restcountries.com/v3.1/all';

// fetch(url) returns a promise
// .then(response) returns an object

fetch(url)
  // Checks the response object status and throws an error if the response went wrong
  .then((response) =>
    response.ok ? response.json() : new Error('Request failed')
  )
  .then((data) => filterCountries(data));

// Filter out non-independent regions so we are left with only countries

const filterCountries = (data) => {
  data = data.filter((item) => item.independent);
  console.log(data);
};
