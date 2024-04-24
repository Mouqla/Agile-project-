// Geolocation handles the user's location

// Function to handle geolocation success
function onGeolocationSuccess(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    map.setView([lat, lon], 13); // Update the existing map
}

// Function to handle geolocation error
function onGeolocationError(error) {
    console.error('Error getting location:', error.message);
    // Keep the default location if there's an error
}

// Get user's location if possible
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError);
} else {
    console.error('Geolocation is not supported by this browser');
}