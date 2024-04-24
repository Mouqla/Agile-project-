// Handles user's interaction


////// User Interaction: Click on map
async function onMapClick(e) {
    openNav();
    const lat = e.latlng["lat"];
    const long = e.latlng["lng"];
    const radius = 5000; //if using OpenAQ

    //fetch air pollution
    var apiResult = await getPollutionOpenWeather(lat,long);
    //fetch city name
    var cityName = await reverseGeocode(lat,long);

    try {
        //create an object which holds all the location information
        const locationData = new LocationData(apiResult, lat, long, cityName);
        // Lägger resultatet i en ny "frame" i sidebar
        prepareNextFrame(compareMode);
        createAndAppendFrame(locationData) /* Lägger resultatet i en ny "frame" i sidebar*/

    } catch (error) {
        console.log(error);
        if (error instanceof TypeError) {
            var popup = L.popup()
            .setLatLng(e.latlng)
            .setContent(`No results within ${radius} meters`)
            .openOn(map);
        }
        else {
            var popup = L.popup()
            .setLatLng(e.latlng)
            .setContent(`Unknown error fetching API data`)
            .openOn(map);
        }
    }
}

map.on('click', onMapClick);

/////// User Interaction: Input text in search bar, give choice of five cities
const searchInput = document.querySelector('.input')
searchInput.addEventListener("input", async (e) => {
    const searchDatalist = document.getElementById("search-results");

    // input from search bar
    let searchTerm = e.target.value;
    query = regexSearchTerm(searchTerm);

    const locations = await geocodeMulti(query).catch((err) => {
        console.error(err);
        return "default response";
      });

    //empty dropdown so it can be repopulated at every input from keyboard
    searchDatalist.innerHTML += '';
    //create dropdown with several choices matching search query
    function appendSearchResult(value){
        if(value[1] === undefined) { // if city does not belong to a state
            searchDatalist.innerHTML += `<option value="${value[0]}, ${value[2]}"></option>`; //city, country
        }
        else {
            searchDatalist.innerHTML += `<option value="${value[0]}, ${value[1]}, ${value[2]}"></option>`; //city, state, country
        }
    }
    locations.forEach(appendSearchResult);
})