const city = document.querySelector(".city");
const cityInput = document.querySelector("#city-input");
const dateBlock = document.querySelector(".date");
const timeBlock = document.querySelector(".time");
const weekDayBlock = document.querySelector(".week-day");
const cityForm = document.querySelector("#city-form");
const celcius = document.querySelector(".celcius");
const farenheit = document.querySelector(".farenheit");
const currentTemperature = document.querySelector(".current-temperature");
const forecast = document.querySelector(".forecast");
const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/*-----------------date-------------------- */

function showTime() {
  let now = new Date();
  let day = setZero(now.getDate());
  let month = setZero(now.getMonth() + 1);
  let year = now.getFullYear();
  let hours = setZero(now.getHours());
  let minutes = setZero(now.getMinutes());
  let seconds = setZero(now.getSeconds());
  let dateString = `${day}.${month}.${year}`;
  dateBlock.innerHTML = dateString;
  let timeString = `${hours}.${minutes}.${seconds}`;
  timeBlock.innerHTML = timeString;
  let weekDay = now.getDay();
  weekDayBlock.innerHTML = `${weekDays[weekDay]}`;
  setTimeout(showTime, 1000);
}

showTime();

function setZero(data) {
  if (data < 10) {
    return "0" + data;
  } else {
    return data;
  }
}

/*-------------------submit-------------------- */

cityForm.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log("?");
  city.innerHTML = cityInput.value;
});

/*------------------celcius-farenheit--------------- */

let isCelcius = true;
celcius.addEventListener("click", function () {
  if (isCelcius === true) {
    console.log(isCelcius);
    return;
  } else {
    console.log(isCelcius);
    let celciusString = Math.round(
      (Number(currentTemperature.innerHTML) - 32) / 1.8
    );
    currentTemperature.innerHTML = celciusString;
    celcius.classList.add("active-degree");
    farenheit.classList.remove("active-degree");
    isCelcius = true;
  }
});

farenheit.addEventListener("click", function () {
  if (isCelcius === true) {
    console.log(isCelcius);
    let farenheitString = Math.round(
      Number(currentTemperature.innerHTML) * 1.8 + 32
    );
    currentTemperature.innerHTML = farenheitString;
    celcius.classList.remove("active-degree");
    farenheit.classList.add("active-degree");
    isCelcius = false;
  } else {
    console.log(isCelcius);
    return;
  }
});

/*------------------------display current weather----------------------------- */

let currentWeatherDescription = document.querySelector(
  ".current-weather-description"
);
let currentFeelTemperature = document.querySelector(
  ".current-feel-temperature"
);
let currentWind = document.querySelector(".current-wind");
let currentHumidity = document.querySelector(".current-humidity");
let currentSunrise = document.querySelector(".current-sunrise");
let currentSunset = document.querySelector(".current-sunset");
let currentGeolocation = document.querySelector("#current-geolocation");
let apiKey = "5c08670149a0b1a4dc7a372a3d5e5333";
let units = "metric";

function setCity(cityName) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;
  axios.get(url).then(showWeather);
}

setCity("London");

function submitSearch(event) {
  event.preventDefault();
  let cityName = cityInput.value;
  setCity(cityName);
}

cityForm.addEventListener("submit", submitSearch);

function formatTime(timeSpamp) {
  let date = new Date(timeSpamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  return `${setZero(hours)}:${setZero(minutes)}`;
}

function formatDay(timeSpamp) {
  let date = new Date(timeSpamp * 1000);
  let day = date.getDay();
  return weekDays[day];
}
console.log(formatDay(1667732400));

function getForecast(coordinates) {
  console.log(coordinates.lat);
  let apiKey = "5c08670149a0b1a4dc7a372a3d5e5333";
  const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function showWeather(response) {
  console.log(response.data);
  let temperature = Math.round(response.data.main.temp);
  let weatherDesc = response.data.weather[0].description;
  let feelTemperature = Math.round(response.data.main.feels_like);
  let humidity = response.data.main.humidity;
  let wind = response.data.wind.speed;
  let sunrise = response.data.sys.sunrise;
  let sunset = response.data.sys.sunset;
  let currentImage = document.querySelector(".image-column");
  city.innerHTML = response.data.name;
  currentTemperature.textContent = temperature;
  currentWeatherDescription.textContent = weatherDesc;
  currentFeelTemperature.textContent = feelTemperature;
  currentHumidity.textContent = humidity + "%";
  currentWind.textContent = wind + "m/s";
  currentSunrise.textContent = formatTime(sunrise);
  currentSunset.textContent = formatTime(sunset);
  currentImage.innerHTML = `<img src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png" alt="${response.data.weather[0].description}">`;

  getForecast(response.data.coord);
}

function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  console.log(latitude);
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  console.log(url);

  axios.get(url).then(showWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(setPosition);
}

currentGeolocation.addEventListener("click", getCurrentLocation);

/*----------------------display week days forecast---------------------- */

function displayForecast(response) {
  console.log(response.data.daily);
  const forecastArr = response.data.daily;
  forecastArr.forEach((day, index) => {
    if (index > 0 && index < 7) {
      let dayForecast = document.createElement("div");
      dayForecast.classList.add("day-forecast", "col");
      dayForecast.innerHTML = `<div class="week-day-min">${formatDay(
        day.dt
      )}</div>
            <div class="weather-icon"><img src="http://openweathermap.org/img/wn/${
              day.weather[0].icon
            }@2x.png" alt="${day.weather[0].description}"></div>
            <div class="temperature-min">
              <span class="temp-max">${Math.round(day.temp.min)}°</span>
              <span class="temp-max">${Math.round(day.temp.max)}°</span>
            </div>`;
      forecast.append(dayForecast);
    }
  });
}
