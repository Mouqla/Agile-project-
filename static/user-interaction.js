// Handles user's interaction


////// User Interaction: Click on map
async function onMapClick(e) {
    openNav(); 
    new Location(e, compareMode);
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

