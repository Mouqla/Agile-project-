// Initializes the map

const minLatitude = -85;  // Minimum latitude limit
const maxLatitude = 85;   // Maximum latitude limit

let map = L.map('map', {
    center: [57.7, 11.972], // Initial center
    zoom: 12.5, // Initial zoom level
    minZoom: 2,
    maxZoom: 19,
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
}).addTo(map);

// Event listener to restrict panning if it goes beyond the defined boundaries
map.on('moveend', () => {
    const center = map.getCenter(); // Current map center
    if (center.lat < minLatitude) {
        map.panTo([minLatitude, center.lng]); // Correct if pan too far south
    } else if (center.lat > maxLatitude) {
        map.panTo([maxLatitude, center.lng]); // Correct if pan too far north
    }
});