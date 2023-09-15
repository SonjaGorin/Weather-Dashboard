var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"
var apiKey = "347c279390e03c0864320067fefb8c47"
var cityInputEl = document.querySelector("#city-input")
var searchButtonEl = document.querySelector("#search-button")
var searchedCitiesUl = document.querySelector(".searched-cities")



var searchedCitiesList = []

var storeCities = function() {
    localStorage.setItem("searchedCitiesList", JSON.stringify(searchedCitiesList));
}

var addCityToList = function(event) {
    event.preventDefault();
    var cityInput = cityInputEl.value.trim();
    var cityInputUpper = cityInput[0].toUpperCase() + cityInput.slice(1);
    if (cityInputUpper === "") {
        return;
    }
    for (i = 0; i < searchedCitiesList.length; i++) {
        if (cityInputUpper === searchedCitiesList[i]) {
            cityInputEl.value = "";
            return;            
        }
    }
    searchedCitiesList.push(cityInputUpper);

    storeCities();
    renderPastSearches();
    cityInputEl.value = "";
}

var renderPastSearches = function() {
    for (i = 0; i < searchedCitiesList.length; i++) {
        var citiesListEl = document.createElement("li");
        citiesListEl.textContent = searchedCitiesList[i];
    }
    searchedCitiesUl.appendChild(citiesListEl);
}




searchButtonEl.addEventListener("click", addCityToList);