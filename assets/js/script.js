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
var fiveDayCardEl = document.querySelector(".five-day-weather-card")

var searchedCitiesAndCountries = {}

var storeCitiesAndCountries = function() {
    localStorage.setItem("searchedCitiesAndCountries", JSON.stringify(searchedCitiesAndCountries));
}

var clearInputs = function() {
    cityInputEl.value = "";
    countryInputEl.value = "";
}

var startingWithCapital = function(str) {
    return str.replace(/\b\w/g, x => x.toUpperCase());
}

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

var saveSearchInput = function(cityInputCapital, countryInputCapital) {
    if (searchedCitiesAndCountries[cityInputCapital] === countryInputCapital) {
        return;
    }
    searchedCitiesAndCountries[cityInputCapital] = countryInputCapital;
    storeCitiesAndCountries();
    renderPastSearches();
}

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
        citiesButtonEl.setAttribute("data-city", city)
        citiesButtonEl.setAttribute("data-country", searchedCitiesAndCountries[city])
        citiesButtonEl.textContent = city + ", " + searchedCitiesAndCountries[city];
        searchedCitiesUl.appendChild(citiesButtonEl);
        citiesButtonEl.addEventListener("click", searchAgain)
    }
}

var searchAgain = function(event) {
    event.preventDefault();
    let [cityInputCapital, countryInputCapital] = oldCityAndCountry(event.target);
    renderWeather(cityInputCapital, countryInputCapital);
}

var oldCityAndCountry = function(button) {
    return [button.dataset.city, button.dataset.country]
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
        var forecastData = getForecastData(nextFiveDatesWithTime, data)
        renderFiveDayForecast(forecastData)
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

var renderDayForecast = function(dayForecast) {
    var oneDayCardEl = document.createElement("section")
    var dateEl = document.createElement("p")
    dateEl.textContent = dayForecast["date"].format("(DD/MM/YYYY)")
    oneDayCardEl.appendChild(dateEl);
    var iconEl = document.createElement("img")
    iconEl.setAttribute("src", dayForecast["iconUrl"])
    iconEl.setAttribute("alt", "Icon representing current weather")
    oneDayCardEl.appendChild(iconEl);
    var tempEl = document.createElement("p")
    tempEl.textContent = dayForecast["temp"] + " °C"
    oneDayCardEl.appendChild(tempEl);
    var windEl = document.createElement("p")
    windEl.textContent = dayForecast["wind"] + " m/s"
    oneDayCardEl.appendChild(windEl);
    var humidityEl = document.createElement("p")
    humidityEl.textContent = dayForecast["humidity"] + " %"
    oneDayCardEl.appendChild(humidityEl);
    return oneDayCardEl
}

var renderFiveDayForecast = function(forecastData) {
    for (var i = 0; i < forecastData.length; i++) {
        fiveDayCardEl.appendChild(renderDayForecast(forecastData[i]))
    }
}


searchButtonEl.addEventListener("click", search);
init();
