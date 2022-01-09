/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/pageRefresh.js":
/*!****************************!*\
  !*** ./src/pageRefresh.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchWeatherData": () => (/* binding */ fetchWeatherData),
/* harmony export */   "loadPage": () => (/* binding */ loadPage)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.js");
/* harmony import */ var _weatherRequest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./weatherRequest */ "./src/weatherRequest.js");



let objectData = {};
let dailyForecastPage = 1;
let tempUnit = "f";

function resetPage() {
    document.querySelector('.hourly-forecast-ctr').innerHTML = '';
    document.getElementById('days-column').innerHTML = '';
    document.getElementById('weather-column').innerHTML = '';
    document.getElementById('low-column').innerHTML = '';
    document.getElementById('high-column').innerHTML = '';
}

function moveDailyForecastLeft() {

    console.log('calling');
    if (dailyForecastPage > 1) {
        dailyForecastPage -= 1;
        loadPage();
    }

}

function moveDailyForecastRight() {
    
    if (dailyForecastPage < 4) {
        dailyForecastPage += 1;
        loadPage();
    }

}

function getDailyForecastIndices() {

    console.log(dailyForecastPage);
    switch (dailyForecastPage) {
        case 1: 
            return [1, 7];
        case 2:
            return [7, 13];
        case 3:
            return [13, 19];
        case 4:
            return [19, 25];
        case 5:
            return [25, 31];
        default:
            return [0, 6];
    }

}

// temp is in kelvin
function convertTemp(k) {
    if (tempUnit == 'f') {
        return (k - 273.15) * (9 / 5) + 32;
    } else if (tempUnit == 'c') {
        return k - 273.15;
    }
}

async function fetchWeatherData (query) {

    try {
        objectData = await (0,_weatherRequest__WEBPACK_IMPORTED_MODULE_1__.getWeather)(query);
        console.log(objectData)
    } catch(err) {
        console.log("failed to fetch weather data");
    }

}

function loadCurrentForecast() {

    const currentData = objectData['current'];

    let cityName = document.getElementById('city-name');
    let currentWeather = document.getElementById('weather');
    let currentTemp = document.getElementById('current-temp');
    let currentLow = document.getElementById('current-low');
    let currentHigh = document.getElementById('current-high');

    const convertedTemp =  Math.round(convertTemp(parseInt(currentData['temp'])));
    const convertedLow = Math.round(convertTemp(parseInt(currentData['low'])));
    const convertedHigh = Math.round(convertTemp(parseInt(currentData['high'])));
    const currentUnit = (tempUnit == 'f') ? 'F' : 'C';

    cityName.textContent = objectData['name'];
    currentWeather.textContent = currentData['weather'];
    currentTemp.textContent = `${convertedTemp}\u00B0${currentUnit}`;
    currentLow.textContent = `L: ${convertedLow}\u00B0${currentUnit} |`;
    currentHigh.textContent = `H: ${convertedHigh}\u00B0${currentUnit}`;
}

function loadHourlyForecast() {

    const hourlyForecastElement = document.querySelector('.hourly-forecast-ctr');
    const hourlyForecast = objectData['hourly-forecast'];
    const currentUnit = (tempUnit == 'f') ? 'F' : 'C';

    let leftArrow = document.createElement('span');
    leftArrow.classList = ['left-arrow'];
    leftArrow.textContent = '\u2190';
    leftArrow.addEventListener('click', moveDailyForecastLeft);
    hourlyForecastElement.appendChild(leftArrow);

    if (dailyForecastPage <= 1) {
        leftArrow.style.color = 'transparent';
        leftArrow.style.cursor = 'default';
    }

    let [leftIndex, rightIndex] = getDailyForecastIndices();

    for (let i = leftIndex; i < rightIndex; i++) {
        const hourData = hourlyForecast[i];
        const time = (0,_util__WEBPACK_IMPORTED_MODULE_0__.twentyFourTimeToTwelve)(hourData['hourOfDay']);
        const temp = Math.round(convertTemp(parseInt(hourData['temp'])));
        const weatherUrl = "http://openweathermap.org/img/w/" + hourData['weather-icon'] + ".png";

        let timePara = document.createElement('p');
        timePara.textContent = time;

        let iconImg = document.createElement('img');
        iconImg.src = weatherUrl;

        let tempPara = document.createElement('p');
        tempPara.textContent = `${temp}\u00B0${currentUnit}`;

        let hourObject = document.createElement('div');
        hourObject.appendChild(timePara);
        hourObject.appendChild(iconImg);
        hourObject.appendChild(tempPara);
        hourObject.classList = ['hour-data'];

        hourlyForecastElement.appendChild(hourObject);
    }

    let rightArrow = document.createElement('span');
    rightArrow.classList = ['right-arrow'];
    rightArrow.textContent = '\u2192';
    rightArrow.addEventListener('click', moveDailyForecastRight);
    hourlyForecastElement.appendChild(rightArrow);

    if (dailyForecastPage >= 4) {
        rightArrow.style.color = 'transparent';
        rightArrow.style.cursor = 'default';
    }

}

function loadDailyForecast() {
    
    let daysColumn = document.getElementById('days-column');
    let weatherColumn = document.getElementById('weather-column');
    let lowColumn = document.getElementById('low-column');
    let highColumn = document.getElementById('high-column');

    for (let i = 0; i < 7; i++) {

        const dailyData = objectData['daily-forecast'][i];
        const dayOfWeek = dailyData['dayOfWeek'];
        const lowTemp = Math.round(convertTemp(parseInt(dailyData['low'])));
        const highTemp = Math.round(convertTemp(parseInt(dailyData['high'])));
        const weatherUrl = "http://openweathermap.org/img/w/" + dailyData['weather-icon'] + ".png";
        const currentUnit = (tempUnit == 'f') ? 'F' : 'C';

        let dayPara = document.createElement('p');
        dayPara.textContent = dayOfWeek;
        daysColumn.appendChild(dayPara);

        let iconImg = document.createElement('img');
        iconImg.src = weatherUrl;
        weatherColumn.appendChild(iconImg);
        iconImg.style.display = 'block';

        let lowPara = document.createElement('p');
        lowPara.textContent = `${lowTemp}\u00B0${currentUnit}`;
        lowColumn.appendChild(lowPara);

        let highPara = document.createElement('p');
        highPara.textContent = `${highTemp}\u00B0${currentUnit}`;
        highColumn.appendChild(highPara);
    }

}

function loadWeatherInfo() {

    const currentData = objectData['current'];
    const windSpeedImperial = Math.round(2.23694 * currentData['wind_speed'] * 100) / 100;
    const currentUnit = (tempUnit == 'f') ? 'F' : 'C';

    const tempFeel = Math.round(convertTemp(parseInt(currentData['feel'])));

    document.getElementById('info-sunrise').textContent = 
        `${(0,_util__WEBPACK_IMPORTED_MODULE_0__.twentyFourTimeToTwelve)(currentData['sunrise'])}`;
    document.getElementById('info-sunset').textContent = 
        `${(0,_util__WEBPACK_IMPORTED_MODULE_0__.twentyFourTimeToTwelve)(currentData['sunset'])}`;
    document.getElementById('info-wind').textContent = 
        `${currentData['wind_direction']}    ${windSpeedImperial}    mph`;
    document.getElementById('info-feel').textContent = 
        `${tempFeel}\u00B0${currentUnit}`;
    document.getElementById('info-uvi').textContent = 
        `${currentData['uvi']}`;
    document.getElementById('info-dew').textContent = 
        `${currentData['dew point']}`;
    document.getElementById('info-pressure').textContent = 
        `${currentData['pressure']}  hPa`;
    document.getElementById('info-humidity').textContent = 
        `${currentData['humidity']}%`;
    document.getElementById('info-visibility').textContent = 
        `${currentData['visibility']} m`;

}

