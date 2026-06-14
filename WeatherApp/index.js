

const apiURL = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "ec7fe854586a0701c54d26cd28284327"
const units = "metric"

async function weather_data(city) {

    const response = await fetch(`
    ${apiURL}?q=${city}&units=${units}&appid=${apiKey}`)
    return await response.json();
}

function cleanAndValidateCity(city) {

    // Remove trailing space, collapse inner spaces and lower casing the city name.
    city = city.trim().toLowerCase().replace(/\s+/g, " ");

    // Check length (must be between 2 and 50 characters)
    if (city.length < 2 || city.length > 50) {
        return { isValid: false, reason: "Invalid length" };
    }

    // Reject if it contains numbers
    if (/\d/.test(city)) {
        return { isValid: false, reason: "Contains numbers" };
    }

    // Reject if it contains special characters other than letters, spaces, hyphens, apostrophes, and periods
    const allowedCharsRegex = /^[a-zA-Z\s.\-']+$/;
    if (!allowedCharsRegex.test(city)) {
        return { isValid: false, reason: "Contains forbidden special characters" };
    }

    return { isValid: true, value: city };
}


async function find_fill_city_weather(city) {

    let city_weather_data = await weather_data(city);
    // console.log(city_weather_data);

    const code = Number(city_weather_data.cod);
    if (city_weather_data.cod  != 200){
        // In case of error hide the display of weather again.
        document.querySelector(".weather").style.display = 'none';
        alert(city_weather_data.message);
        return;
    }

    let city_name = city_weather_data.name;
    let country_name = city_weather_data.sys.country;
    let city_temp = Math.round(city_weather_data.main.temp);
    let city_humidity = city_weather_data.main.humidity;
    let city_wind_speed = Math.round(city_weather_data.wind.speed);

    document.querySelector(".city").innerHTML = `${city_name}, ${country_name}`;
    document.querySelector(".temp").innerHTML = `${city_temp}&degC`;
    document.querySelector(".humidity").innerHTML = `${city_humidity}%`;
    document.querySelector(".wind").innerHTML = `${city_wind_speed} KM/Hr`;

    let city_sunset = city_weather_data.sys.sunset;
    let city_sunrise = city_weather_data.sys.sunrise;
    let curr_time = Math.floor(Date.now() / 1000);

    if(curr_time >= city_sunset || curr_time < city_sunrise) {
        document.querySelector(".card").style.background = 'black';
    }

    let city_weather_id = Number(city_weather_data.weather[0].id);
    const weatherIcon = document.querySelector('.weather-icon');

    if(city_weather_id >= 200 && city_weather_id < 300) {
        weatherIcon.src = 'images/thunderstorm.png';
    }
    else if(city_weather_id >= 300 && city_weather_id < 400) {
        weatherIcon.src = 'images/drizzle.png';
    }
    else if(city_weather_id >= 500 && city_weather_id < 600) {
        weatherIcon.src = 'images/rain.png';
    }
    else if(city_weather_id >= 600 && city_weather_id < 700) {
        weatherIcon.src = 'images/snow.png';
    }
    else if(city_weather_id >= 700 && city_weather_id < 800) {
        weatherIcon.src = 'images/mist.png';
    }
    else if(city_weather_id >= 800 && city_weather_id < 900) {
        weatherIcon.src = 'images/clouds.png';
    }
    else{
        weatherIcon.src = 'images/clear.png';
    }

    // Now unhide the weather details of weather class
    document.querySelector(".weather").style.display = 'block';
}



const search_box = document.querySelector(".search input");
const search_btn = document.querySelector(".search button");

search_btn.addEventListener("click", () => {

    let city = search_box.value;

    validate_city = cleanAndValidateCity(city);

    if (validate_city["isValid"]){
        city = validate_city["value"];
        find_fill_city_weather(city);
    }
    else{
        // In case of error hide the display of weather again.
        document.querySelector(".weather").style.display = 'none';
        alert(`Invalid city due to ${validate_city["reason"]}! Please enter a valid city`);
    }
});