const { geocodeMulti } = require('./location-data.js');
const { geocode } = require('./__mocks__/geocode.js');

({getFormattedPollutionName, 
  getQualitativeValue,
  formatTimeFromUnix,
  reverseGeocode,
  getPollutionOpenWeather,
} = require('./location-data.js'))

test(`getFormattedPollutionName('banana'): Expects null`, () => {
  expect(getFormattedPollutionName('banana')).toBe(null);
});

test(`getQualitativeValue(1)[0]: Expects Good`, () => {
    expect(getQualitativeValue(1)[0]).toStrictEqual('Good');
  });

test(`getQualitativeValue(55)[0]: Expects Unknown`, () => {
    expect(getQualitativeValue('55')[0]).toStrictEqual('Unknown');
  });

test(`formatTimeFromUnix(0): Expects 1970-01-01 01:00:00`, () => {
  expect(formatTimeFromUnix(0)).toStrictEqual('1970-01-01 01:00:00');
})

// Mock return value for getPollutionOpenWeather
const openWeatherResult = {
  "components": {
    "co": 205.28,
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
    "aqi": 3
  }
}

// Not actual mock that can be reused by other functions, needs to be reworked
test("mock implementation getPollutionOpenWeather()", () => {
  const getPollutionOpenWeather = jest.fn(() => openWeatherResult);

  expect(getPollutionOpenWeather(57.70, 11.96)).toBe(openWeatherResult);
});

// Not actual mock that can be reused by other functions, needs to be reworked
test("mock implementation geocode()", () => {
  const geocode = jest.fn(() => [57.7072326, 11.9670171]);

  expect(geocode('Gothenburg, SE')).toStrictEqual([57.7072326, 11.9670171]);
  expect(geocode).toHaveBeenCalledWith('Gothenburg, SE');
});

// Return object for geocodeMulti
let cityMap = new Map([
  [[48.8588897, 2.3200410217200766],["Paris", "Ile-de-France", "FR" ]],
  [[48.8534951, 2.3483915],["Paris", "Ile-de-France", "FR" ]],
  [[33.6617962, -95.555513],["Paris", "Texas", "US" ]],
  [[38.2097987, -84.2529869],["Paris", "Kentucky", "US" ]],
  [[48.8588897, 2.3200410217200766],["Paris", "Ile-de-France", "FR" ]],
]);

// Not actual mock that can be reused by other functions, needs to be reworked
test(`mock implementation geocodeMulti`, () => {
  let geocodeMulti = jest.fn().mockReturnValue(cityMap);

  expect(geocodeMulti('Paris')).toBe(cityMap);
  expect(geocodeMulti('Barcelona')).toBe(cityMap);
})

