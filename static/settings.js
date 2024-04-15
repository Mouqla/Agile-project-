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
    //console.log(retJson);

    try {
        var apiResult = Object.values(retJson)[1][0];
        //console.log(apiResult);
    
        // Creates an Object that holds all the information for a single location
        function LocationData(apiResult){
            this.city = apiResult.city;
            this.location = apiResult.location;
            
            //formats the time last updated
            var timeStr = apiResult.measurements[0].lastUpdated.toString();
            var strLen = timeStr.length;
            var date = timeStr.substring(0,10);
            var hour = timeStr.substring(strLen-14,strLen-12);
            var min = timeStr.substring(strLen-5,strLen-3);
            var sec = timeStr.substring(strLen-2,strLen);
            this.time = `${date} ${hour}:${min}:${sec}`;
            
            this.closestLatitude = apiResult.coordinates.latitude;
            this.closestLongitude = apiResult.coordinates.longitude;
            
            //creates a map of the measured values
            var pollutionMap = new Map();
            var measurements = apiResult.measurements;
            for(let i = 0; i < measurements.length; i++){
                parameter = measurements[i].parameter;
                //some sources supply temperature, humidity etc. filter out here?
                value = measurements[i].value;
                unit = measurements[i].unit;
                lastUpdated = measurements[i].lastUpdated;
                pollutionMap.set(parameter, [value, unit, lastUpdated]);
            }
            pollutionMap = new Map(Array.from(pollutionMap).sort()); //sort the map alphabetically 

            this.pollution = pollutionMap;
        }
    
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
            var pollutionMap = content.pollution;
            var mapIterator = pollutionMap[Symbol.iterator]();
            for (const item of mapIterator) {
                infoBox.innerHTML += item[0].toString() + ' ' // parameter aka type of pollution
                infoBox.innerHTML += item[1][0]; //value
                infoBox.innerHTML += item[1][1]; //unit
                infoBox.innerHTML += '<br>'; //linebreak
              }

            //Header med stad, mätstation och tid
            var headerBox = newFrame.querySelector('#header');
            headerBox.innerHTML = `<h1>${content.city}</h1>`;
            headerBox.innerHTML += `<h2>${content.location + '. Last updated ' + content.time}</h2>`;            
        })
}

map.on('click', onMapClick);

