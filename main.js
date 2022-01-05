/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _weatherRequest__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./weatherRequest */ \"./src/weatherRequest.js\");\n\n\nlet query = prompt(\"Enter location for weather: \");\n(0,_weatherRequest__WEBPACK_IMPORTED_MODULE_0__.getWeather)(query);\n\n//# sourceURL=webpack://weather-app/./src/index.js?");

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"daysOfWeek\": () => (/* binding */ daysOfWeek),\n/* harmony export */   \"unixToTimestamp\": () => (/* binding */ unixToTimestamp),\n/* harmony export */   \"degreeToDirection\": () => (/* binding */ degreeToDirection)\n/* harmony export */ });\nconst daysOfWeek = new Map([\n    [0,\"Sunday\"],\n    [1,\"Monday\"],\n    [2,\"Tuesday\"],\n    [3,\"Wednesday\"],\n    [4,\"Thursday\"],\n    [5,\"Friday\"],\n    [6,\"Saturday\"],\n])\n\n// converts unix timestamp to 24 hour time format\n\nfunction unixToTimestamp(time) {\n    let date = new Date(time * 1000);\n    let hours = date.getHours();\n    let minutes = \"0\" + date.getMinutes();\n    let formattedTime = hours + ':' + minutes.substr(-2);\n    return formattedTime;\n}\n\n// converts degree to direction\n// http://snowfence.umn.edu/Components/winddirectionanddegrees.htm\n\nfunction degreeToDirection(degree) {\n\n    if (degree < 0 || degree > 360) {\n        throw new Error(\"Invalid degrees\");\n    }\n\n    switch (true) {\n        case (degree <= 360 || degree < 11.25):\n            return \"N\";\n        case (11.25 <= degree < 33.75):\n            return \"NNE\";\n        case (33.75 <= degree < 56.25):\n            return \"NE\";\n        case (56.25 <= degree < 78.75):\n            return \"ENE\";\n        case (78.75 <= degree < 101.25):\n            return \"E\";\n        case (101.25 <= degree < 123.75):\n            return \"ESE\";\n        case (123.75 <= degree < 146.25):\n            return \"SE\";\n        case (146.25 <= degree < 168.75):\n            return \"SSE\";\n        case (168.75 <= degree < 191.25):\n            return \"S\";\n        case (191.25 <= degree < 213.75):\n            return \"SSW\";\n        case (213.75 <= degree < 236.25):\n            return \"SW\";\n        case (236.25 <= degree < 258.75):\n            return \"WSW\";\n        case (258.75 <= degree < 281.25):\n            return \"W\";\n        case (281.25 <= degree < 303.75):\n            return \"WNW\";\n        case (303.75 <= degree < 326.25):\n            return \"NW\";\n        case (326.25 <= degree < 348.75):\n            return \"NNW\";\n    }\n\n    return \"Not Found\";\n}\n\n\n\n//# sourceURL=webpack://weather-app/./src/util.js?");

/***/ }),