function loadPage() {
    resetPage();
    loadCurrentForecast();
    loadHourlyForecast();
    loadDailyForecast();
    loadWeatherInfo();
}

let unitCheckbox = document.getElementById('unit-checkbox');
unitCheckbox.addEventListener('click', () => {
    if (unitCheckbox.checked) {
        tempUnit = 'c';
    } else {
        tempUnit = 'f';
    }

    loadPage();
});



/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "daysOfWeek": () => (/* binding */ daysOfWeek),
/* harmony export */   "unixToTimestamp": () => (/* binding */ unixToTimestamp),
/* harmony export */   "degreeToDirection": () => (/* binding */ degreeToDirection),
/* harmony export */   "twentyFourTimeToTwelve": () => (/* binding */ twentyFourTimeToTwelve)
/* harmony export */ });
// Used for daily forecast labelling

const daysOfWeek = new Map([
    [0,"Sunday"],
    [1,"Monday"],
    [2,"Tuesday"],
    [3,"Wednesday"],
    [4,"Thursday"],
    [5,"Friday"],
    [6,"Saturday"],
])

function twentyFourTimeToTwelve(time) {

    time = time.toString();
    let split = time.split(":");
    let hour = split[0];
    let minutes = split[1] || '';

    if (hour == 0) hour = "12";
    let hourInt = parseInt(hour);
    let suffix = (hourInt >= 12) ? "PM" : "AM";
    if (hourInt > 12) hourInt -= 12;

    if (minutes) {
        return hourInt.toString() + ':' + minutes + suffix;
    } else {
        return hourInt.toString() + suffix;
    }
    
}

// converts unix timestamp to 24 hour time format

function unixToTimestamp(time) {
    let date = new Date(time * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let formattedTime = hours + ':' + minutes.substr(-2);
    return formattedTime;
}

// converts degree to direction
// http://snowfence.umn.edu/Components/winddirectionanddegrees.htm

function degreeToDirection(degree) {

    if (degree < 0 || degree > 360) {
        throw new Error("Invalid degrees");
    }

    switch (true) {
        case (degree <= 360 || degree < 11.25):
            return "N";
        case (11.25 <= degree < 33.75):
            return "NNE";
        case (33.75 <= degree < 56.25):
            return "NE";
        case (56.25 <= degree < 78.75):
            return "ENE";
        case (78.75 <= degree < 101.25):
            return "E";
        case (101.25 <= degree < 123.75):
            return "ESE";
        case (123.75 <= degree < 146.25):
            return "SE";
        case (146.25 <= degree < 168.75):
            return "SSE";
        case (168.75 <= degree < 191.25):
            return "S";
        case (191.25 <= degree < 213.75):
            return "SSW";
        case (213.75 <= degree < 236.25):
            return "SW";
        case (236.25 <= degree < 258.75):
            return "WSW";
        case (258.75 <= degree < 281.25):
            return "W";
        case (281.25 <= degree < 303.75):
            return "WNW";
        case (303.75 <= degree < 326.25):
            return "NW";
        case (326.25 <= degree < 348.75):
            return "NNW";
    }

    return "Not Found";
}



/***/ }),

/***/ "./src/weatherRequest.js":
/*!*******************************!*\
  !*** ./src/weatherRequest.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getWeather": () => (/* binding */ getWeather)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.js");


// openweatherapi free API key
const API_KEY = '35454c4e786362049cc83e4549cf7217';

// finds error in query and returns them. Returns null otherwise
function verifyQuery(query) {

    if (typeof query != "string") {
        return new Error("Query must be a string.");
    }

    const argc = query.split(',').length;
    const isNum = isNaN(query);

    if (isNum && argc > 2 || !isNum && argc > 3 || argc <= 0) {
        return new Error("Invalid number of arguments in query.");
    }

    return null;
}


async function getCoordinatesByUrl(url) {

    try {
        const response = await fetch (url);
        const data = await response.json();
        const lat = data['coord']['lat'];
        const lon = data['coord']['lon'];
        const name = data['name'];

        return {
            "lat": lat,
            "lon": lon,
            "name": name,
        }
         
    } catch (err) {
        throw new Error(`Error obtaining weather data: ${err}`);
    }
    
}

async function getCoordinatesByCity(cityName, stateCode=null, countryCode=null) {

    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}`;
    if (stateCode) url += "," + stateCode;
    if (countryCode) url += "," + countryCode;
    url += `&appid=${API_KEY}`;
    return await getCoordinatesByUrl(url);

}

async function getCoordinatesByZip(zipCode, countryCode=null) {

    let url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}`;
    if (countryCode) url += "," + countryCode;
    url += `&appid=${API_KEY}`;

    return await getCoordinatesByUrl(url);
}

