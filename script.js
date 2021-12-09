/* Initialization */

const weatherApiKey = config.OPEN_WEATHER_API_KEY;

// elements for current weather
const getWeatherByCityNameButton = document.querySelector("#getWeatherByCityNameButton");
const getWeatherByGeolocationButton = document.querySelector("#getWeatherByGeolocationButton");
const geolocationWeatherListDiv = document.querySelector(".geolocation-weather-list .row");
const citynameWeatherListDiv = document.querySelector(".cityname-weather-list .row");

// elements for forecast
const getForecastByGeolocationButton = document.querySelector("#getForecastByGeolocationButton");
const geolocationForecastListDiv = document.querySelector(".geolocation-forecast-list .row");

getWeatherByCityNameButton.addEventListener("click", () => {
  let form = document.forms["getWeatherByCityNameButton"];
  let cityName = form.elements["cityname"].value;
  processData(getSettingsStringForCityNameWeather(cityName), citynameWeatherListDiv, "weatherCityname");
});

getWeatherByGeolocationButton.addEventListener("click", () => {
  let options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  navigator.geolocation.getCurrentPosition(getGeolocationSuccessWeather, getGeolocationError, options);
});

getForecastByGeolocationButton.addEventListener("click", () => {
  let options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  navigator.geolocation.getCurrentPosition(getGeolocationSuccessForecast, getGeolocationError, options);
});


/* -------------------------------- */
/* OpenWeatherAPI methods */

/* request data and process it */
function processData(settingsString, targetElement, requestType) {
  fetch(settingsString)
    .then(function (resp) { return resp.json() })
    .then(function (data) {
      console.log(data);
      targetElement.innerHTML = "";

      switch (requestType) {
        case "weatherCityname":
          processWeatherByCityName(data, targetElement);
          break;
        case "weatherGeolocation":
          processWeatherByGeolocation(data, targetElement);
          break;
        case "forecastCityname":
          processForecastByCityName(data, targetElement);
          break;
          case "forecastGeolocation":
          processForecastByGeolocation(data, targetElement);
          break;
        default:
          alert("Cannot process data");
          break;
      }
    })
    .catch(function (error) {
      console.log(error);
      targetElement.innerHTML = `<p class="text-danger">Unable to get data</p>`;
    });
}

/* process and display current weather data on page in a specific format */
function processWeatherByCityName(data, targetElement) {
  let weatherArray = Object.values(data["weather"]);
  let weatherValue = weatherArray[0]["main"].toLowerCase();

  let colDiv = document.createElement("div");
  colDiv.classList = "col";
  let windDirectionArrow =
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
                      ${windDirectionArrow}<span class="card-text temperature_time ">${data["wind"]["speed"]}m/s ${getWindDirection(data["wind"]["deg"])}, ${data["main"]["pressure"]}hPa</span>
                        <p class="card-text temperature_value">feels like ${Math.round(data["main"]["feels_like"])} °C</p>
                        <p class="card-text temperature_time">${getCurrentTimeString(new Date())}</p>
                      </div>
                    </div>`;
  targetElement.appendChild(colDiv);
}

function processWeatherByGeolocation(data, targetElement) {
  let dataArray = Object.values(data["list"])
  dataArray.shift();
  dataArray.forEach(data => {


    let weatherArray = Object.values(data["weather"]);
    let weatherValue = weatherArray[0]["main"].toLowerCase();

    let colDiv = document.createElement("div");
    colDiv.classList = "col";
    let windDirectionArrow =
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
                      ${windDirectionArrow}<span class="card-text temperature_time ">${data["wind"]["speed"]}m/s ${getWindDirection(data["wind"]["deg"])}, ${data["main"]["pressure"]}hPa</span>
                        <p class="card-text temperature_value">feels like ${Math.round(data["main"]["feels_like"])} °C</p>
                        <p class="card-text temperature_time">${getCurrentTimeString(new Date())}</p>
                      </div>
                    </div>`;
    targetElement.appendChild(colDiv);
  });
}

function processForecastByCityName(data, targetElement) {

}

