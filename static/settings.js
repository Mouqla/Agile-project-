let map = L.map('map').setView([57.7, 11.972], 12.5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Popup when clicking on map, displays latitude & longitude as well as closest measurement
async function onMapClick(e) {
    const lat = e.latlng["lat"];
    const lng = e.latlng["lng"];
    const radius = 5000;

    const response = await fetch(`/api/get_air?lat=${lat.toFixed(3)}&lng=${lng.toFixed(3)}&radius=${radius}`);

    const retJson = await response.json(); 

    //console.log(retJson);

    var displayStr = ""
    var apiResult = Object.values(retJson)[1][0]
    try {
        var closestLat = apiResult.coordinates.latitude;
        var closestLong = apiResult.coordinates.longitude;
        displayStr = `Air Pollution at closest station (${closestLat}, ${closestLong}) is `     
        for(let i = 0; i < apiResult.measurements.length; i++){
            displayStr += apiResult.measurements[i].parameter + ": ";
            displayStr += apiResult.measurements[i].value + " ";
            displayStr += apiResult.measurements[i].unit;
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

    var popup = L.popup()
        .setLatLng(e.latlng)
        .setContent(displayStr)
        .openOn(map);
}

map.on('click', onMapClick);
