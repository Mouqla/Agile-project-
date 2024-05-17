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


// Handles button click on user's location
function onLocationButtonClick() {

    function createMockMapEvent(lat, lon) {
        // Create a mock object that mimics a map click event
        const mockEvent = {
            latlng: {
                lat: lat,
                lng: lon
            }
        };
        return mockEvent;
    }

    if ('geolocation' in navigator) {
        // Get the user's current position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const mockEvent = createMockMapEvent(lat, lon);

                onMapClick(mockEvent);

                map.setView([lat, lon], 13); // Zoom to level 13
            },
            (error) => {
                console.error('Error getting location:', error.message);
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser');
    }
}

// Add an event listener to the button to trigger the above function on click
document.querySelector('.user-location-button').addEventListener('click', onLocationButtonClick);

module.exports = {
    onLocationButtonClick
};