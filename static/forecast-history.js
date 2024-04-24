async function getPollutionOpenWeather(lat,lon) {
    const response = await fetch(`/api/get_air?lat=${lat}&lon=${lon}`);
    const retJson = await response.json();
    return Object.values(retJson)[1];
}

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

tryHistory();