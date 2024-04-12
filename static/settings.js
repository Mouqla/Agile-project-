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

    //console.log(retJson);

    var displayStr = ""
    var apiResult = Object.values(retJson)[1][0];
    try {
        var closestLat = apiResult.coordinates.latitude;
        var closestLong = apiResult.coordinates.longitude;
        displayStr = `Air Pollution at closest station (${closestLat}, ${closestLong}) is `
        var city = apiResult.city;
        var station = apiResult.location;
        console.log(city)
        console.log(station)
        for(let i = 0; i < apiResult.measurements.length; i++){
            displayStr += "\n" + apiResult.measurements[i].parameter + ": ";
            displayStr += "\n" + apiResult.measurements[i].value + " ";
            displayStr += "\n" + apiResult.measurements[i].unit;
            displayStr += "\n";}
    } catch (error) {
        console.log(error);
        if (error instanceof TypeError) {
            displayStr = `No results within ${radius} meters`;
        }
        else {
            displayStr = `Unknown error fetching API data`;
        }
    }
    createAndAppendFrame(displayStr) /* Lägger resultatet i en ny "frame" i sidebar*/
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
