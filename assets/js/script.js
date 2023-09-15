var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"
var apiKey = "347c279390e03c0864320067fefb8c47"
var cityInputEl = document.querySelector("#city-input")
var searchButtonEl = document.querySelector("#search-button")



var searchedCitiesList = []

var storeCities = function() {
    localStorage.setItem("searchedCitiesList", JSON.stringify(searchedCitiesList));
}

var displaySearchedCities = function(event) {
    event.preventDefault();
    var cityInput = cityInputEl.value.trim()

    if (cityInput === "") {
        return;
    }

    searchedCitiesList.push(cityInput)


    storeCities();
}

searchButtonEl.addEventListener("submit", displaySearchedCities);