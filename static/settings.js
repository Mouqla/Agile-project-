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

    //fetch for air pollution
    var apiResult = await getPollutionOpenWeather(lat,long);
    //fetch city name
    var cityName = await reverseGeocode(lat,long);

    try {
        //create an object which holds all the location information
        const locationData = new LocationData(apiResult, lat, long, cityName);
        // Lägger resultatet i en ny "frame" i sidebar
        createAndAppendFrame(locationData); //TODO
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

/////// User Interaction: Search from search bar
const searchInput = document.querySelector('.input')
searchInput.addEventListener("input", async (e) => {
    // input from search bar
    let searchTerm = e.target.value;
    query = regexSearchTerm(searchTerm);

    const location = await geocode(query).catch((err) => {
        console.error(err);
        return "default response";
      });

    var lat = location[0];
    var long = location[1];

    //move to location
    map.panTo([lat, long]);

    //Optional functionality: add results to sidebar. Would work similar to above. 
    //Best if there is a search dropdown, so that not all results before the final show
})

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

            //Header med stad, koordinater och tid
            var headerBox = newFrame.querySelector('#header');
            headerBox.innerHTML += `<h1>${content.city}</h1>`;
            headerBox.innerHTML += `<h2>${content.location}</h2>`
            headerBox.innerHTML += `<h3>Last updated ${content.time}</h3>`;            
        })
}