function processForecastByGeolocation(data, targetElement) {
  let cityName = data["city"]["name"];
  let country = data["city"]["country"];
  let setTime = "13:00";

  // let currentWeather = data["weather"][0]["main"];
  // let currentstr = data["weather"][0]["main"];

  data["list"].forEach(element => {
    console.log(element)
    let timeString = getCurrentTimeString(new Date(element["dt"] * 1000));
    let dateString = getCurrentDateString(new Date(element["dt"] * 1000));
    console.log(dateString)
    if (timeString == setTime){
      let weatherValue = element["weather"][0]["main"].toLowerCase();
      
      let colDiv = document.createElement("div");
      colDiv.classList = "col";
      let windDirectionArrow =
        `<svg height="8" style="transform: rotate(${element["wind"]["deg"] + 90}deg)" xmlns="http://www.w3.org/2000/svg" viewBox="0 10 180 80">
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
                        <h4 class="card-title temperature_header">${cityName}, ${dateString}</h4>
                        <span class="card-text temperature_value">${Math.round(element["main"]["temp"])} °C, ${element["weather"][0]["description"]}</span><br/>
                        ${windDirectionArrow}<span class="card-text temperature_time ">${element["wind"]["speed"]}m/s ${getWindDirection(element["wind"]["deg"])}, ${element["main"]["pressure"]}hPa</span>
                          <p class="card-text temperature_value">real feel: ${Math.round(element["main"]["feels_like"])} °C</p>
                          <p class="card-text temperature_time">${getCurrentTimeString(new Date())}</p>
                        </div>
                      </div>`;
      targetElement.appendChild(colDiv);
    }

  })
}




/* get required photo */
function getWeatherImagePath(weatherValue) {
  switch (weatherValue) {
    case "clouds":
      return "./images/clouds.svg";
    case "rain":
      return "./images/rain.svg";
    case "clear":
      return "./images/clear.svg";
    case "snow":
      return "./images/snow.svg";
    case "haze":
    case "mist":
      return "./images/haze.svg";
    default:
      return "./images/empty.svg";
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
function getCurrentTimeString(date) {
  let minutes = date.getMinutes().toString().length == 1 ? '0' + date.getMinutes() : date.getMinutes();
  let hours = date.getHours().toString().length == 1 ? '0' + date.getHours() : date.getHours();
  return `${hours}:${minutes}`;
}

function getCurrentDateString(date){
  var mm = date.getMonth() + 1; // getMonth() is zero-based
  var dd = date.getDate();

  return [(dd>9 ? '' : '0') + dd,
          ".",
          (mm>9 ? '' : '0') + mm,
         ].join('');
}


/* get api settings string for getting current weather data using city name */
function getSettingsStringForCityNameWeather(cityName) {
  return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${weatherApiKey}`;
}

/* get api settings string for getting current weather near user by using user's coordinates */
function getSettingsStringForGeolocationWeather(latitude, longitude, citiesAmount = 6) {
  return `https://api.openweathermap.org/data/2.5/find?lat=${latitude}&lon=${longitude}&cnt=${citiesAmount + 1}&units=metric&appid=${weatherApiKey}`;
}

/* get api settings string for getting forecast using city name */
function getSettingsStringForCityNameForecast(cityName) {
  return `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${weatherApiKey}`;
}

/* get api settings string for getting forecast for area near user using user's coordinates */
function getSettingsStringForGeolocationForecast(latitude, longitude, stampsAmount = 36) {
  return `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=${stampsAmount}&units=metric&appid=${weatherApiKey}`;
}




/* -------------------------------- */
/* Geolocation methods */

/* success for geolocation  */
function getGeolocationSuccessWeather(pos) {
  let crd = pos.coords;
  let lat = crd.latitude;
  let lon = crd.longitude;
  processData(getSettingsStringForGeolocationWeather(lat, lon), geolocationWeatherListDiv, "weatherGeolocation")
}

function getGeolocationSuccessForecast(pos) {
  let crd = pos.coords;
  let lat = crd.latitude;
  let lon = crd.longitude;
  processData(getSettingsStringForGeolocationForecast(lat, lon), geolocationForecastListDiv, "forecastGeolocation")
}

function getGeolocationError(err) {
  console.warn(`geolocation is unavailable (${err.code}): ${err.message}`);
}