/***/ "./src/weatherRequest.js":
/*!*******************************!*\
  !*** ./src/weatherRequest.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getWeather\": () => (/* binding */ getWeather)\n/* harmony export */ });\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ \"./src/util.js\");\n\n\n// openweatherapi free API key\nconst API_KEY = '35454c4e786362049cc83e4549cf7217';\n\n// finds error in query and returns them. Returns null otherwise\nfunction verifyQuery(query) {\n\n    if (typeof query != \"string\") {\n        return new Error(\"Query must be a string.\");\n    }\n\n    const argc = query.split(',').length;\n    const isNum = isNaN(query);\n\n    if (isNum && argc > 2 || !isNum && argc > 3 || argc <= 0) {\n        return new Error(\"Invalid number of arguments in query.\");\n    }\n\n    return null;\n}\n\n\nasync function getCoordinatesByUrl(url) {\n\n    console.log(url);\n\n    try {\n        const response = await fetch (url);\n        const data = await response.json();\n        const lat = data['coord']['lat'];\n        const lon = data['coord']['lon'];\n        const name = data['name'];\n\n        return {\n            \"lat\": lat,\n            \"lon\": lon,\n            \"name\": name,\n        }\n         \n    } catch (err) {\n        throw new Error(`Error obtaining weather data: ${err}`);\n    }\n    \n}\n\nasync function getCoordinatesByCity(cityName, stateCode=null, countryCode=null) {\n\n    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);\n    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}`;\n    if (stateCode) url += \",\" + stateCode;\n    if (countryCode) url += \",\" + countryCode;\n    url += `&appid=${API_KEY}`;\n    return await getCoordinatesByUrl(url);\n\n}\n\nasync function getCoordinatesByZip(zipCode, countryCode=null) {\n\n    let url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}`;\n    if (countryCode) url += \",\" + countryCode;\n    url += `&appid=${API_KEY}`;\n\n    return await getCoordinatesByUrl(url);\n}\n\n// takes longitude and latitude of location and returns forecast data\nasync function getForecastData(lat, lon) {\n\n    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={minutely}&appid=${API_KEY}`;\n    let data = await fetch (url);\n    return data.json();\n\n}\n\n// takes in object that represents one weather data point from openweatherapi's one call\n// takes in type of object, which is either current, daily, or hourly\n\n// returns compressed object that contains only the necessary information\nfunction processWeatherObject(weatherObject, type=\"current\") {\n\n        if (type != \"current\" && type != \"hourly\" && type !=\"daily\") {\n            throw new Error(\"Cannot process invalid type of weather object\");\n        }\n\n        let weatherData;\n\n        if (type == \"current\") {\n            weatherData = {\n                \"temp\": weatherObject[\"temp\"],\n                \"humidity\": weatherObject['humidity'],\n                \"pressure\": weatherObject['pressure'],\n                \"feel\": weatherObject['feels_like'],\n                \"sunrise\": (0,_util__WEBPACK_IMPORTED_MODULE_0__.unixToTimestamp)(weatherObject['sunrise']),\n                \"sunset\": (0,_util__WEBPACK_IMPORTED_MODULE_0__.unixToTimestamp)(weatherObject['sunset']),\n                \"weather\": weatherObject['weather'][0]['main'],\n                \"wind_speed\": weatherObject['wind_speed'],\n                \"wind_degrees\": weatherObject['wind_deg'],\n                \"wind_direction\": (0,_util__WEBPACK_IMPORTED_MODULE_0__.degreeToDirection)(weatherObject['wind_deg']),\n            }\n        } else if (type == \"hourly\") {\n            weatherData = {\n                \"temp\": weatherObject[\"temp\"],\n                \"weather\": weatherObject['weather'][0]['main'] \n            }\n        } else if (type == \"daily\") {\n            weatherData = {\n                \"high\": weatherObject[\"temp\"][\"max\"],\n                \"low\": weatherObject[\"temp\"][\"min\"],\n                \"weather\": weatherObject['weather'][0]['main'] \n            }\n        }\n\n        return weatherData;\n}\n\n// takes in object assumed to be obtained by openweatherapi's One Call API call\n// returns object containing necessary attributes for display\nfunction parseForecastData(forecastData) {\n\n    const todayForecast = forecastData['daily'][0];\n    const current = processWeatherObject(forecastData[\"current\"],\"current\");\n    current[\"low\"] = todayForecast['temp']['min'];\n    current[\"high\"] = todayForecast['temp']['max'];\n\n    let dailyForecast = [];\n    const today = new Date().getDay();\n    for (let i = 1; i < 8; i++) {\n        const dayOfWeek = _util__WEBPACK_IMPORTED_MODULE_0__.daysOfWeek.get((today + i) % 7);\n        const dataOfDay = forecastData['daily'][i];\n        const processedData = processWeatherObject(dataOfDay, \"daily\");\n        processedData[\"dayOfWeek\"] = dayOfWeek;\n        dailyForecast.push(processedData);\n    }\n\n    let hourlyForecast = [];\n    const thisHour = new Date().getHours();\n\n    // start i at 0 or 1 depending on if you want to use current for the hourly forecast\n    for (let i = 0; i < 25; i++) {\n        const hourOfDay = (thisHour + i) % 24;\n        const dataOfHour = forecastData['hourly'][i];\n        const processedData = processWeatherObject(dataOfHour, \"hourly\");\n        processedData[\"hourOfDay\"] = hourOfDay;\n        hourlyForecast.push(processedData);\n    }\n\n    return {\n        \"current\": current,\n        \"daily-forecast\": dailyForecast,\n        \"hourly-forecast\": hourlyForecast\n    }\n\n}\n\n// given a string query, this function returns weather data for a particular location\n// if the location is not found, an error is returned\nasync function getWeather(query) {\n    \n    const error = verifyQuery(query);\n    if (error) throw error;\n\n    const isNum = !isNaN(query);\n\n    const args = query.split(\",\");\n    for (let i = 0; i < args.length; i++) {\n        args[i] = args[i].trim();\n    }\n\n    const coordFunction = (isNum) ? getCoordinatesByZip : getCoordinatesByCity;\n\n    try {\n        const coordinates = await coordFunction.apply(null, args);\n\n        const lat = coordinates[\"lat\"];\n        const lon = coordinates['lon'];\n\n        const forecastData = await getForecastData(lat, lon);\n        let parsedForecastData = parseForecastData(forecastData);\n        parsedForecastData['name'] = coordinates['name'];\n\n        console.log(parsedForecastData);\n        return parsedForecastData\n\n    } catch (err) {\n        throw new Error(err);\n    }\n}\n\n//# sourceURL=webpack://weather-app/./src/weatherRequest.js?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;