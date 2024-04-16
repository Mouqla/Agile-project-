let map = L.map('map').setView([57.7, 11.972], 12.5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// DUMMY VALUES for openweather API
const pollutionResult = {
    "coord": [
      50.0,
      50.0
    ],
    "list": [
      {
        "dt": 1606147200,
        "main": {
          "aqi": 4.0
        },
        "components": {
          "co": 203.609,
          "no": 0.0,
          "no2": 0.396,
          "o3": 75.102,
          "so2": 0.648,
          "pm2_5": 23.253,
          "pm10": 92.214,
          "nh3": 0.117
        }
      }
    ]
  };

// DUMMY VALUES for openweather API
var geoCodingResult = [
    {
       "name":"London",
       "local_names":{
          "ms":"London",
          "gu":"લંડન",
          "is":"London",
          "wa":"Londe",
          "mg":"Lôndôna",
          "gl":"Londres",
          "om":"Landan",
          "ku":"London",
       },
       "lat":51.5073219,
       "lon":-0.1276474,
       "country":"GB",
       "state":"England"
    }
 ];

// Creates an Object that holds all the information for a single location
function LocationData(apiResult){
            
    //Fetch Geocoding response (city from coordinates)
    this.city = reverseGeocode(geoCodingResult[0].lat,geoCodingResult[0].lon);

    //Coordinates
    this.location = `${geoCodingResult[0].lat.toFixed(8)},${geoCodingResult[0].lon.toFixed(8)}`;
    
    //Formats the time last updated
    var unixTimeStamp = pollutionResult.list[0].dt; //UNIX time
    this.time = formatTimeFromUnix(unixTimeStamp);

    // Object containing measurements of air pollution
    this.pollution = pollutionResult.list[0].components;
    // Air Quality Index Qualitative, e.g. 'Good', 'Poor'
    this.airQualityIndex = getQualitativeValue(pollutionResult.list[0].main.aqi);
}

// Adds detailed information about pollution in a html-element
async function onMapClick(e) {
    openNav();
    const lat = e.latlng["lat"];
    const lng = e.latlng["lng"];
    const radius = 5000;

    var apiResult = await getPollution(lat, lng, radius);

    try {
        const locationData = new LocationData(apiResult);
        /* Lägger resultatet i en ny "frame" i sidebar*/
        createAndAppendFrame(locationData);
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

async function getPollution(lat, lng, radius) {
    const response = await fetch(`/api/get_air?lat=${lat.toFixed(3)}&lng=${lng.toFixed(3)}&radius=${radius}`); // OpenAQ

    //const response = await fetch(`/api/air_pollution?lat=${lat.toFixed(3)}&lon=${long.toFixed(3)}`); // OpenWeather
    const retJson = await response.json();
    return Object.values(retJson)[1][0];
}

function formatTimeFromUnix(unixTimeStamp) {
    var date = new Date(unixTimeStamp * 1000);
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDay();
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

            // TODO - closebutton borta?
            const closeButton = newFrame.querySelector('.closebtn');
            closeButton.addEventListener('click', function() {
                    closeFrame(newFrame.id);
                });

            //Lägger till mätvärden för luftföroreningar i sidebar 
            infoBox.innerHTML += 'Air Quality Index: ' + content.airQualityIndex;
            infoBox.innerHTML += '<br>';

            for(let key in content.pollution){
                infoBox.innerHTML += key + ' ';
                infoBox.innerHTML += content.pollution[key];
                infoBox.innerHTML += ' μg/m<sup>3</sup>';
                infoBox.innerHTML += '<br>';
            }

            //Header med stad, mätstation och tid
            var headerBox = newFrame.querySelector('#header');
            headerBox.innerHTML = `<h1>${content.city}</h1>`;
            headerBox.innerHTML += `<h2>${content.location}</h2>`
            headerBox.innerHTML += `<h3>Last updated ${content.time}</h3>`;            
        })
}

map.on('click', onMapClick);

//Add Search functionality
const searchInput = document.querySelector('.input')
searchInput.addEventListener("input", async (e) => {
    // input from search bar
    let searchTerm = e.target.value;
   
    query = regexSearchTerm(searchTerm);

    try{
        var lat = geocode(query)[0];
        var long = geocode(query)[1];

        //zoom to location
        map.panTo([lat, long]);

        //search for air pollution, call the API
        const apiResult = await getPollution(lat, long, radius); 
        const locationData = new LocationData(apiResult);

        /* Lägger resultatet i en ny "frame" i sidebar*/
        createAndAppendFrame(locationData);
    }
    catch{
        //how to handle? it is okay if the user hasn't inputed the full name of the city yet
    }
})

function regexSearchTerm(searchTerm){
    //find city, state and country names, separated by e.g. commas, but not blank spaces
    //searchTerm = 'New York, New York, USA' //Dummy value
    
    const regex = /(\w+\s*\w*)/g; 
    const matches = searchTerm.match(regex);

    let query = '';
    for(match in matches){
        query += `${matches[match]},`;
    }

    query = query.substring(0, query.length-1);

    console.log(query);

}

async function geocode(query){
    // returns the coordinates of a location based on the name
    // accepts the format: city,state,country OR city,state OR city
    const response = await fetch(`/api/geo/1.0/direct?q=${query}&limit=1`);
    const retJson = await response.json(); 
    console.log(Object.values(retJson)[0].lat, Object.values(retJson)[0].lon);
    //return [Object.values(retJson)[0].lat, Object.values(retJson)[0].lon] //TODO check against API
    return [57.7, 11.972] //TODO Dummy value remove when API works
    
}

function reverseGeocode(lat,long){
    //find the name of a city from coordinates
    //const response = await fetch(`/api/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=1`);
    //const retJson = await response.json();
    //return Object.values(retJson)[0].name; //TODO check against real API
    return 'Gothenburg'; //TODO Dummy Value remove when API works
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

