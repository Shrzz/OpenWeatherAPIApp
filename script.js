/* Initialization */

const getByCitynameButton = document.querySelector("#getByCityNameButton");
const getByGeolocationButton = document.querySelector("#getByGeolocationButton");
const geolocationForecastListDiv = document.querySelector(".geolocation-forecast-list .row");
const citynameForecastListDiv = document.querySelector(".cityname-forecast-list .row");
const weatherApiKey = config.OPEN_WEATHER_API_KEY;

getByCitynameButton.addEventListener("click", () => {
  let form = document.forms["getByCityNameButton"];
  let cityName = form.elements["cityname"].value;
  getWeatherData(getApiSettingsStringByCity(cityName), citynameForecastListDiv);
});

getByGeolocationButton.addEventListener("click", () => {
  let options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  navigator.geolocation.getCurrentPosition(getGeolocationSuccess, getGeolocationError, options);
});


/* Execution */

getByGeolocationButton.click();


/* OpenWeatherAPI methods */

/* request data and process it */
function getWeatherData(settingsString, targetElement) {
  fetch(settingsString)
    .then(function (resp) { return resp.json() })
    .then(function (data) {
      targetElement.innerHTML = "";

      if (data["list"]) {
        let dataArray = Object.values(data["list"])
        dataArray.forEach(data => {
          showForecastData(data, targetElement);
        });
      } else {
        showForecastData(data, targetElement);
      }
    })
    .catch(function (error) {
      console.log(error);
      targetElement.innerHTML = `<p class="text-danger">Unable to get data</p>`;
    });
}

/* display forecast data on page in a specific format */
function showForecastData(data, targetElement) {
  console.log(data);

  let weatherArray = Object.values(data["weather"]);
  let weatherValue = weatherArray[0]["main"].toLowerCase();

  let colDiv = document.createElement("div");
  colDiv.classList = "col";

  colDiv.innerHTML =
    `<div class="card border-primary col-sm-12" style="min-width:16rem">
                        <div class="card-body" style="background: url(${getWeatherImagePath(weatherValue)});">
                          <h4 class="card-title temperature_header">${data["name"]}</h4>
                          <p class="card-text temperature_value">${Math.round(data["main"]["temp"])} °C, ${weatherArray[0]["description"]}</p>
                          <p class="card-text temperature_time ">${data["wind"]["speed"]}m/s ${getWindDirection(data["wind"]["deg"])}, ${data["main"]["pressure"]}hPa</p>
                          <p class="card-text temperature_value text-muted">feels like ${Math.round(data["main"]["feels_like"])} °C</p>
                          <p class="card-text temperature_time text-muted">${getCurrentTimeString()}</p>
                        </div>
                      </div>`;
  targetElement.appendChild(colDiv);
}

/* get required photo */
function getWeatherImagePath(weatherValue) {
  switch (weatherValue) {
    case "clouds":
      return "/images/rain.jpg";
    case "rain":
      return "/images/clouds.jpg";
    case "clear":
      return "/images/clear.jpg";
    case "snow":
      return "/images/snow.jpg";
    case "haze":
      return "/images/haze.jpg";
    default:
      return "/images/empty.jpg";
  }
}

/* convert degree value to wind direction */
function getWindDirection(degreeValue) {
  if (degreeValue < 11.25) {
    return "N";
  } else
    if (degreeValue < 33.75) {
      return "NNE";
    } else
      if (degreeValue < 56.25) {
        return "NE";
      } else
        if (degreeValue < 78.75) {
          return "ENE";
        } else
          if (degreeValue < 101.25) {
            return "E";
          } else
            if (degreeValue < 123.75) {
              return "ESE";
            } else
              if (degreeValue < 146.75) {
                return "SE";
              } else
                if (degreeValue < 191.25) {
                  return "S";
                } else
                  if (degreeValue < 213.75) {
                    return "SSW";
                  } else
                    if (degreeValue < 236.25) {
                      return "SW";
                    } else
                      if (degreeValue < 258.75) {
                        return "WSW";
                      } else
                        if (degreeValue < 281.25) {
                          return "W";
                        } else
                          if (degreeValue < 303.75) {
                            return "WNW";
                          } else
                            if (degreeValue < 326.25) {
                              return "NW";
                            } else
                              if (degreeValue < 348.75) {
                                return "NNW";
                              } else {
                                return "N";
                              }
}

/* get formatted time string */
function getCurrentTimeString() {
  let d = new Date();
  let minutes = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
  let hours = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours();
  return `${hours}:${minutes}`;
}


// WNW
// 281.25 - 303.75

// NW
// 303.75 - 326.25

// NNW
// 326.25 - 348.75

/* get api settings using city name */
function getApiSettingsStringByCity(cityName) {
  return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${weatherApiKey}`;
}

/* get api settings using user coordinates */
function getApiSettingsStringByCoordinates(latitude, longitude, citiesAmount = 10) {
  return `https://api.openweathermap.org/data/2.5/find?lat=${latitude}&lon=${longitude}&cnt=${citiesAmount}&units=metric&appid=${weatherApiKey}`;
}


/* Geolocation methods */

function getGeolocationSuccess(pos) {
  let crd = pos.coords;
  let lat = crd.latitude;
  let lon = crd.longitude;
  getWeatherData(getApiSettingsStringByCoordinates(lat, lon), geolocationForecastListDiv)
}

function getGeolocationError(err) {
  console.warn(`geolocation is unavailable (${err.code}): ${err.message}`);
}