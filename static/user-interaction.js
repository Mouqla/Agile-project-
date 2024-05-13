// Handles user's interaction


////// User Interaction: Click on map
async function onMapClick(e) {
    openNav(); 
    const lat = e.latlng["lat"];
    const long = e.latlng["lng"];
    const radius = 5000; //if using OpenAQ

    try {

        new Location(lat, long, compareMode);

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
        historyTimeButtonsContainer = document.getElementById('history-time-radio-buttons');
        historyTimeButtonsContainer.innerHTML = `
        <div id="history-time-radio-buttons">
            <hr id="line-break-forecast-history" />
            <input type="radio" id="history-time-begin" name="history-time-begin" value="1week" onChange="changeHistoryTimeSpan(event)" checked/>
            <label for="history">1 Week</label>
            <input type="radio" id="history-time-begin" name="history-time-begin" value="1month" onChange="changeHistoryTimeSpan(event)" />
            <label for="history">1 Month</label>
            <input type="radio" id="history-time-begin" name="history-time-begin" value="3months" onChange="changeHistoryTimeSpan(event)" />
            <label for="history">3 Months</label>
            <input type="radio" id="history-time-begin" name="history-time-begin" value="6months" onChange="changeHistoryTimeSpan(event)" />
            <label for="history">6 Months</label>
            <input type="radio" id="history-time-begin" name="history-time-begin" value="12months" onChange="changeHistoryTimeSpan(event)" />
            <label for="history">1 Year</label>
        </div>
        `;
        graphContainer.innerHTML = '';
        drawHistoryGraph(coords.lat, coords.lng, getDate1WeekAgo(), getNow());
    }
    else{
        historyTimeButtonsContainer = document.getElementById('history-time-radio-buttons');
        historyTimeButtonsContainer.innerHTML = '';
        graphContainer.innerHTML = '';
        drawForecastGraph(coords.lat, coords.lng);
    }
}

function changeHistoryTimeSpan(e){
    //triggered when radio buttons for history time span are changed
    let historyBeginValue = e.target.value;
    coords = map.getCenter();
    let graphContainer = document.querySelector('.js-plotly-plot');
    switch(historyBeginValue){
        case '12months':
            graphContainer.innerHTML = '';
            drawHistoryGraph(coords.lat, coords.lng, getDate1YearAgo(), getNow());
            break;
        case '6months':
            graphContainer.innerHTML = '';
            drawHistoryGraph(coords.lat, coords.lng, getDateXMonthsAgo(6), getNow());
            break;
        case '3months':
            graphContainer.innerHTML = '';
            drawHistoryGraph(coords.lat, coords.lng, getDateXMonthsAgo(3), getNow());
            break;
        case '1month':
            graphContainer.innerHTML = '';
            drawHistoryGraph(coords.lat, coords.lng, getDateXMonthsAgo(1), getNow());
            break;
        case '1week':
            graphContainer.innerHTML = '';
            drawHistoryGraph(coords.lat, coords.lng, getDate1WeekAgo(), getNow());
            break;
    
    }

}