const locationModule = require('./location-frame');
describe('createAndAppendFrame', () => {
  test('should insert the new frame before the first child of the sidebar', async () => {
    // Mock the fetch function to return a resolved promise with a mock HTML response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve('<div id="infoBox"></div>'), // Mock response HTML
      })
    );

    const content = {
      city: "Sample City",
      country: "Sample Country",
      airQualityIndex: [50, "#00ff00"], 
      pollution: {
          PM25: 20, 
          PM10: 30,
          NO2: 10   
      },
      time: "2024-05-15 12:00:00", 
      forecast: [60] 
    };
    
    const location = {
      latitude: 40.7128,
      longitude: -74.0060,
      address: "Sample Address, Sample City, Sample Country",
      timezone: "UTC-5",
      elevation: 10,
      population: 1000000
    };

    document.body.innerHTML = '<div id="offcanvas"><div id="existingChild"></div></div>';
    
    // Spy on the original function
    const spyOnFunction = jest.spyOn(locationModule, 'createAndAppendFrame');

    // Call the function as you normally would
    locationModule.createAndAppendFrame(content, location);

    // Now you can inspect the behavior using spyOnFunction.mock
    console.log(spyOnFunction.mock.calls); // Array of arguments passed to the function
    console.log(spyOnFunction.mock.results); // Results returned by the function
    // Other mock properties you want to inspect
  });
});
