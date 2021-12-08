/* Initialization */

const getByCitynameButton = document.querySelector("#getByCityNameButton");
const getByGeolocationButton = document.querySelector("#getByGeolocationButton");
const geolocationForecastListDiv = document.querySelector(".geolocation-forecast-list .row");
const weatherApiKey = config.OPEN_WEATHER_API_KEY;

getByCitynameButton.addEventListener("click", () => {
  let form = document.forms["getByCityNameButton"];
  let cityName = form.elements["cityname"].value;
  getWeatherData(getApiSettingsStringByCity(cityName));
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

// getByGeolocationButton.click();


/* OpenWeatherAPI methods */

function getWeatherData(settingsString) {
  fetch(settingsString)
    .then(function (resp) { return resp.json() })
    .then(function (data) {
      console.log(data);

      let dataArray = null;
      if (data["list"]) {
        dataArray = Object.values(data["list"])
      } else {
        dataArray = data
      }


      console.log(dataArray)
      dataArray.forEach(element => {
        let weatherArray = Object.values(element["weather"]);
        let weatherValue = weatherArray[0]["main"].toLowerCase();

        let colDiv = document.createElement("div");
        colDiv.classList = "col";
        let timeNow = getCurrentTimeString();
        colDiv.innerHTML =
          `<div class="card border-primary col-sm-12" style="min-width:16rem">
                              <div class="card-body" style="background: url(${getWeatherImagePath(weatherValue)});">
                                <h4 class="card-title temperature_header">${element["name"]}</h4>
                                <p class="card-text temperature_value">${Math.round(element["main"]["temp"])} °C, ${weatherValue}</p>
                                <p class="card-text temperature_time text-muted">${timeNow}</p>
                              </div>
                            </div>`;
        geolocationForecastListDiv.appendChild(colDiv);
      });
    })
    .catch(function (error) {
      console.log(error);
      geolocationForecastListDiv.innerHTML = `<p class="text-danger">Unable to get data</p>`;
    });
}


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
    default:
      return "/images/empty.jpg";
  }
}

function getCurrentTimeString() {
  let d = new Date();
  let minutes = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
  let hours = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours();
  return `${hours}:${minutes}`;
}

function getApiSettingsStringByCity(cityName) {
  return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${weatherApiKey}`;
}

function getApiSettingsStringByCoordinates(latitude, longitude, citiesAmount = 10) {
  return `https://api.openweathermap.org/data/2.5/find?lat=${latitude}&lon=${longitude}&cnt=${citiesAmount}&units=metric&appid=${weatherApiKey}`;
}


/* Geolocation methods */

function getGeolocationSuccess(pos) {
  let crd = pos.coords;
  let lat = crd.latitude;
  let lon = crd.longitude;
  getWeatherData(getApiSettingsStringByCoordinates(lat, lon))
}

function getGeolocationError(err) {
  console.warn(`geolocation is unavailable (${err.code}): ${err.message}`);
}