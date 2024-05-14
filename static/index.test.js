({getFormattedPollutionName, 
  getQualitativeValue,
  formatTimeFromUnix,
  geocode
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

/*
test(`geocode(Gothenburg, SE): Expects [57.7072326, 11.9670171 ]`, () => {
  expect(geocode('Gothenburg, SE').toStrictEqual[57.7072326, 11.9670171 ])

})
*/