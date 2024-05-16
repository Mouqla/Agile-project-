// Importing the necessary functions
const {
  getFormattedPollutionName,
  getQualitativeValue,
  formatTimeFromUnix,
  reverseGeocode,
  reverseGeocodeStateCountry,
  geocode,
  geocodeMulti,
  getPollutionOpenWeather,
  LocationData
} = require('./location-data.js');

// Importing the necessary functions from forecast-history.js
const { getForecast24hours } = require('./forecast-history.js');


// Mocking location-data.js module
jest.mock('./location-data.js', () => {
  const openWeatherResult = {
    "components": {
      "nh3": 0.47,
      "no": 1.33,
      "no2": 7.2,
      "o3": 107.29,
      "pm10": 5.08,
      "pm2_5": 4.04,
      "so2": 6.08
    },
    "dt": 1715699680,
    "main": {
      "aqi": 3,
      "co": 205.28,
    }
  };

  let coords = [57.7072326, 11.9670171];
  let placeString = 'Gothenburg';
  let stateCountryResponse = ['Texas', 'USA'];

  let cityMap = new Map([
    [[48.8534951, 2.3483915],["Paris", "Ile-de-France", "FR" ]],
    [[33.6617962, -95.555513],["Paris", "Texas", "US" ]],
    [[38.2097987, -84.2529869],["Paris", "Kentucky", "US" ]],
    [[48.8588897, 2.3200410217200766],["Paris", "Ile-de-France", "FR" ]],
    [[48.8588897, 2.3200410217200766],["Paris", "Ile-de-France", "FR" ]],
  ]);

  // Mock implementation for getPollutionOpenWeather
  const mockGetPollutionOpenWeather = jest.fn().mockImplementation(() => {
    return Promise.resolve(openWeatherResult); // Mocked API-result
  });

  // Mock implementation for the geocode function
  const mockGeocode = jest.fn().mockImplementation(() => {
    return Promise.resolve([57.7072326, 11.9670171]); // Mocked coordinates
  });

  // Mock implementation for the geocodeMulti function
  const mockGeocodeMulti = jest.fn().mockImplementation(() => {
    return Promise.resolve(cityMap); // Mocked results Map
  });

  // Mock implementation for the reverseGeocode function
  const mockReverseGeocode = jest.fn().mockImplementation(() => {
    return Promise.resolve('Gothenburg'); // Mocked place string
  });

  // Mock implementation for the reverseGeocodeStateCountry function
  const mockReverseGeocodeStateCountry = jest.fn().mockImplementation(() => {
    return Promise.resolve(['Texas','USA']); // Mocked place string
  });

  // Return the mocked functions along with the rest of the functions from the original module
  return {
    ...jest.requireActual('./location-data.js'), // Keep other functions intact
    getPollutionOpenWeather: mockGetPollutionOpenWeather,
    geocode: mockGeocode,
    geocodeMulti: mockGeocodeMulti,
    reverseGeocode: mockReverseGeocode,
    reverseGeocodeStateCountry: mockReverseGeocodeStateCountry 
  };

  /*
  const originalModule = jest.requireActual('./location-data.js'); // Importing the original module
  return {
    ...originalModule, // Keep other functions intact
    getPollutionOpenWeather: jest.fn().mockResolvedValue(openWeatherResult),
    geocode: jest.fn().mockResolvedValue(coords),
    geocodeMulti: jest.fn().mockResolvedValue(cityMap),
    reverseGeocode: jest.fn().mockResolvedValue(placeString),
    reverseGeocodeStateCountry: jest.fn().mockResolvedValue(stateCountryResponse),
  };
  */
});

// Mocking forecast-history.js module
jest.mock('./forecast-history.js', () => {  
  const openWeatherResult = {
    "components": {
      "nh3": 0.47,
      "no": 1.33,
      "no2": 7.2,
      "o3": 107.29,
      "pm10": 5.08,
      "pm2_5": 4.04,
      "so2": 6.08
    },
    "dt": 1715699680,
    "main": {
      "aqi": 3,
      "co": 205.28,
    }
  };

  const originalModule = jest.requireActual('./forecast-history.js'); // Importing the original module
  return {
    ...originalModule, // Keep other functions intact
    getForecast24hours: jest.fn().mockResolvedValue(openWeatherResult),
  };
});

// Jest test for getPollutionOpenWeather function
describe('getPollutionOpenWeather', () => {
  test('returns pollution data for given latitude and longitude', async () => {
    // Define latitude and longitude
    const lat = 40.7128;
    const lon = -74.0060;

    // Mock return value for getPollutionOpenWeather
    const openWeatherResult = {
      "components": {
        "nh3": 0.47,
        "no": 1.33,
        "no2": 7.2,
        "o3": 107.29,
        "pm10": 5.08,
        "pm2_5": 4.04,
        "so2": 6.08
      },
      "dt": 1715699680,
      "main": {
        "aqi": 3,
        "co": 205.28,
      }
    };

    // Call the function
    const pollutionData = await getPollutionOpenWeather(lat, lon);

    // Check if the correct value is returned
    expect(pollutionData).toEqual(openWeatherResult);
  });
});


