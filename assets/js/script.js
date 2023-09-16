var weatherApiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"
// var cityApiUrl = 
var apiKey = "347c279390e03c0864320067fefb8c47"
var cityInputEl = document.querySelector("#city-input")
var searchButtonEl = document.querySelector("#search-button")
var searchedCitiesUl = document.querySelector(".searched-cities")
var countryInputEl = document.querySelector("#country-input")


var searchedCitiesAndCountries = {}

// this function stores cities and countries from input to local storage
var storeCitiesAndCountries = function() {
    localStorage.setItem("searchedCitiesAndCountries", JSON.stringify(searchedCitiesAndCountries));
}

// this function clears input fields when called
var clearInputs = function() {
    cityInputEl.value = "";
    countryInputEl.value = "";
}

// when you pass string as an argument to this function 
// it returnes string with first capital letter 
var startingWithCapital = function(str) {
    return str[0].toUpperCase() + str.slice(1);
}

// this function starts when search button is clicked
// it calls saveSearchInput function
var search = function(event) {
    event.preventDefault();
    saveSearchInput();
}

// this function calls newCityAnd country function
// and clears input fields after every search button clicked
// if there are no inputs, do nothing
// if there are inputs adds them as city and country pairs to the object
// stores them and displays them
var saveSearchInput = function() {
    var cityAndCountry = newCityAndCountry();
    clearInputs();
    if (!cityAndCountry) {
        return;
    }
    let [cityInputCapital, countryInputCapital] = cityAndCountry;
    searchedCitiesAndCountries[cityInputCapital] = countryInputCapital;
    storeCitiesAndCountries();
    renderPastSearches();
}

// this function checks if either of input fields are empty
// and does nothing if they are
// it also checks if there is already same city and country pair in the object
// and does nothing if there is
var newCityAndCountry = function() {
    var cityInput = cityInputEl.value.trim();   
    var countryInput = countryInputEl.value.trim();
    
    if (cityInput === "" || countryInput === "") {
        return;
    }
    var cityInputCapital = startingWithCapital(cityInput);
    var countryInputCapital = startingWithCapital(countryInput);

    if (searchedCitiesAndCountries[cityInputCapital] === countryInputCapital) {
        return;
    }
    return [cityInputCapital, countryInputCapital]
}

var renderPastSearches = function() {
    searchedCitiesUl.innerHTML = ""
    for (var city in searchedCitiesAndCountries) {
        var citiesListEl = document.createElement("li");
        citiesListEl.textContent = city + ", " + searchedCitiesAndCountries[city];
        searchedCitiesUl.appendChild(citiesListEl);
    }
}

var loadSearchedCities = function() {
    var storedCities = JSON.parse(localStorage.getItem("searchedCitiesAndCountries"));
    if (storedCities !== null) {
        searchedCitiesAndCountries = storedCities
    }
}

var init = function() {
    loadSearchedCities();
    renderPastSearches();
}


searchButtonEl.addEventListener("click", search);
init();
