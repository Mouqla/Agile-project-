let map = L.map('map').setView([57.7, 11.972], 12.5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// Popup when clicking on map, displays latitude & longitude of click location
function onMapClick(e) {
    var popup = L.popup()
    .setLatLng(e.latlng)
    .setContent("You clicked at: " + e.latlng)
    .openOn(map);
}

map.on('click', onMapClick);


