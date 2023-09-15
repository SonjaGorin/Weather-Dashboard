var weatherApiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"
// var cityApiUrl = 
var apiKey = "347c279390e03c0864320067fefb8c47"
var cityInputEl = document.querySelector("#city-input")
var searchButtonEl = document.querySelector("#search-button")
var searchedCitiesUl = document.querySelector(".searched-cities")
var countryInputEl = document.querySelector("#country-input")


var searchedCitiesAndCountries = {}

var storeCities = function() {
    localStorage.setItem("searchedCitiesAndCountries", JSON.stringify(searchedCitiesAndCountries));
}

var addInputsToList = function(event) {
    event.preventDefault();
    var cityInput = cityInputEl.value.trim();
    var cityInputUpper = cityInput[0].toUpperCase() + cityInput.slice(1);
    var countryInput = countryInputEl.value.trim();
    var countryInputUpper = countryInput[0].toUpperCase() + countryInput.slice(1);
    if (cityInputEl.value === "" || countryInputEl.value === "") {
        // cityInputEl.value = "";
        // countryInputEl.value = "";
        return;
    }
    for (var city in searchedCitiesAndCountries) {
        if (city === cityInputUpper && searchedCitiesAndCountries[city] === countryInputUpper) {
            cityInputEl.value = "";
            countryInputEl.value = "";
            return;            
        }
    }
    // cityInputEl.value = "";   
    // countryInputEl.value = "";
    searchedCitiesAndCountries[cityInputUpper] = countryInputUpper;

    storeCities();
    renderPastSearches();
    cityInputEl.value = "";
    countryInputEl.value = "";
}

var renderPastSearches = function() {
    searchedCitiesUl.innerHTML = ""
    for (var city in searchedCitiesAndCountries) {
        var citiesListEl = document.createElement("li");
        citiesListEl.textContent = city;
        searchedCitiesUl.appendChild(citiesListEl);
    }
}

var loadSearchedCities = function() {
    var storedCities = JSON.parse(localStorage.getItem("searchedCitiesAndCountries"));
    if (storedCities !== null) {
        for (var city in searchedCitiesAndCountries) {
            city = storedCities;
        }
    }
}

var init = function() {
    loadSearchedCities();
    renderPastSearches();
}
















searchButtonEl.addEventListener("click", addInputsToList);
init();
