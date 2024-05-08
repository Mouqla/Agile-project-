async function getForecast24hours(lat,lon) {
    const response = await fetch(`/api/get_forecast?lat=${lat}&lon=${lon}`);
    const retJson = await response.json();
    return Object.values(retJson)[1][23]; // forecast in exactly 24 hours, returns a single object
}

async function getForecastAll(lat,lon) {
    const response = await fetch(`/api/get_forecast?lat=${lat}&lon=${lon}`);
    const retJson = await response.json();
    return Object.values(retJson)[1]; // returns array with 96 objects, forecast for the next 96 hours
}

async function getHistory(lat,lon,start,end) { // time in UNIX datetime!
    const response = await fetch(`/api/get_history?lat=${lat}&lon=${lon}&start=${start}&end=${end}`);
    const retJson = await response.json();
    return Object.values(retJson)[1];
}

function getNow(){
    let date = new Date();
    date = date.getTime()/1000;
    date = date.toFixed(0);
    return date; // returns UNIX datetime
}

function getYesterday(){
    let date = new Date();
    date.setDate(date.getDate() - 1);
    date = date.getTime()/1000;
    date = date.toFixed(0);
    return date; // returns UNIX datetime
}

function getDate1WeekAgo(){
    let date = new Date();
    date.setDate(date.getDate() - 7);
    date = date.getTime()/1000;
    date = date.toFixed(0);
    return date; // returns UNIX datetime
}

function getDateXMonthsAgo(months){
    let date = new Date();
    date.setMonth(date.getMonth() - months);
    date = date.getTime()/1000;
    date = date.toFixed(0);
    return date; // returns UNIX datetime
}

function getDate1YearAgo(){
    let date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    date = date.getTime()/1000;
    date = date.toFixed(0);
    return date; // returns UNIX datetime
}

function getUnixDateTime(date){
    // date must be in format 'July 20, 69 20:17:40 GMT+00:00'
    var date = new Date(date);
    return date.getTime()/1000; // returns UNIX datetime
}

async function drawHistoryGraph(lat, lon, startTime, endTime){
    let historyArray = await getHistory(lat, lon, startTime, endTime);
    var { traceCO, traceNH3, traceNO, traceNO2, traceO3, tracePM10, tracePM2_5, traceSO2 } = getTimeAndPollutionForGraph(historyArray);
  
    var data = [traceCO, traceNH3, traceNO, traceNO2, traceO3, tracePM10, tracePM2_5, traceSO2];
    var layout = {
        title: {text: `History ${await reverseGeocode(lat,lon)}`},
        barmode: 'stack',
        yaxis: {
            title: 'µg/m3',}
    };

    Plotly.newPlot('graph-container', data, layout);
}

async function drawForecastGraph(lat, lon){
    let forecastArray = await getForecastAll(lat, lon); 
    var { traceCO, traceNH3, traceNO, traceNO2, traceO3, tracePM10, tracePM2_5, traceSO2 } = getTimeAndPollutionForGraph(forecastArray);
  
    var data = [traceCO, traceNH3, traceNO, traceNO2, traceO3, tracePM10, tracePM2_5, traceSO2];
    var layout = {
        title: {text: `Forecast ${await reverseGeocode(lat,lon)}`},
        barmode: 'stack',
        yaxis: {
            title: 'µg/m3',}
    };
    
    Plotly.newPlot('graph-container', data, layout);
} 

function getTimeAndPollutionForGraph(timePollutionArray) {
    var componentsMap = new Map();
    timePollutionArray.forEach((element) => componentsMap.set(formatTimeFromUnix(Object.values(element)[1]), Object.values(element)[0]));

    let keys = Array.from(componentsMap.keys());
    let allValues = Array.from(componentsMap.values());

    let valuesCO = [];
    allValues.forEach((element) => valuesCO.push(Object.values(element)[0]));

    let valuesNH3 = [];
    allValues.forEach((element) => valuesNH3.push(Object.values(element)[1]));

    let valuesNO = [];
    allValues.forEach((element) => valuesNO.push(Object.values(element)[2]));

    let valuesNO2 = [];
    allValues.forEach((element) => valuesNO2.push(Object.values(element)[3]));

    let valuesO3 = [];
    allValues.forEach((element) => valuesO3.push(Object.values(element)[3]));

    let valuesPM10 = [];
    allValues.forEach((element) => valuesPM10.push(Object.values(element)[5]));

    let valuesPM2_5 = [];
    allValues.forEach((element) => valuesPM2_5.push(Object.values(element)[6]));

    let valuesSO2 = [];
    allValues.forEach((element) => valuesSO2.push(Object.values(element)[7]));

    var traceCO = {
        x: keys,
        y: valuesCO,
        name: 'CO',
        type: 'bar'
    };

    var traceNH3 = {
        x: keys,
        y: valuesNH3,
        name: 'NH<sub>3</sub>',
        type: 'bar'
    };

    var traceNO = {
        x: keys,
        y: valuesNO,
        name: 'NO',
        type: 'bar'
    };

    var traceNO2 = {
        x: keys,
        y: valuesNO2,
        name: 'NO<sub>2</sub>',
        type: 'bar'
    };

    var traceO3 = {
        x: keys,
        y: valuesO3,
        name: 'O<sub>3</sub>',
        type: 'bar'
    };

    var tracePM10 = {
        x: keys,
        y: valuesPM10,
        name: 'PM10',
        type: 'bar'
    };

    var tracePM2_5 = {
        x: keys,
        y: valuesPM2_5,
        name: 'PM2.5',
        type: 'bar'
    };

    var traceSO2 = {
        x: keys,
        y: valuesSO2,
        name: 'SO<sub>2</sub>',
        type: 'bar'
    };
    return { traceCO, traceNH3, traceNO, traceNO2, traceO3, tracePM10, tracePM2_5, traceSO2 };
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