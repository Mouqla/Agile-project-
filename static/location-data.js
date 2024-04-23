
// Class object that holds all the information for a single location
class LocationData {
    constructor(apiResult, lat, lon, city) {
        this.city = city;

        //Coordinates
        this.location = `${lat.toFixed(4)},${lon.toFixed(4)}`;

        //Formats the time last updated
        var unixTimeStamp = apiResult[0].dt; //UNIX time
        this.time = formatTimeFromUnix(unixTimeStamp);

        // Object containing measurements of air pollution
        this.pollution = apiResult[0].components;

        // Air Quality Index -- Qualitative, e.g. 'Good', 'Poor'
        this.airQualityIndex = getQualitativeValue(apiResult[0].main.aqi);
    }
}

async function getPollutionOpenAQ(lat, lng, radius) {
    const response = await fetch(`/api/get_air?lat=${lat.toFixed(3)}&lng=${lng.toFixed(3)}&radius=${radius}`); // OpenAQ
    const retJson = await response.json();
    return Object.values(retJson)[1][0];
}

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

console.log(getPollutionOpenWeather(57,11));
console.log(getForecast24hours(57, 11));
console.log(getForecastAll96hours(57, 11));

function formatTimeFromUnix(unixTimeStamp) {
    var date = new Date(unixTimeStamp * 1000);
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    function prependZero(parameter){
        if(parameter < 10){
            parameter = '0' + parameter;
        }
        return parameter;
    }

    //Add a zero before number if less than 10
    month = prependZero(month);
    day = prependZero(day);
    hours = prependZero(hours);
    minutes = prependZero(minutes);
    seconds = prependZero(seconds);

    var formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedTime;
}

async function geocode(q){
    // returns array with the coordinates of a location based on the name
    // accepts the format: city,state,country OR city,state OR city
    const response = await fetch(`/api/get_location?q=${q}&limit=1`);
    const retJson = await response.json();
    return [retJson[0].lat,retJson[0].lon]
}

async function geocodeMulti(q){
    // returns multiple results
    // accepts the format: city,state,country OR city,state OR city
    const limit = 5;
    const response = await fetch(`/api/get_location_multi?q=${q}&limit=${limit}`);
    const retJson = await response.json();
    let cityMap = new Map();
    for(item in retJson){
        cityMap.set([retJson[item].lat, retJson[item].lon], [retJson[item].name, retJson[item].state, retJson[item].country])
    }
    return cityMap;
}

async function reverseGeocode(lat,lon){
    //get the name of a city from coordinates
    lat = lat.toFixed(4);
    lon = lon.toFixed(4);
    const response = await fetch(`/api/get_city?lat=${lat}&lon=${lon}&limit=1`);
    const retJson = await response.json();
    return retJson[0].name;
}

function getQualitativeValue(input){
    // parameter: API response numeric air quality index value 1-5
    // returns: qualitative value based on the openWeatherAPI air quality index

    switch(input){
        case 1:
            return 'Good';
        case 2:
            return  'Fair';
        case 3:
            return  'Moderate';
        case 4:
            return  'Poor';
        case 5:
            return  'Very Poor';
        default:
            return 'Unknown';
    }
}