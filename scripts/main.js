// API Keys (in production, these would be environment variables)
const OPENTRIPMAP_API_KEY = 'your-api-key';
const OPENWEATHER_API_KEY = 'ae31432365fbca1ff449793432d59d0a';
const EXCHANGERATE_API_KEY = '154dbe21eef3b7cdf382ed57';

// DOM Elements
const searchBtn = document.getElementById('search-btn');
const locationInput = document.getElementById('location-input');
const placesResults = document.getElementById('places-results');
const weatherResults = document.getElementById('weather-results');
const currencyResults = document.getElementById('currency-results');

// Event Listeners
searchBtn.addEventListener('click', fetchTravelData);

async function fetchTravelData() {
    const location = locationInput.value.trim();
    
    if (!location) {
        alert('Please enter a location');
        return;
    }
    
    try {
        // Fetch points of interest
        // const places = await fetchPlaces(location);
        // displayPlaces(places);
        
        // Fetch weather data
        const weather = await fetchWeather(location);
        displayWeather(weather);
        
        // Fetch currency data (default to USD)
        const currency = await fetchCurrency('USD');
        displayCurrency(currency);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch travel data. Please try again.');
    }
}
// async function fetchPlaces(location) {
//     const response = await fetch(
//         `https://opentripmap-places-v1.p.rapidapi.com/en/places/geoname?name=${location}`,
//         {
//             method: 'GET',
//             headers: {
//                 'x-rapidapi-key': OPENTRIPMAP_API_KEY,
//                 'x-rapidapi-host': 'opentripmap-places-v1.p.rapidapi.com'
//             }
//         }
//     );
    
//     if (!response.ok) {
//         throw new Error('Failed to fetch places');
//     }
    
//     return response.json();
// }
async function fetchWeather(location) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
        throw new Error('Failed to fetch weather');
    }
    
    return response.json();
}

async function fetchCurrency(baseCurrency) {
    const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${EXCHANGERATE_API_KEY}/latest/${baseCurrency}`
    );
    
    if (!response.ok) {
        throw new Error('Failed to fetch currency data');
    }
    
    return response.json();
}

// function displayPlaces(places) {
//     placesResults.innerHTML = ''; // Clear previous results
    
//     if (!places || places.length === 0) {
//         placesResults.innerHTML = '<p>No places found for this location.</p>';
//         return;
//     }

//     // Create a card for each place
//     const placesList = document.createElement('div');
//     placesList.className = 'places-list';

//     const placeCard = document.createElement('div');
//     placeCard.className = 'place-card';

//     placeCard.innerHTML = `
//         <h3>${places.name}</h3>
//         <p><strong>Country:</strong> ${places.country}</p>
//         <p><strong>Population:</strong> ${places.population?.toLocaleString() || 'N/A'}</p>
//         <p><strong>Timezone:</strong> ${places.timezone || 'N/A'}</p>
//         <p><strong>Coordinates:</strong> ${places.lat?.toFixed(4)}, ${places.lon?.toFixed(4)}</p>
//     `;

//     placesList.appendChild(placeCard);
//     placesResults.appendChild(placesList);
// }

function displayWeather(weather) {
    weatherResults.innerHTML = ''; // Clear previous results
    
    if (!weather || !weather.main) {
        weatherResults.innerHTML = '<p>Weather data not available.</p>';
        return;
    }

    // Get weather icon
    const iconCode = weather.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Create weather card
    const weatherCard = document.createElement('div');
    weatherCard.className = 'weather-card';

    weatherCard.innerHTML = `
        <div class="weather-header">
            <h3>${weather.name}</h3>
            <img src="${iconUrl}" alt="${weather.weather[0].description}">
        </div>
        <div class="weather-details">
            <p><strong>Temperature:</strong> ${weather.main.temp}°C (Feels like ${weather.main.feels_like}°C)</p>
            <p><strong>Conditions:</strong> ${weather.weather[0].main} - ${weather.weather[0].description}</p>
            <p><strong>Humidity:</strong> ${weather.main.humidity}%</p>
            <p><strong>Wind:</strong> ${weather.wind.speed} m/s, ${weather.wind.deg}°</p>
            <p><strong>Pressure:</strong> ${weather.main.pressure} hPa</p>
            <p><strong>Visibility:</strong> ${weather.visibility / 1000} km</p>
        </div>
    `;

    weatherResults.appendChild(weatherCard);
}

function displayCurrency(currency) {
    currencyResults.innerHTML = ''; // Clear previous results
    
    if (!currency || !currency.conversion_rates) {
        currencyResults.innerHTML = '<p>Currency data not available.</p>';
        return;
    }

    // Get top 5 currencies to display
    const popularCurrencies = ['EUR', 'GBP', 'JPY', 'AUD', 'CAD'];
    const baseCurrency = currency.base_code || 'USD';
    const lastUpdated = new Date(currency.time_last_update_utc).toLocaleString();

    // Create currency card
    const currencyCard = document.createElement('div');
    currencyCard.className = 'currency-card';

    let ratesHTML = '<ul class="currency-rates">';
    popularCurrencies.forEach(curr => {
        if (currency.conversion_rates[curr]) {
            ratesHTML += `
                <li>
                    <span class="currency-code">${curr}</span>:
                    <span class="currency-rate">${currency.conversion_rates[curr].toFixed(4)}</span>
                </li>
            `;
        }
    });
    ratesHTML += '</ul>';

    currencyCard.innerHTML = `
        <h3>Currency Exchange Rates</h3>
        <p><strong>Base Currency:</strong> ${baseCurrency}</p>
        ${ratesHTML}
        <p class="update-time"><small>Last updated: ${lastUpdated}</small></p>
        <button id="refresh-currency" class="refresh-btn">Refresh Rates</button>
    `;

    currencyResults.appendChild(currencyCard);

    // Add event listener for refresh button
    document.getElementById('refresh-currency')?.addEventListener('click', async () => {
        try {
            const updatedCurrency = await fetchCurrency(baseCurrency);
            displayCurrency(updatedCurrency);
        } catch (error) {
            console.error('Error refreshing currency:', error);
            alert('Failed to refresh currency data. Please try again.');
        }
    });
}