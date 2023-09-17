

var apiKey = "347c279390e03c0864320067fefb8c47"
var cityInputEl = document.querySelector("#city-input")
var searchButtonEl = document.querySelector("#search-button")
var searchedCitiesUl = document.querySelector(".searched-cities")
var countryInputEl = document.querySelector("#country-input")
var currentCityName = document.querySelector("#current-city-name")
var currentTempEl = document.querySelector("#current-temp")
var currentWindEl = document.querySelector("#current-wind")
var currentHumidityEl = document.querySelector("#current-humidity")
var currentDateEl = document.querySelector("#current-date")
var currentWeatherIconEl = document.querySelector("#today-icon")


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
    let [cityInputCapital, countryInputCapital] = newCityAndCountry();
    clearInputs();
    if (!cityInputCapital || !countryInputCapital) {
        return;
    }
    saveSearchInput(cityInputCapital, countryInputCapital);
    renderWeather(cityInputCapital, countryInputCapital);

}

// this function calls newCityAnd country function
// and clears input fields after every search button clicked
// if there are no inputs, do nothing
// if there are inputs adds them as city and country pairs to the object
// stores them and displays them
var saveSearchInput = function(cityInputCapital, countryInputCapital) {
    if (searchedCitiesAndCountries[cityInputCapital] === countryInputCapital) {
        return;
    }
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
    var cityInputCapital = startingWithCapital(cityInput);
    var countryInputCapital = startingWithCapital(countryInput);
    return [cityInputCapital, countryInputCapital]
}
    
var renderPastSearches = function() {
    searchedCitiesUl.innerHTML = ""
    for (var city in searchedCitiesAndCountries) {
        var citiesButtonEl = document.createElement("button");
        citiesButtonEl.textContent = city + ", " + searchedCitiesAndCountries[city];
        searchedCitiesUl.appendChild(citiesButtonEl);
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

var renderWeather = function (cityInputCapital, countryInputCapital) {
    var cityApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityInputCapital + "," + countryInputCapital + "&limit=1&appid=" + apiKey

    fetch(cityApiUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var cityLat = data[0]["lat"].toString()
        var cityLon = data[0]["lon"].toString()
        getWeatherData(cityLat, cityLon, cityInputCapital)
    })
}

var getWeatherData = function(cityLat, cityLon, cityInputCapital) {
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=" + cityLat + "&lon=" + cityLon + "&appid=" + apiKey;

    fetch(weatherApiUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data)
        var currentTemp = data["list"][0]["main"]["temp"]
        var currentWind = data["list"][0]["wind"]["speed"]
        var currentHumidity = data["list"][0]["main"]["humidity"]
        var currentWeatherIcon = data["list"][0]["weather"][0]["icon"]
        var iconUrl = "https://openweathermap.org/img/wn/" + currentWeatherIcon + ".png"
        
        currentWeatherDisplay(cityInputCapital, currentTemp, currentWind, currentHumidity, iconUrl)
        var nextFiveDatesWithTime = getNextFiveDates()
        getForecastData(nextFiveDatesWithTime, data)
    })
}

var currentWeatherDisplay = function(cityInputCapital, currentTemp, currentWind, currentHumidity, iconUrl) {
    var dateToday = dayjs().format("(DD/MM/YYYY)")
    currentCityName.textContent = cityInputCapital;
    currentDateEl.textContent = dateToday;
    currentWeatherIconEl.setAttribute("src", iconUrl)
    currentTempEl.textContent = currentTemp + " °C";
    currentWindEl.textContent = currentWind + " m/s";
    currentHumidityEl.textContent = currentHumidity + " %";
}

var getNextFiveDates = function() {
    var nextFiveDatesWithTime = []
    for (var i = 1; i <= 5; i++) {
        var dateAndTime = dayjs().add(i, "day").format("YYYY-MM-DD 15:00:00")
        nextFiveDatesWithTime.push(dateAndTime)
    }
    return nextFiveDatesWithTime
}

var getForecastData = function(nextFiveDatesWithTime, data) {
    var forecastData = [];
    for (var dateTimeIndex = 0; dateTimeIndex < nextFiveDatesWithTime.length; dateTimeIndex++) {
        var dateWithTime = nextFiveDatesWithTime[dateTimeIndex]
        for (var forecastIndex = 0; forecastIndex < data["list"].length; forecastIndex++) {
            var dataDateWithTime = data["list"][forecastIndex]["dt_txt"]
            if (dateWithTime === dataDateWithTime) {
                var forecastTemp = data["list"][forecastIndex]["main"]["temp"]
                var forecastWind = data["list"][forecastIndex]["wind"]["speed"]
                var forecastHumidity = data["list"][forecastIndex]["main"]["humidity"]
                var forecastIcon = data["list"][forecastIndex]["weather"][0]["icon"]
                var forecastDate = dayjs(dataDateWithTime.split(" ")[0])
                forecastData.push({
                    "date": forecastDate,
                    "iconUrl": "https://openweathermap.org/img/wn/" + forecastIcon + ".png",
                    "temp": forecastTemp,
                    "wind": forecastWind,
                    "humidity": forecastHumidity,
                });
            }
        }
    }
    return forecastData
}





getNextFiveDates()



searchButtonEl.addEventListener("click", search);
init();
