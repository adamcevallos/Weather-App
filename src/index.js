import { fetchWeatherData, loadPage } from "./pageRefresh";

async function loadLocation(query) {
    await fetchWeatherData(query);
    loadPage();
}

fetchWeatherData("London").then(loadPage)

document.getElementById('search-form').onsubmit = event => {
    console.log('starting');
    event.preventDefault();
    let query = document.getElementById('search bar').value;
    loadLocation(query);
}