// takes longitude and latitude of location and returns forecast data
async function getForecastData(lat, lon) {

    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={minutely}&appid=${API_KEY}`;
    let data = await fetch (url);
    return data.json();

}

// takes in object that represents one weather data point from openweatherapi's one call
// takes in type of object, which is either current, daily, or hourly

// returns compressed object that contains only the necessary information
function processWeatherObject(weatherObject, type="current") {

        if (type != "current" && type != "hourly" && type !="daily") {
            throw new Error("Cannot process invalid type of weather object");
        }

        let weatherData;

        if (type == "current") {
            weatherData = {
                "temp": weatherObject["temp"],
                "humidity": weatherObject['humidity'],
                "pressure": weatherObject['pressure'],
                "feel": weatherObject['feels_like'],
                "sunrise": (0,_util__WEBPACK_IMPORTED_MODULE_0__.unixToTimestamp)(weatherObject['sunrise']),
                "sunset": (0,_util__WEBPACK_IMPORTED_MODULE_0__.unixToTimestamp)(weatherObject['sunset']),
                "weather": weatherObject['weather'][0]['main'],
                "weather-icon": weatherObject['weather'][0]['icon'],
                "wind_speed": weatherObject['wind_speed'],
                "wind_degrees": weatherObject['wind_deg'],
                "wind_direction": (0,_util__WEBPACK_IMPORTED_MODULE_0__.degreeToDirection)(weatherObject['wind_deg']),
                "uvi": weatherObject["uvi"],
                "visibility": weatherObject["visibility"],
                "dew point": weatherObject["dew_point"],
            }
        } else if (type == "hourly") {
            weatherData = {
                "temp": weatherObject["temp"],
                "weather": weatherObject['weather'][0]['main'] ,
                "weather-icon": weatherObject['weather'][0]['icon']
            }
        } else if (type == "daily") {
            weatherData = {
                "high": weatherObject["temp"]["max"],
                "low": weatherObject["temp"]["min"],
                "weather": weatherObject['weather'][0]['main'],
                "weather-icon": weatherObject['weather'][0]['icon']
            }
        }

        return weatherData;
}

// takes in object assumed to be obtained by openweatherapi's One Call API call
// returns object containing necessary attributes for display
function parseForecastData(forecastData) {

    const todayForecast = forecastData['daily'][0];
    const current = processWeatherObject(forecastData["current"],"current");
    current["low"] = todayForecast['temp']['min'];
    current["high"] = todayForecast['temp']['max'];

    let dailyForecast = [];
    const today = new Date().getDay();
    for (let i = 1; i < 8; i++) {
        const dayOfWeek = _util__WEBPACK_IMPORTED_MODULE_0__.daysOfWeek.get((today + i) % 7);
        const dataOfDay = forecastData['daily'][i];
        const processedData = processWeatherObject(dataOfDay, "daily");
        processedData["dayOfWeek"] = dayOfWeek;
        dailyForecast.push(processedData);
    }

    let hourlyForecast = [];
    const thisHour = new Date().getHours();

    // start i at 0 or 1 depending on if you want to use current for the hourly forecast
    for (let i = 0; i < 25; i++) {
        const hourOfDay = (thisHour + i) % 24;
        const dataOfHour = forecastData['hourly'][i];
        const processedData = processWeatherObject(dataOfHour, "hourly");
        processedData["hourOfDay"] = hourOfDay;
        hourlyForecast.push(processedData);
    }

    return {
        "current": current,
        "daily-forecast": dailyForecast,
        "hourly-forecast": hourlyForecast
    }

}

// given a string query, this function returns weather data for a particular location
// if the location is not found, an error is returned
async function getWeather(query) {
    
    const error = verifyQuery(query);
    if (error) throw error;

    const isNum = !isNaN(query);

    const args = query.split(",");
    for (let i = 0; i < args.length; i++) {
        args[i] = args[i].trim();
    }

    const coordFunction = (isNum) ? getCoordinatesByZip : getCoordinatesByCity;

    try {
        const coordinates = await coordFunction.apply(null, args);

        const lat = coordinates["lat"];
        const lon = coordinates['lon'];

        const forecastData = await getForecastData(lat, lon);
        // console.log(forecastData);
        let parsedForecastData = parseForecastData(forecastData);
        parsedForecastData['name'] = coordinates['name'];

        // console.log(parsedForecastData);
        return parsedForecastData

    } catch (err) {
        throw new Error(err);
    }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pageRefresh__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pageRefresh */ "./src/pageRefresh.js");


async function loadLocation(query) {
    await (0,_pageRefresh__WEBPACK_IMPORTED_MODULE_0__.fetchWeatherData)(query);
    (0,_pageRefresh__WEBPACK_IMPORTED_MODULE_0__.loadPage)();
}

(0,_pageRefresh__WEBPACK_IMPORTED_MODULE_0__.fetchWeatherData)("London").then(_pageRefresh__WEBPACK_IMPORTED_MODULE_0__.loadPage)

document.getElementById('search-form').onsubmit = event => {
    console.log('starting');
    event.preventDefault();
    let query = document.getElementById('search bar').value;
    loadLocation(query);
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0Esb0JBQW9CLGlCQUFpQjtBQUNyQztBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLE1BQU07QUFDTjtBQUNBO0FBQ0E7Ozs7OztVQ2hNQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTjJEOztBQUUzRDtBQUNBLFVBQVUsOERBQWdCO0FBQzFCLElBQUksc0RBQVE7QUFDWjs7QUFFQSw4REFBZ0IsZ0JBQWdCLGtEQUFROztBQUV4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3BhZ2VSZWZyZXNoLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3V0aWwuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvd2VhdGhlclJlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0d2VudHlGb3VyVGltZVRvVHdlbHZlIH0gZnJvbSBcIi4vdXRpbFwiO1xuaW1wb3J0IHsgZ2V0V2VhdGhlciB9IGZyb20gXCIuL3dlYXRoZXJSZXF1ZXN0XCI7XG5cbmxldCBvYmplY3REYXRhID0ge307XG5sZXQgZGFpbHlGb3JlY2FzdFBhZ2UgPSAxO1xubGV0IHRlbXBVbml0ID0gXCJmXCI7XG5cbmZ1bmN0aW9uIHJlc2V0UGFnZSgpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaG91cmx5LWZvcmVjYXN0LWN0cicpLmlubmVySFRNTCA9ICcnO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkYXlzLWNvbHVtbicpLmlubmVySFRNTCA9ICcnO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWF0aGVyLWNvbHVtbicpLmlubmVySFRNTCA9ICcnO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb3ctY29sdW1uJykuaW5uZXJIVE1MID0gJyc7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hpZ2gtY29sdW1uJykuaW5uZXJIVE1MID0gJyc7XG59XG5cbmZ1bmN0aW9uIG1vdmVEYWlseUZvcmVjYXN0TGVmdCgpIHtcblxuICAgIGNvbnNvbGUubG9nKCdjYWxsaW5nJyk7XG4gICAgaWYgKGRhaWx5Rm9yZWNhc3RQYWdlID4gMSkge1xuICAgICAgICBkYWlseUZvcmVjYXN0UGFnZSAtPSAxO1xuICAgICAgICBsb2FkUGFnZSgpO1xuICAgIH1cblxufVxuXG5mdW5jdGlvbiBtb3ZlRGFpbHlGb3JlY2FzdFJpZ2h0KCkge1xuICAgIFxuICAgIGlmIChkYWlseUZvcmVjYXN0UGFnZSA8IDQpIHtcbiAgICAgICAgZGFpbHlGb3JlY2FzdFBhZ2UgKz0gMTtcbiAgICAgICAgbG9hZFBhZ2UoKTtcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gZ2V0RGFpbHlGb3JlY2FzdEluZGljZXMoKSB7XG5cbiAgICBjb25zb2xlLmxvZyhkYWlseUZvcmVjYXN0UGFnZSk7XG4gICAgc3dpdGNoIChkYWlseUZvcmVjYXN0UGFnZSkge1xuICAgICAgICBjYXNlIDE6IFxuICAgICAgICAgICAgcmV0dXJuIFsxLCA3XTtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgcmV0dXJuIFs3LCAxM107XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJldHVybiBbMTMsIDE5XTtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgcmV0dXJuIFsxOSwgMjVdO1xuICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICByZXR1cm4gWzI1LCAzMV07XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gWzAsIDZdO1xuICAgIH1cblxufVxuXG4vLyB0ZW1wIGlzIGluIGtlbHZpblxuZnVuY3Rpb24gY29udmVydFRlbXAoaykge1xuICAgIGlmICh0ZW1wVW5pdCA9PSAnZicpIHtcbiAgICAgICAgcmV0dXJuIChrIC0gMjczLjE1KSAqICg5IC8gNSkgKyAzMjtcbiAgICB9IGVsc2UgaWYgKHRlbXBVbml0ID09ICdjJykge1xuICAgICAgICByZXR1cm4gayAtIDI3My4xNTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGZldGNoV2VhdGhlckRhdGEgKHF1ZXJ5KSB7XG5cbiAgICB0cnkge1xuICAgICAgICBvYmplY3REYXRhID0gYXdhaXQgZ2V0V2VhdGhlcihxdWVyeSk7XG4gICAgICAgIGNvbnNvbGUubG9nKG9iamVjdERhdGEpXG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJmYWlsZWQgdG8gZmV0Y2ggd2VhdGhlciBkYXRhXCIpO1xuICAgIH1cblxufVxuXG5mdW5jdGlvbiBsb2FkQ3VycmVudEZvcmVjYXN0KCkge1xuXG4gICAgY29uc3QgY3VycmVudERhdGEgPSBvYmplY3REYXRhWydjdXJyZW50J107XG5cbiAgICBsZXQgY2l0eU5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2l0eS1uYW1lJyk7XG4gICAgbGV0IGN1cnJlbnRXZWF0aGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dlYXRoZXInKTtcbiAgICBsZXQgY3VycmVudFRlbXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VycmVudC10ZW1wJyk7XG4gICAgbGV0IGN1cnJlbnRMb3cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VycmVudC1sb3cnKTtcbiAgICBsZXQgY3VycmVudEhpZ2ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VycmVudC1oaWdoJyk7XG5cbiAgICBjb25zdCBjb252ZXJ0ZWRUZW1wID0gIE1hdGgucm91bmQoY29udmVydFRlbXAocGFyc2VJbnQoY3VycmVudERhdGFbJ3RlbXAnXSkpKTtcbiAgICBjb25zdCBjb252ZXJ0ZWRMb3cgPSBNYXRoLnJvdW5kKGNvbnZlcnRUZW1wKHBhcnNlSW50KGN1cnJlbnREYXRhWydsb3cnXSkpKTtcbiAgICBjb25zdCBjb252ZXJ0ZWRIaWdoID0gTWF0aC5yb3VuZChjb252ZXJ0VGVtcChwYXJzZUludChjdXJyZW50RGF0YVsnaGlnaCddKSkpO1xuICAgIGNvbnN0IGN1cnJlbnRVbml0ID0gKHRlbXBVbml0ID09ICdmJykgPyAnRicgOiAnQyc7XG5cbiAgICBjaXR5TmFtZS50ZXh0Q29udGVudCA9IG9iamVjdERhdGFbJ25hbWUnXTtcbiAgICBjdXJyZW50V2VhdGhlci50ZXh0Q29udGVudCA9IGN1cnJlbnREYXRhWyd3ZWF0aGVyJ107XG4gICAgY3VycmVudFRlbXAudGV4dENvbnRlbnQgPSBgJHtjb252ZXJ0ZWRUZW1wfVxcdTAwQjAke2N1cnJlbnRVbml0fWA7XG4gICAgY3VycmVudExvdy50ZXh0Q29udGVudCA9IGBMOiAke2NvbnZlcnRlZExvd31cXHUwMEIwJHtjdXJyZW50VW5pdH0gfGA7XG4gICAgY3VycmVudEhpZ2gudGV4dENvbnRlbnQgPSBgSDogJHtjb252ZXJ0ZWRIaWdofVxcdTAwQjAke2N1cnJlbnRVbml0fWA7XG59XG5cbmZ1bmN0aW9uIGxvYWRIb3VybHlGb3JlY2FzdCgpIHtcblxuICAgIGNvbnN0IGhvdXJseUZvcmVjYXN0RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ob3VybHktZm9yZWNhc3QtY3RyJyk7XG4gICAgY29uc3QgaG91cmx5Rm9yZWNhc3QgPSBvYmplY3REYXRhWydob3VybHktZm9yZWNhc3QnXTtcbiAgICBjb25zdCBjdXJyZW50VW5pdCA9ICh0ZW1wVW5pdCA9PSAnZicpID8gJ0YnIDogJ0MnO1xuXG4gICAgbGV0IGxlZnRBcnJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBsZWZ0QXJyb3cuY2xhc3NMaXN0ID0gWydsZWZ0LWFycm93J107XG4gICAgbGVmdEFycm93LnRleHRDb250ZW50ID0gJ1xcdTIxOTAnO1xuICAgIGxlZnRBcnJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG1vdmVEYWlseUZvcmVjYXN0TGVmdCk7XG4gICAgaG91cmx5Rm9yZWNhc3RFbGVtZW50LmFwcGVuZENoaWxkKGxlZnRBcnJvdyk7XG5cbiAgICBpZiAoZGFpbHlGb3JlY2FzdFBhZ2UgPD0gMSkge1xuICAgICAgICBsZWZ0QXJyb3cuc3R5bGUuY29sb3IgPSAndHJhbnNwYXJlbnQnO1xuICAgICAgICBsZWZ0QXJyb3cuc3R5bGUuY3Vyc29yID0gJ2RlZmF1bHQnO1xuICAgIH1cblxuICAgIGxldCBbbGVmdEluZGV4LCByaWdodEluZGV4XSA9IGdldERhaWx5Rm9yZWNhc3RJbmRpY2VzKCk7XG5cbiAgICBmb3IgKGxldCBpID0gbGVmdEluZGV4OyBpIDwgcmlnaHRJbmRleDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGhvdXJEYXRhID0gaG91cmx5Rm9yZWNhc3RbaV07XG4gICAgICAgIGNvbnN0IHRpbWUgPSB0d2VudHlGb3VyVGltZVRvVHdlbHZlKGhvdXJEYXRhWydob3VyT2ZEYXknXSk7XG4gICAgICAgIGNvbnN0IHRlbXAgPSBNYXRoLnJvdW5kKGNvbnZlcnRUZW1wKHBhcnNlSW50KGhvdXJEYXRhWyd0ZW1wJ10pKSk7XG4gICAgICAgIGNvbnN0IHdlYXRoZXJVcmwgPSBcImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvXCIgKyBob3VyRGF0YVsnd2VhdGhlci1pY29uJ10gKyBcIi5wbmdcIjtcblxuICAgICAgICBsZXQgdGltZVBhcmEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIHRpbWVQYXJhLnRleHRDb250ZW50ID0gdGltZTtcblxuICAgICAgICBsZXQgaWNvbkltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgICBpY29uSW1nLnNyYyA9IHdlYXRoZXJVcmw7XG5cbiAgICAgICAgbGV0IHRlbXBQYXJhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICB0ZW1wUGFyYS50ZXh0Q29udGVudCA9IGAke3RlbXB9XFx1MDBCMCR7Y3VycmVudFVuaXR9YDtcblxuICAgICAgICBsZXQgaG91ck9iamVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBob3VyT2JqZWN0LmFwcGVuZENoaWxkKHRpbWVQYXJhKTtcbiAgICAgICAgaG91ck9iamVjdC5hcHBlbmRDaGlsZChpY29uSW1nKTtcbiAgICAgICAgaG91ck9iamVjdC5hcHBlbmRDaGlsZCh0ZW1wUGFyYSk7XG4gICAgICAgIGhvdXJPYmplY3QuY2xhc3NMaXN0ID0gWydob3VyLWRhdGEnXTtcblxuICAgICAgICBob3VybHlGb3JlY2FzdEVsZW1lbnQuYXBwZW5kQ2hpbGQoaG91ck9iamVjdCk7XG4gICAgfVxuXG4gICAgbGV0IHJpZ2h0QXJyb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgcmlnaHRBcnJvdy5jbGFzc0xpc3QgPSBbJ3JpZ2h0LWFycm93J107XG4gICAgcmlnaHRBcnJvdy50ZXh0Q29udGVudCA9ICdcXHUyMTkyJztcbiAgICByaWdodEFycm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbW92ZURhaWx5Rm9yZWNhc3RSaWdodCk7XG4gICAgaG91cmx5Rm9yZWNhc3RFbGVtZW50LmFwcGVuZENoaWxkKHJpZ2h0QXJyb3cpO1xuXG4gICAgaWYgKGRhaWx5Rm9yZWNhc3RQYWdlID49IDQpIHtcbiAgICAgICAgcmlnaHRBcnJvdy5zdHlsZS5jb2xvciA9ICd0cmFuc3BhcmVudCc7XG4gICAgICAgIHJpZ2h0QXJyb3cuc3R5bGUuY3Vyc29yID0gJ2RlZmF1bHQnO1xuICAgIH1cblxufVxuXG5mdW5jdGlvbiBsb2FkRGFpbHlGb3JlY2FzdCgpIHtcbiAgICBcbiAgICBsZXQgZGF5c0NvbHVtbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkYXlzLWNvbHVtbicpO1xuICAgIGxldCB3ZWF0aGVyQ29sdW1uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dlYXRoZXItY29sdW1uJyk7XG4gICAgbGV0IGxvd0NvbHVtbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb3ctY29sdW1uJyk7XG4gICAgbGV0IGhpZ2hDb2x1bW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGlnaC1jb2x1bW4nKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgaSsrKSB7XG5cbiAgICAgICAgY29uc3QgZGFpbHlEYXRhID0gb2JqZWN0RGF0YVsnZGFpbHktZm9yZWNhc3QnXVtpXTtcbiAgICAgICAgY29uc3QgZGF5T2ZXZWVrID0gZGFpbHlEYXRhWydkYXlPZldlZWsnXTtcbiAgICAgICAgY29uc3QgbG93VGVtcCA9IE1hdGgucm91bmQoY29udmVydFRlbXAocGFyc2VJbnQoZGFpbHlEYXRhWydsb3cnXSkpKTtcbiAgICAgICAgY29uc3QgaGlnaFRlbXAgPSBNYXRoLnJvdW5kKGNvbnZlcnRUZW1wKHBhcnNlSW50KGRhaWx5RGF0YVsnaGlnaCddKSkpO1xuICAgICAgICBjb25zdCB3ZWF0aGVyVXJsID0gXCJodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93L1wiICsgZGFpbHlEYXRhWyd3ZWF0aGVyLWljb24nXSArIFwiLnBuZ1wiO1xuICAgICAgICBjb25zdCBjdXJyZW50VW5pdCA9ICh0ZW1wVW5pdCA9PSAnZicpID8gJ0YnIDogJ0MnO1xuXG4gICAgICAgIGxldCBkYXlQYXJhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBkYXlQYXJhLnRleHRDb250ZW50ID0gZGF5T2ZXZWVrO1xuICAgICAgICBkYXlzQ29sdW1uLmFwcGVuZENoaWxkKGRheVBhcmEpO1xuXG4gICAgICAgIGxldCBpY29uSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgIGljb25JbWcuc3JjID0gd2VhdGhlclVybDtcbiAgICAgICAgd2VhdGhlckNvbHVtbi5hcHBlbmRDaGlsZChpY29uSW1nKTtcbiAgICAgICAgaWNvbkltZy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblxuICAgICAgICBsZXQgbG93UGFyYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgbG93UGFyYS50ZXh0Q29udGVudCA9IGAke2xvd1RlbXB9XFx1MDBCMCR7Y3VycmVudFVuaXR9YDtcbiAgICAgICAgbG93Q29sdW1uLmFwcGVuZENoaWxkKGxvd1BhcmEpO1xuXG4gICAgICAgIGxldCBoaWdoUGFyYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgaGlnaFBhcmEudGV4dENvbnRlbnQgPSBgJHtoaWdoVGVtcH1cXHUwMEIwJHtjdXJyZW50VW5pdH1gO1xuICAgICAgICBoaWdoQ29sdW1uLmFwcGVuZENoaWxkKGhpZ2hQYXJhKTtcbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gbG9hZFdlYXRoZXJJbmZvKCkge1xuXG4gICAgY29uc3QgY3VycmVudERhdGEgPSBvYmplY3REYXRhWydjdXJyZW50J107XG4gICAgY29uc3Qgd2luZFNwZWVkSW1wZXJpYWwgPSBNYXRoLnJvdW5kKDIuMjM2OTQgKiBjdXJyZW50RGF0YVsnd2luZF9zcGVlZCddICogMTAwKSAvIDEwMDtcbiAgICBjb25zdCBjdXJyZW50VW5pdCA9ICh0ZW1wVW5pdCA9PSAnZicpID8gJ0YnIDogJ0MnO1xuXG4gICAgY29uc3QgdGVtcEZlZWwgPSBNYXRoLnJvdW5kKGNvbnZlcnRUZW1wKHBhcnNlSW50KGN1cnJlbnREYXRhWydmZWVsJ10pKSk7XG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5mby1zdW5yaXNlJykudGV4dENvbnRlbnQgPSBcbiAgICAgICAgYCR7dHdlbnR5Rm91clRpbWVUb1R3ZWx2ZShjdXJyZW50RGF0YVsnc3VucmlzZSddKX1gO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbmZvLXN1bnNldCcpLnRleHRDb250ZW50ID0gXG4gICAgICAgIGAke3R3ZW50eUZvdXJUaW1lVG9Ud2VsdmUoY3VycmVudERhdGFbJ3N1bnNldCddKX1gO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbmZvLXdpbmQnKS50ZXh0Q29udGVudCA9IFxuICAgICAgICBgJHtjdXJyZW50RGF0YVsnd2luZF9kaXJlY3Rpb24nXX0gICAgJHt3aW5kU3BlZWRJbXBlcmlhbH0gICAgbXBoYDtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5mby1mZWVsJykudGV4dENvbnRlbnQgPSBcbiAgICAgICAgYCR7dGVtcEZlZWx9XFx1MDBCMCR7Y3VycmVudFVuaXR9YDtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5mby11dmknKS50ZXh0Q29udGVudCA9IFxuICAgICAgICBgJHtjdXJyZW50RGF0YVsndXZpJ119YDtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5mby1kZXcnKS50ZXh0Q29udGVudCA9IFxuICAgICAgICBgJHtjdXJyZW50RGF0YVsnZGV3IHBvaW50J119YDtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5mby1wcmVzc3VyZScpLnRleHRDb250ZW50ID0gXG4gICAgICAgIGAke2N1cnJlbnREYXRhWydwcmVzc3VyZSddfSAgaFBhYDtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5mby1odW1pZGl0eScpLnRleHRDb250ZW50ID0gXG4gICAgICAgIGAke2N1cnJlbnREYXRhWydodW1pZGl0eSddfSVgO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbmZvLXZpc2liaWxpdHknKS50ZXh0Q29udGVudCA9IFxuICAgICAgICBgJHtjdXJyZW50RGF0YVsndmlzaWJpbGl0eSddfSBtYDtcblxufVxuXG5mdW5jdGlvbiBsb2FkUGFnZSgpIHtcbiAgICByZXNldFBhZ2UoKTtcbiAgICBsb2FkQ3VycmVudEZvcmVjYXN0KCk7XG4gICAgbG9hZEhvdXJseUZvcmVjYXN0KCk7XG4gICAgbG9hZERhaWx5Rm9yZWNhc3QoKTtcbiAgICBsb2FkV2VhdGhlckluZm8oKTtcbn1cblxubGV0IHVuaXRDaGVja2JveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1bml0LWNoZWNrYm94Jyk7XG51bml0Q2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgaWYgKHVuaXRDaGVja2JveC5jaGVja2VkKSB7XG4gICAgICAgIHRlbXBVbml0ID0gJ2MnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRlbXBVbml0ID0gJ2YnO1xuICAgIH1cblxuICAgIGxvYWRQYWdlKCk7XG59KTtcblxuZXhwb3J0IHtcbiAgICBmZXRjaFdlYXRoZXJEYXRhLFxuICAgIGxvYWRQYWdlXG59IiwiLy8gVXNlZCBmb3IgZGFpbHkgZm9yZWNhc3QgbGFiZWxsaW5nXG5cbmNvbnN0IGRheXNPZldlZWsgPSBuZXcgTWFwKFtcbiAgICBbMCxcIlN1bmRheVwiXSxcbiAgICBbMSxcIk1vbmRheVwiXSxcbiAgICBbMixcIlR1ZXNkYXlcIl0sXG4gICAgWzMsXCJXZWRuZXNkYXlcIl0sXG4gICAgWzQsXCJUaHVyc2RheVwiXSxcbiAgICBbNSxcIkZyaWRheVwiXSxcbiAgICBbNixcIlNhdHVyZGF5XCJdLFxuXSlcblxuZnVuY3Rpb24gdHdlbnR5Rm91clRpbWVUb1R3ZWx2ZSh0aW1lKSB7XG5cbiAgICB0aW1lID0gdGltZS50b1N0cmluZygpO1xuICAgIGxldCBzcGxpdCA9IHRpbWUuc3BsaXQoXCI6XCIpO1xuICAgIGxldCBob3VyID0gc3BsaXRbMF07XG4gICAgbGV0IG1pbnV0ZXMgPSBzcGxpdFsxXSB8fCAnJztcblxuICAgIGlmIChob3VyID09IDApIGhvdXIgPSBcIjEyXCI7XG4gICAgbGV0IGhvdXJJbnQgPSBwYXJzZUludChob3VyKTtcbiAgICBsZXQgc3VmZml4ID0gKGhvdXJJbnQgPj0gMTIpID8gXCJQTVwiIDogXCJBTVwiO1xuICAgIGlmIChob3VySW50ID4gMTIpIGhvdXJJbnQgLT0gMTI7XG5cbiAgICBpZiAobWludXRlcykge1xuICAgICAgICByZXR1cm4gaG91ckludC50b1N0cmluZygpICsgJzonICsgbWludXRlcyArIHN1ZmZpeDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaG91ckludC50b1N0cmluZygpICsgc3VmZml4O1xuICAgIH1cbiAgICBcbn1cblxuLy8gY29udmVydHMgdW5peCB0aW1lc3RhbXAgdG8gMjQgaG91ciB0aW1lIGZvcm1hdFxuXG5mdW5jdGlvbiB1bml4VG9UaW1lc3RhbXAodGltZSkge1xuICAgIGxldCBkYXRlID0gbmV3IERhdGUodGltZSAqIDEwMDApO1xuICAgIGxldCBob3VycyA9IGRhdGUuZ2V0SG91cnMoKTtcbiAgICBsZXQgbWludXRlcyA9IFwiMFwiICsgZGF0ZS5nZXRNaW51dGVzKCk7XG4gICAgbGV0IGZvcm1hdHRlZFRpbWUgPSBob3VycyArICc6JyArIG1pbnV0ZXMuc3Vic3RyKC0yKTtcbiAgICByZXR1cm4gZm9ybWF0dGVkVGltZTtcbn1cblxuLy8gY29udmVydHMgZGVncmVlIHRvIGRpcmVjdGlvblxuLy8gaHR0cDovL3Nub3dmZW5jZS51bW4uZWR1L0NvbXBvbmVudHMvd2luZGRpcmVjdGlvbmFuZGRlZ3JlZXMuaHRtXG5cbmZ1bmN0aW9uIGRlZ3JlZVRvRGlyZWN0aW9uKGRlZ3JlZSkge1xuXG4gICAgaWYgKGRlZ3JlZSA8IDAgfHwgZGVncmVlID4gMzYwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgZGVncmVlc1wiKTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgY2FzZSAoZGVncmVlIDw9IDM2MCB8fCBkZWdyZWUgPCAxMS4yNSk6XG4gICAgICAgICAgICByZXR1cm4gXCJOXCI7XG4gICAgICAgIGNhc2UgKDExLjI1IDw9IGRlZ3JlZSA8IDMzLjc1KTpcbiAgICAgICAgICAgIHJldHVybiBcIk5ORVwiO1xuICAgICAgICBjYXNlICgzMy43NSA8PSBkZWdyZWUgPCA1Ni4yNSk6XG4gICAgICAgICAgICByZXR1cm4gXCJORVwiO1xuICAgICAgICBjYXNlICg1Ni4yNSA8PSBkZWdyZWUgPCA3OC43NSk6XG4gICAgICAgICAgICByZXR1cm4gXCJFTkVcIjtcbiAgICAgICAgY2FzZSAoNzguNzUgPD0gZGVncmVlIDwgMTAxLjI1KTpcbiAgICAgICAgICAgIHJldHVybiBcIkVcIjtcbiAgICAgICAgY2FzZSAoMTAxLjI1IDw9IGRlZ3JlZSA8IDEyMy43NSk6XG4gICAgICAgICAgICByZXR1cm4gXCJFU0VcIjtcbiAgICAgICAgY2FzZSAoMTIzLjc1IDw9IGRlZ3JlZSA8IDE0Ni4yNSk6XG4gICAgICAgICAgICByZXR1cm4gXCJTRVwiO1xuICAgICAgICBjYXNlICgxNDYuMjUgPD0gZGVncmVlIDwgMTY4Ljc1KTpcbiAgICAgICAgICAgIHJldHVybiBcIlNTRVwiO1xuICAgICAgICBjYXNlICgxNjguNzUgPD0gZGVncmVlIDwgMTkxLjI1KTpcbiAgICAgICAgICAgIHJldHVybiBcIlNcIjtcbiAgICAgICAgY2FzZSAoMTkxLjI1IDw9IGRlZ3JlZSA8IDIxMy43NSk6XG4gICAgICAgICAgICByZXR1cm4gXCJTU1dcIjtcbiAgICAgICAgY2FzZSAoMjEzLjc1IDw9IGRlZ3JlZSA8IDIzNi4yNSk6XG4gICAgICAgICAgICByZXR1cm4gXCJTV1wiO1xuICAgICAgICBjYXNlICgyMzYuMjUgPD0gZGVncmVlIDwgMjU4Ljc1KTpcbiAgICAgICAgICAgIHJldHVybiBcIldTV1wiO1xuICAgICAgICBjYXNlICgyNTguNzUgPD0gZGVncmVlIDwgMjgxLjI1KTpcbiAgICAgICAgICAgIHJldHVybiBcIldcIjtcbiAgICAgICAgY2FzZSAoMjgxLjI1IDw9IGRlZ3JlZSA8IDMwMy43NSk6XG4gICAgICAgICAgICByZXR1cm4gXCJXTldcIjtcbiAgICAgICAgY2FzZSAoMzAzLjc1IDw9IGRlZ3JlZSA8IDMyNi4yNSk6XG4gICAgICAgICAgICByZXR1cm4gXCJOV1wiO1xuICAgICAgICBjYXNlICgzMjYuMjUgPD0gZGVncmVlIDwgMzQ4Ljc1KTpcbiAgICAgICAgICAgIHJldHVybiBcIk5OV1wiO1xuICAgIH1cblxuICAgIHJldHVybiBcIk5vdCBGb3VuZFwiO1xufVxuXG5leHBvcnQge1xuICAgIGRheXNPZldlZWssXG4gICAgdW5peFRvVGltZXN0YW1wLFxuICAgIGRlZ3JlZVRvRGlyZWN0aW9uLFxuICAgIHR3ZW50eUZvdXJUaW1lVG9Ud2VsdmVcbn0iLCJpbXBvcnQgeyB1bml4VG9UaW1lc3RhbXAsIGRlZ3JlZVRvRGlyZWN0aW9uLCBkYXlzT2ZXZWVrIH0gZnJvbSBcIi4vdXRpbFwiO1xuXG4vLyBvcGVud2VhdGhlcmFwaSBmcmVlIEFQSSBrZXlcbmNvbnN0IEFQSV9LRVkgPSAnMzU0NTRjNGU3ODYzNjIwNDljYzgzZTQ1NDljZjcyMTcnO1xuXG4vLyBmaW5kcyBlcnJvciBpbiBxdWVyeSBhbmQgcmV0dXJucyB0aGVtLiBSZXR1cm5zIG51bGwgb3RoZXJ3aXNlXG5mdW5jdGlvbiB2ZXJpZnlRdWVyeShxdWVyeSkge1xuXG4gICAgaWYgKHR5cGVvZiBxdWVyeSAhPSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJRdWVyeSBtdXN0IGJlIGEgc3RyaW5nLlwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBhcmdjID0gcXVlcnkuc3BsaXQoJywnKS5sZW5ndGg7XG4gICAgY29uc3QgaXNOdW0gPSBpc05hTihxdWVyeSk7XG5cbiAgICBpZiAoaXNOdW0gJiYgYXJnYyA+IDIgfHwgIWlzTnVtICYmIGFyZ2MgPiAzIHx8IGFyZ2MgPD0gMCkge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwiSW52YWxpZCBudW1iZXIgb2YgYXJndW1lbnRzIGluIHF1ZXJ5LlwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuXG5hc3luYyBmdW5jdGlvbiBnZXRDb29yZGluYXRlc0J5VXJsKHVybCkge1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCAodXJsKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgY29uc3QgbGF0ID0gZGF0YVsnY29vcmQnXVsnbGF0J107XG4gICAgICAgIGNvbnN0IGxvbiA9IGRhdGFbJ2Nvb3JkJ11bJ2xvbiddO1xuICAgICAgICBjb25zdCBuYW1lID0gZGF0YVsnbmFtZSddO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcImxhdFwiOiBsYXQsXG4gICAgICAgICAgICBcImxvblwiOiBsb24sXG4gICAgICAgICAgICBcIm5hbWVcIjogbmFtZSxcbiAgICAgICAgfVxuICAgICAgICAgXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3Igb2J0YWluaW5nIHdlYXRoZXIgZGF0YTogJHtlcnJ9YCk7XG4gICAgfVxuICAgIFxufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRDb29yZGluYXRlc0J5Q2l0eShjaXR5TmFtZSwgc3RhdGVDb2RlPW51bGwsIGNvdW50cnlDb2RlPW51bGwpIHtcblxuICAgIGNpdHlOYW1lID0gY2l0eU5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjaXR5TmFtZS5zbGljZSgxKTtcbiAgICBsZXQgdXJsID0gYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP3E9JHtjaXR5TmFtZX1gO1xuICAgIGlmIChzdGF0ZUNvZGUpIHVybCArPSBcIixcIiArIHN0YXRlQ29kZTtcbiAgICBpZiAoY291bnRyeUNvZGUpIHVybCArPSBcIixcIiArIGNvdW50cnlDb2RlO1xuICAgIHVybCArPSBgJmFwcGlkPSR7QVBJX0tFWX1gO1xuICAgIHJldHVybiBhd2FpdCBnZXRDb29yZGluYXRlc0J5VXJsKHVybCk7XG5cbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0Q29vcmRpbmF0ZXNCeVppcCh6aXBDb2RlLCBjb3VudHJ5Q29kZT1udWxsKSB7XG5cbiAgICBsZXQgdXJsID0gYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP3ppcD0ke3ppcENvZGV9YDtcbiAgICBpZiAoY291bnRyeUNvZGUpIHVybCArPSBcIixcIiArIGNvdW50cnlDb2RlO1xuICAgIHVybCArPSBgJmFwcGlkPSR7QVBJX0tFWX1gO1xuXG4gICAgcmV0dXJuIGF3YWl0IGdldENvb3JkaW5hdGVzQnlVcmwodXJsKTtcbn1cblxuLy8gdGFrZXMgbG9uZ2l0dWRlIGFuZCBsYXRpdHVkZSBvZiBsb2NhdGlvbiBhbmQgcmV0dXJucyBmb3JlY2FzdCBkYXRhXG5hc3luYyBmdW5jdGlvbiBnZXRGb3JlY2FzdERhdGEobGF0LCBsb24pIHtcblxuICAgIGNvbnN0IHVybCA9IGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvb25lY2FsbD9sYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mZXhjbHVkZT17bWludXRlbHl9JmFwcGlkPSR7QVBJX0tFWX1gO1xuICAgIGxldCBkYXRhID0gYXdhaXQgZmV0Y2ggKHVybCk7XG4gICAgcmV0dXJuIGRhdGEuanNvbigpO1xuXG59XG5cbi8vIHRha2VzIGluIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgb25lIHdlYXRoZXIgZGF0YSBwb2ludCBmcm9tIG9wZW53ZWF0aGVyYXBpJ3Mgb25lIGNhbGxcbi8vIHRha2VzIGluIHR5cGUgb2Ygb2JqZWN0LCB3aGljaCBpcyBlaXRoZXIgY3VycmVudCwgZGFpbHksIG9yIGhvdXJseVxuXG4vLyByZXR1cm5zIGNvbXByZXNzZWQgb2JqZWN0IHRoYXQgY29udGFpbnMgb25seSB0aGUgbmVjZXNzYXJ5IGluZm9ybWF0aW9uXG5mdW5jdGlvbiBwcm9jZXNzV2VhdGhlck9iamVjdCh3ZWF0aGVyT2JqZWN0LCB0eXBlPVwiY3VycmVudFwiKSB7XG5cbiAgICAgICAgaWYgKHR5cGUgIT0gXCJjdXJyZW50XCIgJiYgdHlwZSAhPSBcImhvdXJseVwiICYmIHR5cGUgIT1cImRhaWx5XCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBwcm9jZXNzIGludmFsaWQgdHlwZSBvZiB3ZWF0aGVyIG9iamVjdFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB3ZWF0aGVyRGF0YTtcblxuICAgICAgICBpZiAodHlwZSA9PSBcImN1cnJlbnRcIikge1xuICAgICAgICAgICAgd2VhdGhlckRhdGEgPSB7XG4gICAgICAgICAgICAgICAgXCJ0ZW1wXCI6IHdlYXRoZXJPYmplY3RbXCJ0ZW1wXCJdLFxuICAgICAgICAgICAgICAgIFwiaHVtaWRpdHlcIjogd2VhdGhlck9iamVjdFsnaHVtaWRpdHknXSxcbiAgICAgICAgICAgICAgICBcInByZXNzdXJlXCI6IHdlYXRoZXJPYmplY3RbJ3ByZXNzdXJlJ10sXG4gICAgICAgICAgICAgICAgXCJmZWVsXCI6IHdlYXRoZXJPYmplY3RbJ2ZlZWxzX2xpa2UnXSxcbiAgICAgICAgICAgICAgICBcInN1bnJpc2VcIjogdW5peFRvVGltZXN0YW1wKHdlYXRoZXJPYmplY3RbJ3N1bnJpc2UnXSksXG4gICAgICAgICAgICAgICAgXCJzdW5zZXRcIjogdW5peFRvVGltZXN0YW1wKHdlYXRoZXJPYmplY3RbJ3N1bnNldCddKSxcbiAgICAgICAgICAgICAgICBcIndlYXRoZXJcIjogd2VhdGhlck9iamVjdFsnd2VhdGhlciddWzBdWydtYWluJ10sXG4gICAgICAgICAgICAgICAgXCJ3ZWF0aGVyLWljb25cIjogd2VhdGhlck9iamVjdFsnd2VhdGhlciddWzBdWydpY29uJ10sXG4gICAgICAgICAgICAgICAgXCJ3aW5kX3NwZWVkXCI6IHdlYXRoZXJPYmplY3RbJ3dpbmRfc3BlZWQnXSxcbiAgICAgICAgICAgICAgICBcIndpbmRfZGVncmVlc1wiOiB3ZWF0aGVyT2JqZWN0Wyd3aW5kX2RlZyddLFxuICAgICAgICAgICAgICAgIFwid2luZF9kaXJlY3Rpb25cIjogZGVncmVlVG9EaXJlY3Rpb24od2VhdGhlck9iamVjdFsnd2luZF9kZWcnXSksXG4gICAgICAgICAgICAgICAgXCJ1dmlcIjogd2VhdGhlck9iamVjdFtcInV2aVwiXSxcbiAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogd2VhdGhlck9iamVjdFtcInZpc2liaWxpdHlcIl0sXG4gICAgICAgICAgICAgICAgXCJkZXcgcG9pbnRcIjogd2VhdGhlck9iamVjdFtcImRld19wb2ludFwiXSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiaG91cmx5XCIpIHtcbiAgICAgICAgICAgIHdlYXRoZXJEYXRhID0ge1xuICAgICAgICAgICAgICAgIFwidGVtcFwiOiB3ZWF0aGVyT2JqZWN0W1widGVtcFwiXSxcbiAgICAgICAgICAgICAgICBcIndlYXRoZXJcIjogd2VhdGhlck9iamVjdFsnd2VhdGhlciddWzBdWydtYWluJ10gLFxuICAgICAgICAgICAgICAgIFwid2VhdGhlci1pY29uXCI6IHdlYXRoZXJPYmplY3RbJ3dlYXRoZXInXVswXVsnaWNvbiddXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcImRhaWx5XCIpIHtcbiAgICAgICAgICAgIHdlYXRoZXJEYXRhID0ge1xuICAgICAgICAgICAgICAgIFwiaGlnaFwiOiB3ZWF0aGVyT2JqZWN0W1widGVtcFwiXVtcIm1heFwiXSxcbiAgICAgICAgICAgICAgICBcImxvd1wiOiB3ZWF0aGVyT2JqZWN0W1widGVtcFwiXVtcIm1pblwiXSxcbiAgICAgICAgICAgICAgICBcIndlYXRoZXJcIjogd2VhdGhlck9iamVjdFsnd2VhdGhlciddWzBdWydtYWluJ10sXG4gICAgICAgICAgICAgICAgXCJ3ZWF0aGVyLWljb25cIjogd2VhdGhlck9iamVjdFsnd2VhdGhlciddWzBdWydpY29uJ11cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3ZWF0aGVyRGF0YTtcbn1cblxuLy8gdGFrZXMgaW4gb2JqZWN0IGFzc3VtZWQgdG8gYmUgb2J0YWluZWQgYnkgb3BlbndlYXRoZXJhcGkncyBPbmUgQ2FsbCBBUEkgY2FsbFxuLy8gcmV0dXJucyBvYmplY3QgY29udGFpbmluZyBuZWNlc3NhcnkgYXR0cmlidXRlcyBmb3IgZGlzcGxheVxuZnVuY3Rpb24gcGFyc2VGb3JlY2FzdERhdGEoZm9yZWNhc3REYXRhKSB7XG5cbiAgICBjb25zdCB0b2RheUZvcmVjYXN0ID0gZm9yZWNhc3REYXRhWydkYWlseSddWzBdO1xuICAgIGNvbnN0IGN1cnJlbnQgPSBwcm9jZXNzV2VhdGhlck9iamVjdChmb3JlY2FzdERhdGFbXCJjdXJyZW50XCJdLFwiY3VycmVudFwiKTtcbiAgICBjdXJyZW50W1wibG93XCJdID0gdG9kYXlGb3JlY2FzdFsndGVtcCddWydtaW4nXTtcbiAgICBjdXJyZW50W1wiaGlnaFwiXSA9IHRvZGF5Rm9yZWNhc3RbJ3RlbXAnXVsnbWF4J107XG5cbiAgICBsZXQgZGFpbHlGb3JlY2FzdCA9IFtdO1xuICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKS5nZXREYXkoKTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IDg7IGkrKykge1xuICAgICAgICBjb25zdCBkYXlPZldlZWsgPSBkYXlzT2ZXZWVrLmdldCgodG9kYXkgKyBpKSAlIDcpO1xuICAgICAgICBjb25zdCBkYXRhT2ZEYXkgPSBmb3JlY2FzdERhdGFbJ2RhaWx5J11baV07XG4gICAgICAgIGNvbnN0IHByb2Nlc3NlZERhdGEgPSBwcm9jZXNzV2VhdGhlck9iamVjdChkYXRhT2ZEYXksIFwiZGFpbHlcIik7XG4gICAgICAgIHByb2Nlc3NlZERhdGFbXCJkYXlPZldlZWtcIl0gPSBkYXlPZldlZWs7XG4gICAgICAgIGRhaWx5Rm9yZWNhc3QucHVzaChwcm9jZXNzZWREYXRhKTtcbiAgICB9XG5cbiAgICBsZXQgaG91cmx5Rm9yZWNhc3QgPSBbXTtcbiAgICBjb25zdCB0aGlzSG91ciA9IG5ldyBEYXRlKCkuZ2V0SG91cnMoKTtcblxuICAgIC8vIHN0YXJ0IGkgYXQgMCBvciAxIGRlcGVuZGluZyBvbiBpZiB5b3Ugd2FudCB0byB1c2UgY3VycmVudCBmb3IgdGhlIGhvdXJseSBmb3JlY2FzdFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjU7IGkrKykge1xuICAgICAgICBjb25zdCBob3VyT2ZEYXkgPSAodGhpc0hvdXIgKyBpKSAlIDI0O1xuICAgICAgICBjb25zdCBkYXRhT2ZIb3VyID0gZm9yZWNhc3REYXRhWydob3VybHknXVtpXTtcbiAgICAgICAgY29uc3QgcHJvY2Vzc2VkRGF0YSA9IHByb2Nlc3NXZWF0aGVyT2JqZWN0KGRhdGFPZkhvdXIsIFwiaG91cmx5XCIpO1xuICAgICAgICBwcm9jZXNzZWREYXRhW1wiaG91ck9mRGF5XCJdID0gaG91ck9mRGF5O1xuICAgICAgICBob3VybHlGb3JlY2FzdC5wdXNoKHByb2Nlc3NlZERhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIFwiY3VycmVudFwiOiBjdXJyZW50LFxuICAgICAgICBcImRhaWx5LWZvcmVjYXN0XCI6IGRhaWx5Rm9yZWNhc3QsXG4gICAgICAgIFwiaG91cmx5LWZvcmVjYXN0XCI6IGhvdXJseUZvcmVjYXN0XG4gICAgfVxuXG59XG5cbi8vIGdpdmVuIGEgc3RyaW5nIHF1ZXJ5LCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgd2VhdGhlciBkYXRhIGZvciBhIHBhcnRpY3VsYXIgbG9jYXRpb25cbi8vIGlmIHRoZSBsb2NhdGlvbiBpcyBub3QgZm91bmQsIGFuIGVycm9yIGlzIHJldHVybmVkXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0V2VhdGhlcihxdWVyeSkge1xuICAgIFxuICAgIGNvbnN0IGVycm9yID0gdmVyaWZ5UXVlcnkocXVlcnkpO1xuICAgIGlmIChlcnJvcikgdGhyb3cgZXJyb3I7XG5cbiAgICBjb25zdCBpc051bSA9ICFpc05hTihxdWVyeSk7XG5cbiAgICBjb25zdCBhcmdzID0gcXVlcnkuc3BsaXQoXCIsXCIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICBhcmdzW2ldID0gYXJnc1tpXS50cmltKCk7XG4gICAgfVxuXG4gICAgY29uc3QgY29vcmRGdW5jdGlvbiA9IChpc051bSkgPyBnZXRDb29yZGluYXRlc0J5WmlwIDogZ2V0Q29vcmRpbmF0ZXNCeUNpdHk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCBjb29yZGluYXRlcyA9IGF3YWl0IGNvb3JkRnVuY3Rpb24uYXBwbHkobnVsbCwgYXJncyk7XG5cbiAgICAgICAgY29uc3QgbGF0ID0gY29vcmRpbmF0ZXNbXCJsYXRcIl07XG4gICAgICAgIGNvbnN0IGxvbiA9IGNvb3JkaW5hdGVzWydsb24nXTtcblxuICAgICAgICBjb25zdCBmb3JlY2FzdERhdGEgPSBhd2FpdCBnZXRGb3JlY2FzdERhdGEobGF0LCBsb24pO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhmb3JlY2FzdERhdGEpO1xuICAgICAgICBsZXQgcGFyc2VkRm9yZWNhc3REYXRhID0gcGFyc2VGb3JlY2FzdERhdGEoZm9yZWNhc3REYXRhKTtcbiAgICAgICAgcGFyc2VkRm9yZWNhc3REYXRhWyduYW1lJ10gPSBjb29yZGluYXRlc1snbmFtZSddO1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBhcnNlZEZvcmVjYXN0RGF0YSk7XG4gICAgICAgIHJldHVybiBwYXJzZWRGb3JlY2FzdERhdGFcblxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyKTtcbiAgICB9XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBmZXRjaFdlYXRoZXJEYXRhLCBsb2FkUGFnZSB9IGZyb20gXCIuL3BhZ2VSZWZyZXNoXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIGxvYWRMb2NhdGlvbihxdWVyeSkge1xuICAgIGF3YWl0IGZldGNoV2VhdGhlckRhdGEocXVlcnkpO1xuICAgIGxvYWRQYWdlKCk7XG59XG5cbmZldGNoV2VhdGhlckRhdGEoXCJMb25kb25cIikudGhlbihsb2FkUGFnZSlcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1mb3JtJykub25zdWJtaXQgPSBldmVudCA9PiB7XG4gICAgY29uc29sZS5sb2coJ3N0YXJ0aW5nJyk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgcXVlcnkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoIGJhcicpLnZhbHVlO1xuICAgIGxvYWRMb2NhdGlvbihxdWVyeSk7XG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9