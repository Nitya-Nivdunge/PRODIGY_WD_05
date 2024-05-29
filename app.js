document.addEventListener("DOMContentLoaded", function() {

    // state
    var units = "metric";

    // Selectors
    let city = document.querySelector(".city");
    let datetime = document.querySelector(".datetime");
    let forecast = document.querySelector('.forecast');
    let temperature = document.querySelector(".temperature");
    let icon = document.querySelector(".icon");
    let minmax = document.querySelector(".minmax");
    let visibility = document.querySelector('.visibility');
    let humidity = document.querySelector('.humidity');
    let wind = document.querySelector('.wind');
    let pressure = document.querySelector('.pressure');
    
    function convertTimeStamp(timestamp, timezone) {
        const date = new Date(timestamp * 1000);
    
        const options = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            hour12: true,
        };
        return date.toLocaleString("en-US", options);
    }

    // convert country code to name
    function convertCountryCode(country) {
        let regionNames = new Intl.DisplayNames(["en"], { type: "region" });
        return regionNames.of(country)
    }

    const apiKey = "bd202d36fa723314b5935ca6d7da6b12";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=`;

    const searchForm = document.querySelector(".search");
    const searchBox = document.querySelector(".search input");
    const user_location = document.querySelector(".use_current_location");
    const unit_celsius = document.querySelector(".unit_celsius");
    const unit_farenheit = document.querySelector(".unit_farenheit");


    async function checkWeather(cityName, units) {
        const response = await fetch(apiUrl + cityName + `&appid=${apiKey}` + `&units=${units}`);
        var data = await response.json();

        console.log(data);

        // Define the color values
        const colors = ['aqua', 'rgb(147, 225, 69)', 'yellow', 'orange','red'];

        if(units=='metric'){
            if (Number(Math.round(data.main.temp)) <=15) {
                temperature.style.color = colors[0];
            } 
            else if(Math.round(data.main.temp)>15 && Math.round(data.main.temp)<=25){
                temperature.style.color = colors[1];
            }
            else if(Math.round(data.main.temp)>25 && Math.round(data.main.temp)<=35){
                temperature.style.color = colors[2];
            }
            else if(Math.round(data.main.temp)>35 && Math.round(data.main.temp)<=40){
                temperature.style.color=colors[3]
            }
            else{
                temperature.style.color=colors[4];
            }
        }
        else{
            if (Number(Math.round(data.main.temp)) <=59) {
                temperature.style.color = colors[0];
            } 
            else if(Math.round(data.main.temp)>59 && Math.round(data.main.temp)<=77){
                temperature.style.color = colors[1];
            }
            else if(Math.round(data.main.temp)>77 && Math.round(data.main.temp)<=95){
                temperature.style.color = colors[2];
            }
            else if(Math.round(data.main.temp)>95 && Math.round(data.main.temp)<=104){
                temperature.style.color=colors[3]
            }
            else{
                temperature.style.color=colors[4];
            }
        }

        city.innerHTML = `${data.name} , ${convertCountryCode(data.sys.country)}`;
        datetime.innerHTML = convertTimeStamp(data.dt, data.timezone);
        forecast.innerHTML = `<p>${data.weather[0].main}</p>`;
        temperature.innerHTML = `<p>${Math.round(data.main.temp)}&#176 ${units === "imperial" ? "F" : "C"}</p>`;
        icon.innerHTML = `   <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`;
        minmax.innerHTML = `<p>Min : ${data.main.temp_min.toFixed()}&#176</p><p>Max : ${data.main.temp_max.toFixed()}&#176</p>`;
        visibility.innerHTML = data.visibility + " m";
        humidity.innerHTML = data.main.humidity + " %";
        wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? " mph" : " m/s"}`;
        pressure.innerHTML = data.main.pressure + " hPa";
    }

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent form submission
        checkWeather(searchBox.value, units); // Pass the value of the search input to checkWeather function
    });


    // user current location using Geolocation
    user_location.addEventListener("click", () => {
        // Get the user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
    
                // Call a reverse geocoding service to get the city name from the coordinates
                const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
                const response = await fetch(apiUrl);
                const data = await response.json();
    
                searchBox.value = data.name;
                checkWeather(searchBox.value, units); // Call checkWeather with updated city name
            });
        } 
        else {
            alert("Geolocation is not supported by this browser.");
            console.log("Geolocation is not supported by this browser.");
        }
    });

    // unit conversion
    unit_celsius.addEventListener('click', () => {
        if(units !== "metric"){
            // change to metric
            units = "metric";
            // get weather forecast 
            checkWeather(searchBox.value, units); // Call checkWeather with updated units
        }
    });
    
    unit_farenheit.addEventListener('click', () => {
        if(units !== "imperial"){
            // change to imperial
            units = "imperial";
            // get weather forecast 
            checkWeather(searchBox.value, units); // Call checkWeather with updated units
        }
    });

});




/*
document.addEventListener("DOMContentLoaded", function() {

// state
let currCity = "Mumbai";
let units = "metric";

// Selectors
let city = document.querySelector(".city");
let datetime = document.querySelector(".datetime");
let forecast = document.querySelector('.forecast');
let temperature = document.querySelector(".temperature");
let icon = document.querySelector(".icon");
let minmax = document.querySelector(".minmax")
let visibility = document.querySelector('.visibility');
let humidity = document.querySelector('.humidity');
let wind = document.querySelector('.wind');
let pressure = document.querySelector('.pressure');

// search
document.querySelector(".search").addEventListener('submit', e => {
    let search = document.querySelector(".searchform");
    // prevent default action
    e.preventDefault();
    // change current city
    currCity = search.value;
    // get weather forecast 
    getWeather();
    // clear form
    search.value = ""
});


// current user location input



// units
document.querySelector(".unit_celsius").addEventListener('click', () => {
    if(units !== "metric"){
        // change to metric
        units = "metric"
        // get weather forecast 
        getWeather()
    }
});

document.querySelector(".unit_farenheit").addEventListener('click', () => {
    if(units !== "imperial"){
        // change to imperial
        units = "imperial"
        // get weather forecast 
        getWeather()
    };
});

function convertTimeStamp(timestamp, timezone){
     const convertTimezone = timezone / 3600; // convert seconds to hours 

    const date = new Date(timestamp * 1000);
    
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
        hour12: true,
    };
    return date.toLocaleString("en-US", options);
   
}

 

// convert country code to name
function convertCountryCode(country){
    let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
    return regionNames.of(country)
}

function getWeather(){
    const API_KEY = "bd202d36fa723314b5935ca6d7da6b12";

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`).then(res => res.json()).then(data => {
    console.log(data)
    city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`
    datetime.innerHTML = convertTimeStamp(data.dt, data.timezone); 
    forecast.innerHTML = `<p>${data.weather[0].main}`
    temperature.innerHTML = `${data.main.temp.toFixed()}&#176`
    icon.innerHTML = `   <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`
    minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176</p>`
    visibility.innerHTML = `${data.visibility} nmi`
    humidity.innerHTML = `${data.main.humidity} %`
    wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph": "m/s"}` 
    pressure.innerHTML = `${data.main.pressure} hPa`
})
}

