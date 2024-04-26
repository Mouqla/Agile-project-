// Handles user's interaction


////// User Interaction: Click on map
async function onMapClick(e) {
    openNav();
    const lat = e.latlng["lat"];
    const long = e.latlng["lng"];
    const radius = 5000; //if using OpenAQ

    //fetch air pollution
    let apiResult = await getPollutionOpenWeather(lat,long);
    //fetch city name
    let cityName = await reverseGeocode(lat,long);
    let stateCountry = await reverseGeocodeStateCountry(lat,long);

    let forecast = await getForecast24hours(lat, long);
    forecast = getQualitativeValue(forecast.main.aqi);

    try {
        //create an object which holds all the location information
        const locationData = new LocationData(apiResult, lat, long, cityName, stateCountry, forecast);
        // Lägger resultatet i en ny "frame" i sidebar
        prepareNextFrame(compareMode);
        createAndAppendFrame(locationData) /* Lägger resultatet i en ny "frame" i sidebar*/

    } catch (error) {
        console.log(error);
        if (error instanceof TypeError) {
            let popup = L.popup()
            .setLatLng(e.latlng)
            .setContent(`No results within ${radius} meters`)
            .openOn(map);
        }
        else {
            let popup = L.popup()
            .setLatLng(e.latlng)
            .setContent(`Unknown error fetching API data`)
            .openOn(map);
        }
    }
}

map.on('click', onMapClick);

////// User Interaction: Click the Forecast & History Button
let forecastHistoryFrame = '';
let forecastWindow = '';
let countForecastHistoryButton = 0;
const forecastHistoryButton = document.querySelector(".forecast-history-button")
function clickForecastHistory(){
    //if the window is not open, open it
    if(countForecastHistoryButton == 0){
        openForecastHistoryWindow();
    }
    // else close it by removing the graph-container
    else {
        closeforeCastHistoryWindow();
    }
}

function changeGraphMode(e){
    //triggered when the radio buttons for history/forecast are changed
    let graphModeValue = e.target.value;
    coords = map.getCenter();
    let graphContainer = document.querySelector('.js-plotly-plot');
    if(graphModeValue == 'history'){
        graphContainer.innerHTML = '';
        drawHistoryGraph(coords.lat, coords.lng, getDate1WeekAgo(), getNow());
    }
    else{
        graphContainer.innerHTML = '';
        drawForecastGraph(coords.lat, coords.lng);
    }
}