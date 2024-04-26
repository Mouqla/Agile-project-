// Search bar

/////// User Interaction: Input text in search bar, give choice of five cities
const searchInput = document.querySelector('.input')
searchInput.addEventListener("input", async (e) => {
    const searchDatalist = document.getElementById("search-results");

    // input from search bar
    var searchTerm = e.target.value;
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

//Search by clicking enter in search bar
async function eventInSearchBar(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        // input from search bar
        let searchTerm = event.target.value;
        
        //fetch coords
        var coords = await geocode(searchTerm);
        map.panTo(coords);

        ///////Below is optional code to open sidebar automatically
        //fetch air pollution
        var apiResult = await getPollutionOpenWeather(coords[0], coords[1]);
        //fetch city name
        var cityName = await reverseGeocode(coords[0], coords[1]);

        try {
            //create an object which holds all the location information
            const locationData = new LocationData(apiResult, coords[0], coords[1], cityName);
            // optionally, sidebar could be opened automatically here
            prepareNextFrame(compareMode);
            createAndAppendFrame(locationData);
        }
        catch(error){
            console.log(error);
        }

        if(countForecastHistoryButton == 1){
            closeforeCastHistoryWindow();
            openForecastHistoryWindow();
        }
        
    }
}

function regexSearchTerm(searchTerm){
    //find city, state and country names, separated by e.g. commas, but not blank spaces
    //searchTerm = 'Paris, Texas, USA' //Example user input
    const regex = /(\w+\s*\w*)/g; 
    const matches = searchTerm.match(regex);

    let query = '';
    for(match in matches){
        query += `${matches[match]},`;
    }

    query = query.substring(0, query.length-1);
    return query
}

