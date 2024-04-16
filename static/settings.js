let map = L.map('map').setView([57.7, 11.972], 12.5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Popup when clicking on map, displays latitude & longitude as well as closest measurement
async function onMapClick(e) {
    openNav();
    const lat = e.latlng["lat"];
    const lng = e.latlng["lng"];
    const radius = 5000;

    const response = await fetch(`/api/get_air?lat=${lat.toFixed(3)}&lng=${lng.toFixed(3)}&radius=${radius}`);

    const retJson = await response.json(); 

    console.log(retJson);

    const locationData = "";

    try {
        var apiResult = Object.values(retJson)[1][0];
    
        function LocationData(apiResult){
            this.city = apiResult.city;
            this.location = apiResult.location;
            this.closestLatitude = apiResult.coordinates.latitude;
            this.closestLongitude = apiResult.coordinates.longitude;
            this.pollution = new Pollution(apiResult);
        }
    
        function Pollution(apiResult){
            const pollutionMap = new Map();
            var measurements = apiResult.measurements;
            for(let i = 0; i < measurements.length; i++){
                parameter = measurements[i].parameter;
                value = measurements[i].value;
                unit = measurements[i].unit;
                pollutionMap.set(parameter, [value, unit]);
            }
            this.pollution = pollutionMap;
        }
    
        const locationData = new LocationData(apiResult);
        console.log(locationData);
    } catch (error) {
        console.log(error);
        if (error instanceof TypeError) {
            console.log(`No results within ${radius} meters`);
        }
        else {
            console.log(`Unknown error fetching API data`);
        }
    }
    createAndAppendFrame(locationData) /* Lägger resultatet i en ny "frame" i sidebar*/
}


/* Öppnar sidebaren (initialt utanför skärmen) */ /* TODO */
function openNav() {
    document.getElementById("offcanvas").style.width = "382";
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
            infoBox.innerHTML = content;

            const sidebar = document.getElementById('offcanvas');
            sidebar.appendChild(newFrame);

            const closeButton = newFrame.querySelector('.closebtn');
            closeButton.addEventListener('click', function() {
                    closeFrame(newFrame.id);
                });

            document.getElementById("location").innerHTML = "City name";

        })
        
}


map.on('click', onMapClick);

async function fetchAirQualityData() {
    const dataSet = []
    for (let i = 1; i< 19; i++){
        if (i == 17){
            continue
        }else{
            const url = /api/get_points?page=${i}
            const response = await fetch(url);
            const data = await response.json();
            dataSet.push(...data.results)
            console.log(data)
        }
    }
    console.log(dataSet)
    return dataSet;
}

async function addHeatMap(){
    const data = await fetchAirQualityData();
    const heatPoints = [];

    data.forEach(item => {
        if (item.coordinates && item.measurements){
            const value = item.measurements[0].value;
            heatPoints.push([
                item.coordinates.latitude,
                item.coordinates.longitude,
                value
            ]);
        }
    });
    console.log(heatPoints)
    L.heatLayer(heatPoints, {max:3, blur:0, radius: 15, gradient: {
        '0': 'Navy', '0.25': 'Navy',
        '0.26': 'Green',
        '0.5': 'Green',
        '0.51': 'Yellow',
        '0.75': 'Yellow',
        '0.76': 'Red',
        '1': 'Red'
      },}).addTo(map);


}

addHeatMap();