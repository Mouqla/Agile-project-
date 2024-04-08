let map = L.map('map').setView([57.7, 11.972], 12.5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

<<<<<<< HEAD

=======
>>>>>>> 5a5fe835829ffc9ebc2748af9a10ee9fbc5ea9a9
// Popup when clicking on map, displays latitude & longitude of click location
function onMapClick(e) {
    var popup = L.popup()
    .setLatLng(e.latlng)
    .setContent("You clicked at: " + e.latlng)
    .openOn(map);
}
<<<<<<< HEAD

map.on('click', onMapClick);


=======
map.on('click', onMapClick);
>>>>>>> 5a5fe835829ffc9ebc2748af9a10ee9fbc5ea9a9
