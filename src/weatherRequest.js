import { unixToTimestamp, degreeToDirection, daysOfWeek } from "./util";

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

    console.log(url);

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
                "sunrise": unixToTimestamp(weatherObject['sunrise']),
                "sunset": unixToTimestamp(weatherObject['sunset']),
                "weather": weatherObject['weather'][0]['main'],
                "wind_speed": weatherObject['wind_speed'],
                "wind_degrees": weatherObject['wind_deg'],
                "wind_direction": degreeToDirection(weatherObject['wind_deg']),
                "uvi": weatherObject["uvi"],
                "visibility": weatherObject["visibility"],
                "dew point": weatherObject["dew_point"],
            }
        } else if (type == "hourly") {
            weatherData = {
                "temp": weatherObject["temp"],
                "weather": weatherObject['weather'][0]['main'] 
            }
        } else if (type == "daily") {
            weatherData = {
                "high": weatherObject["temp"]["max"],
                "low": weatherObject["temp"]["min"],
                "weather": weatherObject['weather'][0]['main'] 
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
        const dayOfWeek = daysOfWeek.get((today + i) % 7);
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
export async function getWeather(query) {
    
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
        console.log(forecastData)
        let parsedForecastData = parseForecastData(forecastData);
        parsedForecastData['name'] = coordinates['name'];

        console.log(parsedForecastData);
        return parsedForecastData

    } catch (err) {
        throw new Error(err);
    }
}