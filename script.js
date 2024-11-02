const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time')
const conditionOutput = document.querySelector('.condition')
const nameOutput = document.querySelector('.name')
const icon = document.querySelector('.icon')
const cloudOutput = document.querySelector('.cloud')
const humidityOutput = document.querySelector('.humidity')
const windOutput = document.querySelector('.wind')
const form = document.getElementById('locationInput')
const search = document.querySelector('.search')
const btn = document.querySelector('.submit')
const cities = document.querySelectorAll('.city');

//Add click even to each city in the panel
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        let cityInput = e.target.innerHTML;

        fetchWeatherData(cityInput);

        app.style.opacity = "0";
    });
})


form.addEventListener('submit', (e) => {
    if (search.value.length == 0)
    {
        alert('Please type in a city name')
    }
    else{
        let cityInput = search.value;

        fetchWeatherData(cityInput);
        search.value = "";
        app.style.opacity = '0'
    }

    e.preventDefault();
});

function dayOfTheWeek(date)
{
    const weekDay = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return weekDay[date.getDay()];
}

function fetchWeatherData(city)
{
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=409587a415342ce0e390927304e13e9e')
    .then(response => response.json())
    .then(data =>  {
        console.log(data);

        var temp_c = Math.round(data.main.temp-273.5)
        temp.innerHTML = temp_c + "&#176";
        conditionOutput.innerHTML = data.weather[0].main

        const seconds = data.dt;
        var dateUTC = new Date(seconds*1000);
        let istOffset = 5.5 * 60 * 60 
        var dateIST = new Date(dateUTC.getTime() + istOffset)
        const y = dateIST.getFullYear()
        const m = dateIST.getMonth()
        const d = dateIST.getDate()
        const time = dateIST.toLocaleString('en-US').substr(11);

        dateOutput.innerHTML = dayOfTheWeek(dateIST)+' ' + d.toString() + '/' + m.toString() + '/' + y.toString();
        timeOutput.innerHTML = time;

        nameOutput.innerHTML = data.name;

        // const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length)
        // icon.src = "./icons/" + iconId;
        icon.src = "https://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png"

        cloudOutput.innerHTML = data.clouds.all + "%";
        humidityOutput.innerHTML = data.main.humidity + "%";
        windOutput.innerHTML = data.wind.speed + "km/h";

        let timeOfDay = "day";

        const code = data.weather[0].icon;

        if (code[code.length-1]==='n')
        {
            timeOfDay = "night";
        }

        if (code == code.substr(0,2)==='01')
        {
            app.style.backgroundImage = 'url(./images'+timeOfDay+'/clear.jpg)';
            btn.style.background = "#e5ba92";

            if (timeOfDay == 'night'){
                btn.style.background = "#181e27";
            }
        }

        else if(
            code === "02d" || code === "02n" ||
            code === "03d" || code === "03n" ||
           code === "04d" || code === "04n"
        ){
            app.style.backgroundImage = 'url(./images/'+timeOfDay +'/cloudy.jpg)';
            btn.style.background = "#fa6d1b";
            if (timeOfDay == "night")
            {
                btn.style.background = "#181e27"
            }
        }
        else if(
            code === "09d" || code === "09n" ||
            code === "10d" || code === "10n" ||
            code === "11d" || code === "11n"
        ){
            app.style.backgroundImage = 'url(./images/'+timeOfDay +'/rainy.jpg)'
            btn.style.background = "#647d75";
            if (timeOfDay = "night")
            {
                btn.style.background = "#325c80"
            }
        }
        else{
            app.style.backgroundImage = 'url(./images/' + timeOfDay + '/snowy.jpg)'
            btn.style.background = "#4d72aa"
            if (timeOfDay == "night")
            {
                btn.style.background = "#1b1b1b"
            }
        }
        app.style.opacity = "1";
    })

    .catch((err) => {
        console.log("error occured:", err)
        alert("City not found! please try again!");
        app.style.opacity = "1";
    });
}

navigator.geolocation.getCurrentPosition(showPosition)
async function locationFind(lat, long)
{
    const response = await fetch("https://revgeocode.search.hereapi.com/v1/revgeocode?at="+ lat.toString() +"%2C"+ long.toString() +"&lang=en-US&apiKey=lm6jRkEVS1gxkHqQffvfx9FN7LUdqojvOKzarbEHAN0");
    const location = await response.json();
    return location
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    let a = locationFind(lat, long)
    a.then(data =>{
        fetchWeatherData(data.items[0].address.city)
    })
}
app.style.opacity = "1";