const apiKey = "bd202d36fa723314b5935ca6d7da6b12";
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=`;

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search i");
const user_location = document.querySelector(".use_current_location");

async function checkWeather(city){
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`+`&units=metric`);
        var data = await response.json();

            console.log(data);

            document.querySelector(".city").innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
            document.querySelector(".datetime").innerHTML = convertTimeStamp(data.dt, data.timezone); 
            document.querySelector(".forecast").innerHTML = `<p>${data.weather[0].main}</p>`;
            document.querySelector(".temperature").innerHTML = Math.round(data.main.temp)}+ " &#176";
            document.querySelector(".icon").innerHTML = `   <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`;
            document.querySelector(".minmax").innerHTML = `<p>Min : ${data.main.temp_min.toFixed()}&#176</p><p>Max : ${data.main.temp_max.toFixed()}&#176</p>`;
            document.querySelector(".visibility").innerHTML = data.visibility+" nmi";
            document.querySelector(".humidity").innerHTML = data.main.humidity+" %";
            document.querySelector(".wind").innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph": "m/s"}` ;
            document.querySelector(".pressure").innerHTML = data.main.pressure+" hPa";
}

searchBtn.addEventListener("submit",()=> {
    checkWeather(searchBox.value);
})

user_location.addEventListener("click",()=> {
    checkWeather("Mumbai");
})

});

*/