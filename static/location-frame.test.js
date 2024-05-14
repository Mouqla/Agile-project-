const {createAndAppendFrame} = require('./location-frame.js')
  
  test(`WHat do i want to test`, () => {
    expect(createAndAppendFrame('banana')).toBe(null);
  });