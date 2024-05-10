({getFormattedPollutionName, getQualitativeValue} = require('./location-data.js'))

test(`getFormattedPollutionName('banana'): Expects null`, () => {
  expect(getFormattedPollutionName('banana')).toBe(null);
});

test(`getQualitativeValue(1)[0]: Expects Good`, () => {
    expect(getQualitativeValue(1)[0]).toStrictEqual('Good');
  });

test(`getQualitativeValue(55)[0]: Expects Unknown`, () => {
    expect(getQualitativeValue('55')[0]).toStrictEqual('Unknown');
  });