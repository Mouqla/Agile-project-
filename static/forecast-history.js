

async function getForecast24hours(lat,lon) {
    const response = await fetch(`/api/get_forecast?lat=${lat}&lon=${lon}`);
    const retJson = await response.json();
    return Object.values(retJson)[1][23]; // forecast in exactly 24 hours, returns a single object
}

async function getForecastAll96hours(lat,lon) {
    const response = await fetch(`/api/get_forecast?lat=${lat}&lon=${lon}`);
    const retJson = await response.json();
    return Object.values(retJson)[1]; // returns array with 96 objects, forecast for the next 96 hours
}

//console.log(getPollutionOpenWeather(57,11));
//console.log(getForecast24hours(57, 11));
//console.log(getForecastAll96hours(57, 11));

async function testForecast(){
    let forecast = await getForecastAll96hours(57, 11)
    console.log(forecast);
    return forecast;
}

//testForecast();

async function getHistory(lat,lon,start,end) { // time in UNIX datetime!
    const response = await fetch(`/api/get_history?lat=${lat}&lon=${lon}&start=${start}&end=${end}`);
    const retJson = await response.json();
    return retJson;
}

function getNow(){
    let date = new Date();
    return date.getTime(); // returns UNIX datetime
}

function getYesterday(){
    let date = new Date();
    date.setDate(date.getDate() - 1);
    return date.getTime(); // returns UNIX datetime
}

function getDate1WeekAgo(){
    let date = new Date();
    date.setDate(date.getDate() - 7);
    return date.getTime(); // returns UNIX datetime
}

function getDateXMonthsAgo(months){
    let date = new Date();
    date.setMonth(date.getMonth() - months);
    return date.getTime(); // returns UNIX datetime
}

function getDate1YearAgo(){
    let date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date.getTime(); // returns UNIX datetime
}

function getUnixDateTime(date){
    // date must be in format 'July 20, 69 20:17:40 GMT+00:00'
    return date.getTime(); // returns UNIX datetime
}

async function tryHistory(){
    let start = getDateXMonthsAgo(2);
    let end = getDateXMonthsAgo(1);
    console.log(start, end);
    const history = await getHistory(57, 11.9, start, end);
    console.log(history);
}

function forecastWindow(){
    const forecastWindow = document.getElementById('forecast-window');

}

async function getComponentForecast(){
    const forecastArray = await getForecastAll96hours(57,11); 
    var componentsMap = new Map();
    forecastArray.forEach((element) => componentsMap.set(Object.values(element)[1], Object.values(element)[0]));

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
    name: 'NH3',
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
    name: 'NO2',
    type: 'bar'
  };

  var traceO3 = {
    x: keys,
    y: valuesO3,
    name: 'O3',
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
    name: 'CO',
    type: 'bar'
  };

  var traceSO2 = {
    x: keys,
    y: valuesSO2,
    name: 'SO2',
    type: 'bar'
  };
  
  var data = [traceCO, traceNH3, traceNO, traceNO2, traceO3, tracePM10, tracePM2_5, traceSO2];
  var layout = {barmode: 'stack'};

  Plotly.newPlot('tester', data, layout);
} 

getComponentForecast();

function getComponentsKeys(componentsMap){
    let keys = Array.from(componentsMap);
    return keys;
}

function getComponentsValues(componentsMap){
    let keys = Array.from(componentsMap);
    let values = [];
    keys.forEach((element)  => values.push(Object.values(element[1])))
    return values;
}



//tryHistory();