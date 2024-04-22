let frameList = [];
let heatMap;
var compareMode = false; //Ska tas bort senare

let map = L.map('map').setView([57.7, 11.972], 12.5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

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
    let searchTerm = e.target.value;
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

//Search by clicking enter in search bar
async function clickPress(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        // input from search bar
        let searchTerm = event.target.value;
        
        //fetch coords
        var coords = await geocode(searchTerm);
        map.panTo(coords);

        ///////Below is optional code to open sidebar automatically
        //fetch air pollution
        var apiResult = await getPollutionOpenWeather(coords[0], coords[1]);
        //fetch city name
        var cityName = await reverseGeocode(coords[0], coords[1]);

        try {
            //create an object which holds all the location information
            const locationData = new LocationData(apiResult, coords[0], coords[1], cityName);
            // optionally, sidebar could be opened automatically here
            prepareNextFrame(compareMode);
            createAndAppendFrame(locationData);
        }
        catch(error){
            console.log(error);
        }
    }
}

function regexSearchTerm(searchTerm){
    //find city, state and country names, separated by e.g. commas, but not blank spaces
    //searchTerm = 'Paris, Texas, USA' //Example user input
    const regex = /(\w+\s*\w*)/g; 
    const matches = searchTerm.match(regex);

    let query = '';
    for(match in matches){
        query += `${matches[match]},`;
    }

    query = query.substring(0, query.length-1);
    return query
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

//////// ADDING AND REMOVING USER INTERFACE ELEMENTS

/* Öppnar sidebaren (initialt utanför skärmen) */ /* TODO */
function openNav() {
    document.getElementById("offcanvas").style.width = "380";
    document.getElementById("main").style.marginRight = "-200px";
}

/* Raderar en frame från sidebar */
function closeFrame(frameId) {
    const frame = document.getElementById(frameId);
    if (frame) {
        frame.remove();
    }
}
  
/* Skapar en ny "frame" (info-frame.html) i html, lägger info i infoBox rutan och appendar till sidebar*/
function createAndAppendFrame(content) {
    fetch('info-frame.html')
        .then(response => response.text())
        .then(html => {
            const newFrame = document.createElement('div');
            newFrame.classList.add('frame');
            newFrame.id = 'frame-' + Date.now(); 

            newFrame.innerHTML = html;

            const infoBox = newFrame.querySelector('#infoBox');

            const sidebar = document.getElementById('offcanvas');
            sidebar.appendChild(newFrame);


            //Lägger till mätvärden för luftföroreningar i sidebar 
            infoBox.innerHTML += 'Air Quality Index: ' + content.airQualityIndex;
            infoBox.innerHTML += '<br>';

            for(let key in content.pollution){
                infoBox.innerHTML += key + ' ';
                infoBox.innerHTML += content.pollution[key];
                infoBox.innerHTML += ' μg/m<sup>3</sup>';
                infoBox.innerHTML += '<br>';
            }

            //Header med stad, koordinater och tid
            var headerBox = newFrame.querySelector('#header');
            headerBox.innerHTML += `<h1>${content.city}</h1>`;
            headerBox.innerHTML += `<h2>${content.location}</h2>`
            headerBox.innerHTML += `<h3>Last updated ${content.time}</h3>`; 

            const closeButton = newFrame.querySelector('.closebtn');
            closeButton.addEventListener('click', function() {
                    closeFrame(newFrame.id);
                });
            
            frameList.push(newFrame.id)
        })
}


/* Stänger tidigare frame inför skapandet av nästa frame, med undantag för om användaren klickat i Compare Mode */
function prepareNextFrame(compareMode) {
    if (!compareMode) {
        if (frameList.length > 0) {
            closeFrame(frameList[0]);
            frameList = [];
        }
        return;
    }
    if (frameList.length != 1) {
        closeFrame(frameList[0]);
        frameList = [];
        return;
    }
}


function createSearchDropdown(locations){
    const searchDropdown = document.getElementById("searchDropdown");
    for(location in locations){
        searchDropdown.innerHTML += `<div>Hello!</div>`;
    }
}

async function fetchAirQualityData() {
    const dataSet = [];
    for (let i = 1; i< 19; i++){
        if (i == 17){
            continue
        }else{
            const url = `/api/get_points?page=${i}`;
            const response = await fetch(url);
            const data = await response.json();
            dataSet.push(...data.results);
        }
    }
    return dataSet;
}



async function addHeatMap(type){
    const data = await fetchAirQualityData();
    const heatPoints =[];
    
    data.forEach(item => {
        if (item.coordinates && item.measurements) {
            for (const measurement of item.measurements) {
                if (measurement.parameter == type){
                    heatPoints.push([
                        item.coordinates.latitude,
                        item.coordinates.longitude,
                        measurement.value
                    ]);
                }
            }
        }
    });

    if (heatMap) {
        map.removeLayer(heat);
    }

    heatMap = L.heatLayer(heatPoints, {max:3, blur:0, radius: 15, gradient: {
        '0': 'Navy', '0.25': 'Navy',
        '0.26': 'Green',
        '0.5': 'Green',
        '0.51': 'Yellow',
        '0.75': 'Yellow',
        '0.76': 'Red',
        '1': 'Red'
      },}).addTo(map);
}