let marker;

const customIcon = L.icon({
    iconUrl: '/static/images/location.png', // Path to your custom image
    iconSize: [64, 64], // Size of the icon
    iconAnchor: [32, 50], // Position where the icon is anchored on the map
    popupAnchor: [0, -32], // Position where the popup is anchored relative to the icon
});

function addMarker(coordinates) {
    marker = L.marker(coordinates, { icon: customIcon });
    marker.addTo(map);
}

function removeMarker() {
    if (marker) {
        marker.remove();
    }
}