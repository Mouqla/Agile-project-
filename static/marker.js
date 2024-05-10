const customIcon = L.icon({
    iconUrl: '/static/images/location.png', // Path to your custom image
    iconSize: [64, 64], // Size of the icon
    iconAnchor: [32, 50], // Position where the icon is anchored on the map
    popupAnchor: [0, -32], // Position where the popup is anchored relative to the icon
});

const alternateIcon = L.icon({
    iconUrl: '/static/images/userlocation.png', // Different icon for older markers
    iconSize: [64, 64],
    iconAnchor: [32, 50],
    popupAnchor: [0, -32],
});

class Marker {
    constructor(coordinates) {
        this.marker = L.marker(coordinates, { icon: customIcon });
        
        this.initialize();
    }

    initialize(){
        this.marker.addTo(map)
    }

    removeMarker() {
        this.marker.remove();
    }
}