// Jest test for geocode function
describe('geocode', () => {
  test('Returns a string with city (state) and country code ', async () => {
    let placeString = 'Gothenburg';  
    let coords = [57.7072326, 11.9670171];
  
    // Call the function
    //const geocodeResponse = await geocode(placeString);
    const geocodeResponse = await geocode(placeString);

    // Check if the correct value is returned
    expect(geocodeResponse).toEqual(coords);
  });
});


// Jest test for geocodeMulti function
describe('geocodeMulti', () => {
  test('Returns a map with coords as keys and places as values', async () => {
    let searchString = 'Paris';
    
    let cityMap = new Map([
      [[48.8534951, 2.3483915],["Paris", "Ile-de-France", "FR" ]],
      [[33.6617962, -95.555513],["Paris", "Texas", "US" ]],
      [[38.2097987, -84.2529869],["Paris", "Kentucky", "US" ]],
      [[48.8588897, 2.3200410217200766],["Paris", "Ile-de-France", "FR" ]],
      [[48.8588897, 2.3200410217200766],["Paris", "Ile-de-France", "FR" ]],
    ]);

    // Call the function
    const geocodeResponse = await geocodeMulti(searchString);

    // Check if the correct value is returned
    expect(geocodeResponse).toEqual(cityMap);
  });
});

// Jest test for reverseGeocode function
describe('reverseGeocode', () => {
  test('get the name of a city from coordinates ', async () => {
    let coords = [57.7072326, 11.9670171];
    let placeString = 'Gothenburg';
    
    // Call the function
    const geocodeResponse = await reverseGeocode(coords);

    // Check if the correct value is returned
    expect(geocodeResponse).toEqual(placeString);
  });
});

// Jest test for reverseGeocodeStateCountry function
describe('reverseGeocodeStateCountry', () => {
  test('get an array with state and country ', async () => {
    let coords = [33.39, 95.32];
    let response = ['Texas', 'USA'];
    
    // Call the function
    const geocodeResponse = await reverseGeocodeStateCountry(coords);

    // Check if the correct value is returned
    expect(geocodeResponse).toEqual(response);
  });
});


// Jest test for LocationData class
describe('LocationData', () => {
  test('Class which contains location data', async () => {
    let coords = [33.397897, 95.32983493];

    let apiResult = await getPollutionOpenWeather(coords[0], coords[1]);
    apiResult = [apiResult,'filler']
    let cityName = await reverseGeocode(coords[0], coords[1]);
    let stateCountry = await reverseGeocodeStateCountry(coords[0], coords[1]);

    let components = {
      "nh3": 0.47,
      "no": 1.33,
      "no2": 7.2,
      "o3": 107.29,
      "pm10": 5.08,
      "pm2_5": 4.04,
      "so2": 6.08
    };

    // Fetch forecast and get qualitative value
    let forecast = await getForecast24hours(coords[0], coords[1]);
    forecast = getQualitativeValue(forecast.main.aqi);
    
    // Call the function
    const myLocationData = new LocationData(apiResult, coords[0], coords[1], cityName, stateCountry, forecast);

    // Check if the correct value is returned
    expect(myLocationData.city).toEqual('Gothenburg');
    expect(myLocationData.state).toEqual('Texas');
    expect(myLocationData.country).toEqual('USA');
    expect(myLocationData.location).toEqual(`33.3979,95.3298`);
    expect(myLocationData.time).toEqual("2024-05-14 17:14:40");
    expect(myLocationData.pollution).toEqual(components);
    expect(myLocationData.airQualityIndex).toEqual(["Moderate", "#FFEB3B"]);
    expect(myLocationData.forecast).toEqual(["Moderate", "#FFEB3B"]);
  });
});

// Jest test for getFormattedPollutionName function
test('getFormattedPollutionName with invalid input returns null', () => {
  expect(getFormattedPollutionName('banana')).toBe(null);
});

// Jest test for getQualitativeValue function
test('getQualitativeValue with good value returns "Good"', () => {
  expect(getQualitativeValue(1)[0]).toStrictEqual('Good');
});

// Jest test for getQualitativeValue function with unknown value
test('getQualitativeValue with unknown value returns "Unknown"', () => {
  expect(getQualitativeValue('55')[0]).toStrictEqual('Unknown');
});

// Jest test for formatTimeFromUnix function
test('formatTimeFromUnix formats Unix time correctly', () => {
  expect(formatTimeFromUnix(0)).toStrictEqual('1970-01-01 01:00:00');
});
