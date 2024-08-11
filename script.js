const apiKey = 'f079f3246f039510078f4022908b10a3';

function getWeatherByCity() {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                const lat = data.coord.lat;
                const lon = data.coord.lon;
                getWeatherByCoordinates(lat, lon, data.name);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                alert('An error occurred while fetching weather data.');
            });
    } else {
        alert('Please enter a city name.');
    }
}

function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByCoordinates(lat, lon);
            },
            error => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert('User denied the request for geolocation.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert('Location information is unavailable.');
                        break;
                    case error.TIMEOUT:
                        alert('The request to get user location timed out.');
                        break;
                    case error.UNKNOWN_ERROR:
                        alert('An unknown error occurred.');
                        break;
                }
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function getWeatherByCoordinates(lat, lon, cityName = '') {
    console.log(`Fetching weather data for coordinates: ${lat}, ${lon}`);
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Weather data received:', data);
            displayCurrentWeather(data.current, cityName || data.timezone);
            displayForecast(data.daily);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('An error occurred while fetching weather data: ' + error.message);
        });
}

function displayCurrentWeather(currentWeather, cityName) {
    document.getElementById('city-name').textContent = cityName;
    document.getElementById('temperature').textContent = `Temperature: ${currentWeather.temp} °C`;
    document.getElementById('weather-description').textContent = `Weather: ${currentWeather.weather[0].description}`;
    document.getElementById('humidity').textContent = `Humidity: ${currentWeather.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${currentWeather.wind_speed} m/s`;
}

function displayForecast(dailyForecast) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    dailyForecast.slice(0, 7).forEach(day => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        
        const date = new Date(day.dt * 1000).toLocaleDateString();
        const temp = `Temp: ${day.temp.day} °C`;
        const weather = day.weather[0].description;

        forecastItem.innerHTML = `
            <p><strong>${date}</strong></p>
            <p>${temp}</p>
            <p>${weather}</p>
        `;

        forecastContainer.appendChild(forecastItem);
    });
}
