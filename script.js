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

  let arrow = 
              `<svg height="8" style="transform: rotate(${data["wind"]["deg"] + 90}deg)" xmlns="http://www.w3.org/2000/svg" viewBox="0 10 180 80">
                  <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="0" refY="3.5" orient="auto">
                          <polygon points="0 0, 10 3.5, 0 7" fill="white"/>
                      </marker>
                  </defs>
                  <line x1="0" y1="50" x2="100" y2="50" stroke="white" stroke-width="8" marker-end="url(#arrowhead)" />
              </svg> `;

  colDiv.innerHTML =
                    `<div class="card text-white weather-card border-primary col-sm-12" style="background: url(${getWeatherImagePath(weatherValue)}); background-size: cover;">
                      <div class="card-body weather-card-body">
                      <h4 class="card-title temperature_header">${data["name"]}</h4>
                      <span class="card-text temperature_value">${Math.round(data["main"]["temp"])} °C, ${weatherArray[0]["description"]}</span><br/>
                      ${arrow}<span class="card-text temperature_time ">${data["wind"]["speed"]}m/s ${getWindDirection(data["wind"]["deg"])}, ${data["main"]["pressure"]}hPa</span>
                        <p class="card-text temperature_value">feels like ${Math.round(data["main"]["feels_like"])} °C</p>
                        <p class="card-text temperature_time">${getCurrentTimeString()}</p>
                      </div>
                    </div>`;
  targetElement.appendChild(colDiv);
}

/* get required photo */
function getWeatherImagePath(weatherValue) {
  switch (weatherValue) {
    case "clouds":
      return "/images/clouds.svg";
    case "rain":
      return "/images/rain.svg";
    case "clear":
      return "/images/clear.svg";
    case "snow":
      return "/images/snow.svg";
    case "haze":
    case "mist":
      return "/images/haze.svg";
    default:
      return "/images/empty.svg";
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