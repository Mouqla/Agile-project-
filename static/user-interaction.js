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
    let state = await reverseGeocodeState(lat,long);
    let country = await reverseGeocodeCountry(lat,long);

    let forecast = await getForecast24hours(lat, long);
    forecast = getQualitativeValue(forecast.main.aqi);

    try {
        //create an object which holds all the location information
        const locationData = new LocationData(apiResult, lat, long, cityName, state, country, forecast);
        // Lägger resultatet i en ny "frame" i sidebar
        prepareNextFrame(compareMode);
        createAndAppendFrameNewFormatting(locationData) /* Lägger resultatet i en ny "frame" i sidebar*/

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

let closeForecastButtonFrame;
function openForecastHistoryWindow(){
    countForecastHistoryButton = 1;
    fetch('forecast-history.html')
    .then(response => response.text())
    .then(html => {
        forecastHistoryFrame = document.createElement('div');
        forecastHistoryFrame.classList.add('forecast-history-frame');
        forecastHistoryFrame.id = 'graph-container'; 

        closeForecastButtonFrame = document.createElement('div');
        closeForecastButtonFrame.classList.add('close-forecast-button-frame');
        closeForecastButtonFrame.id = 'close-forecast-button-frame'; 
        
        forecastWindow = document.getElementById('forecast-window');
        forecastWindow.appendChild(closeForecastButtonFrame);
        forecastWindow.appendChild(forecastHistoryFrame);

        closeForecastButtonFrame.innerHTML = `
        <button id="closeForecastButton" class="closeForecastButton" onClick="closeforeCastHistoryWindow()">
            <i class="fa-solid fa-xmark"></i>
        </button>
        `

        coords = map.getCenter();
        drawForecastGraph(coords.lat, coords.lng);
        
        chooseGraphMode = document.createElement('div');
        chooseGraphMode.id = 'choose-graph-mode';
        
        forecastWindow.appendChild(chooseGraphMode);
        chooseGraphMode.innerHTML += `
        <form>
        <fieldset>
        <legend></legend>
        <div>
        <input type="radio" id="history" name="graph-mode" value="history" onChange="changeGraphMode(event)" />
        <label for="history">History</label>
        
        <input type="radio" id="forecast" name="graph-mode" value="forecast" onChange="changeGraphMode(event)" checked/>
        <label for="forecast">Forecast</label>
        </div>
        </fieldset>
        </form>
        `
    })
}

function closeforeCastHistoryWindow() {
    forecastWindow.removeChild(forecastHistoryFrame);
    forecastWindow.removeChild(closeForecastButtonFrame);
    forecastWindow.removeChild(chooseGraphMode);
    countForecastHistoryButton = 0;
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