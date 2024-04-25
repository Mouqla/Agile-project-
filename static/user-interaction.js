// Handles user's interaction


////// User Interaction: Click on map
async function onMapClick(e) {
    openNav();
    const lat = e.latlng["lat"];
    const long = e.latlng["lng"];
    const radius = 5000; //if using OpenAQ

    //fetch air pollution
    var apiResult = await getPollutionOpenWeather(lat,long);
    //fetch city name
    var cityName = await reverseGeocode(lat,long);

    try {
        //create an object which holds all the location information
        const locationData = new LocationData(apiResult, lat, long, cityName);
        // Lägger resultatet i en ny "frame" i sidebar
        prepareNextFrame(compareMode);
        createAndAppendFrame(locationData) /* Lägger resultatet i en ny "frame" i sidebar*/

    } catch (error) {
        console.log(error);
        if (error instanceof TypeError) {
            var popup = L.popup()
            .setLatLng(e.latlng)
            .setContent(`No results within ${radius} meters`)
            .openOn(map);
        }
        else {
            var popup = L.popup()
            .setLatLng(e.latlng)
            .setContent(`Unknown error fetching API data`)
            .openOn(map);
        }
    }
}

map.on('click', onMapClick);

/////// User Interaction: Input text in search bar, give choice of five cities
const searchInput = document.querySelector('.input')
searchInput.addEventListener("input", async (e) => {
    const searchDatalist = document.getElementById("search-results");

    // input from search bar
    var searchTerm = e.target.value;
    query = regexSearchTerm(searchTerm);

    const locations = await geocodeMulti(query).catch((err) => {
        console.error(err);
        return "default response";
      });

    //empty dropdown so it can be repopulated at every input from keyboard
    searchDatalist.innerHTML += '';
    //create dropdown with several choices matching search query
    function appendSearchResult(value){
        if(value[1] === undefined) { // if city does not belong to a state
            searchDatalist.innerHTML += `<option value="${value[0]}, ${value[2]}"></option>`; //city, country
        }
        else {
            searchDatalist.innerHTML += `<option value="${value[0]}, ${value[1]}, ${value[2]}"></option>`; //city, state, country
        }
    }
    locations.forEach(appendSearchResult);
})


////// User Interaction: Click the Forecast & History Button
var newFrame = '';
var forecastWindow = '';
var countForecastHistoryButton = 0;
const forecastHistoryButton = document.querySelector(".forecast-history-button")
function clickForecastHistory(){
    //if the window is not open, open it
    if(countForecastHistoryButton == 0){
        countForecastHistoryButton = 1;
        fetch('forecast-history.html')
        .then(response => response.text())
        .then(html => {
            newFrame = document.createElement('div');
            newFrame.classList.add('frame');
            newFrame.id = 'graph-container'; 

            forecastWindow = document.getElementById('forecast-window');
            forecastWindow.appendChild(newFrame);
            
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
    // else close it by removing the graph-container
    else {
        forecastWindow.removeChild(newFrame);
        countForecastHistoryButton = 0;
    }
}

function changeGraphMode(e){
    //triggered when the radio buttons for history/forecast are changed
    var graphModeValue = e.target.value;
    coords = map.getCenter();
    var graphContainer = document.querySelector('.js-plotly-plot');
    if(graphModeValue == 'history'){
        graphContainer.innerHTML = '';
        drawHistoryGraph(coords.lat, coords.lng, getDate1WeekAgo(), getNow());
    }
    else{
        graphContainer.innerHTML = '';
        drawForecastGraph(coords.lat, coords.lng);
    }
}