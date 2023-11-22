let lat_lon = prompt('To show the weather temperature anywhere Enter Google Maps : https://www.google.com/maps  And search for any region and copy latitude and longitude for this area, and Focus on the separator and space between latitude and longitude ", ".', `33.510414, 36.278336`);
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timeZone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForCastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", ];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul ", "Aug", "Sep", "Oct", "Nov", "Dec", ];

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const amPm = hour >= 12 ? "PM" : "AM";

    timeEl.innerHTML = `${hoursIn12HrFormat}:${minutes > 9 ? minutes : `0${minutes}`}:${seconds > 9 ? seconds : `0${seconds}`} <span class="am-pm">${amPm}</span>`;
    dateEl.innerHTML = `${days[day]}, ${date} ${months[month]}`
}, 1000);

let arrLat_Lon = lat_lon.split(", ")
function getWeatherData() {
    fetch(`https://api.tomorrow.io/v4/timelines?location=${arrLat_Lon[0]},${arrLat_Lon[1]}&fields=temperature&timesteps=1d&units=metric&apikey=vZo8wTtcAfNOqSTsVVyHqN3M57EGz58E`)
        .then((data) => data.json())
        .then((data) => {
            showWeatherTemp(data)
        });

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${arrLat_Lon[0]}&lon=${arrLat_Lon[1]}&cnt=3&appid=da09200301ec98541c017e12eb19356f`)
        .then((result) => result.json())
        .then((res) => {
            showWeatherData(res)
        })
}
getWeatherData();

function showWeatherTemp(data) {
    let tempDays = data.data.timelines["0"].intervals;
    tempDays.forEach((day, index) => {
        if (index == 0) {
            currentTempEl.innerHTML = `
            <div class="day">${window.moment(Date.parse(day.startTime)).format("ddd")}</div>
            <img src="https://openweathermap.org/img/wn/02d@2x.png" alt="weather icon" class="w-icon">
            <div class="temp">Day - ${day.values.temperature}&#176; C</div>
            <div class="temp">Night - ${day.values.temperature}&#176; C</div>
            `;
        } else {
            weatherForCastEl.innerHTML += `
                <div class="weather-forecast-item">
                    <div class="day">${window.moment(Date.parse(day.startTime)).format("ddd")}</div>
                    <img src="https://openweathermap.org/img/wn/02d@2x.png" alt="weather icon" class="w-icon">
                    <div class="temp">Day - ${day.values.temperature}&#176; C</div>
                    <div class="temp">Night - ${day.values.temperature}&#176; C</div>
                </div>
            `;
        }
    });
}

function showWeatherData(result) {
    let {
        humidity,
        pressure,
    } = result.list["0"].main;
    let {
        sunrise,
        sunset
    } = result.city;
    let wind_speed = result.list["0"].wind.speed;

    timeZone.innerHTML = result.city.name;
    countryEl.innerHTML = `${result.city.coord.lat}N${result.city.coord.lon}E`;

    currentWeatherItemsEl.innerHTML = `
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
    </div>
    `;
}