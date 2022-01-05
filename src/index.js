import { getWeather } from "./weatherRequest";

let query = prompt("Enter location for weather: ");
getWeather(query);