import { twentyFourTimeToTwelve } from "./util";
import { getWeather } from "./weatherRequest";

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
        objectData = await getWeather(query);
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
        const time = twentyFourTimeToTwelve(hourData['hourOfDay']);
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
        `${twentyFourTimeToTwelve(currentData['sunrise'])}`;
    document.getElementById('info-sunset').textContent = 
        `${twentyFourTimeToTwelve(currentData['sunset'])}`;
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

export {
    fetchWeatherData,
    loadPage
}