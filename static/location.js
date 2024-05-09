class Location {
    constructor(lat, long) {
        this.lat = lat;
        this.long = long;

        this.marker = new Marker([lat, long]);

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
            createAndAppendFrame(locationData);

        } catch (error) {
            console.error("Error during location initialization:", error);
        }
    }

    close() {
        this.marker.removeMarker();
    }
}