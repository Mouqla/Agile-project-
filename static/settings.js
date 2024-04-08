let map = L.map('map').setView([57.7, 11.972], 12.5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Popup when clicking on map, displays latitude & longitude of click location
async function onMapClick(e) {
    const lat = e.latlng["lat"];
    const lng = e.latlng["lng"];

    const response = await fetch(`/api/get_air?lat=${lat.toFixed(3)}&lng=${lng.toFixed(3)}&radius=1000`);

    const retJson = await response.json(); 

    console.log(retJson);
    
    var popup = L.popup()
        .setLatLng(e.latlng)
        .setContent("You clicked at: " + retJson)
        .openOn(map);
}

map.on('click', onMapClick);
