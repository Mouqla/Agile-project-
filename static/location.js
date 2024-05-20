class Location {
    constructor(e) {
        this.e = e;
        this.lat = e.latlng["lat"];
        this.long = e.latlng["lng"];

        this.marker = new Marker([this.lat, this.long]);

        this.initialize();
    }

    async initialize() {
        try {
            // Fetch air pollution data, city name and country
            let apiResult = await getPollutionOpenWeather(this.lat, this.long);
            let cityName = await reverseGeocode(this.lat, this.long);
            let stateCountry = await reverseGeocodeStateCountry(this.lat, this.long);

            // Fetch forecast and get qualitative value
            let forecast = await getForecast24hours(this.lat, this.long);
            forecast = getQualitativeValue(forecast.main.aqi);

            const locationData = new LocationData(
                apiResult,
                this.lat,
                this.long,
                cityName,
                stateCountry,
                forecast
            );

            prepareNextFrame(compareMode);
            createAndAppendFrame(locationData, this);

        } catch (error) {
            const radius = 5000; //if using OpenAQ
            console.log(error);
            if (error instanceof TypeError) {
                let popup = L.popup()
                .setLatLng(this.e.latlng)
                .setContent(`No results within ${radius} meters`)
                .openOn(map);
            }
            else {
                let popup = L.popup()
                .setLatLng(this.e.latlng)
                .setContent(`Unknown error fetching API data`)
                .openOn(map);
            }
            this.close();
        }
    }

    close() {
        this.marker.removeMarker();
    }
}