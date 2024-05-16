const locationModule = require('./location-frame');

describe('createAndAppendFrame', () => {
  let container; // Container element to insert the new frame

  beforeEach(() => {
    // Create container element
    container = document.createElement('div');
    container.id = 'offcanvas';
    container.classList.add('sidenav');

    // Append container to body
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Remove container from body after each test
    document.body.removeChild(container);
  });
  const content = {
    airQualityIndex: ['Fair', '#CDDC39'],
    city: "Gothenburg",
    country: "SE",
    forecast: ['Fair', '#CDDC39'],
    location: "57.6948,11.9751",
    pollution: {co:210.29,nh3:1.31,no:1.27,no2:4.46,o3:82.97,pm2_5:3.54,pm10:4.32,so2:5.54},
    state: undefined,
    time: "2024-05-16 11:50:31"
  };
  
  const location = {
    lat:57.69479087592874,
    long:11.975097656250002,
  };

  test('should insert the new frame before the first child of the sidebar', async () => {
    // Mock the fetch function to return a resolved promise with a mock HTML response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve('<div id="detailed-view-header"><button class="detailed-view-close-button"></button></div><div id="infoBox"></div><input type="checkbox" id="compareSwitch">'), // Mock response HTML
      })
    );

    await locationModule.createAndAppendFrame(content, location);
    // Check if the compareButton element exists
    const compareSwitch = document.getElementById('compareSwitch');
    expect(compareSwitch).not.toBeNull(); // Ensure compareButton is not null
  
    // Check if the event listener is added to the compareButton
    const toggleCompare = jest.fn(); 
    compareSwitch.addEventListener('change', toggleCompare);
    const changeEvent = new Event('change');
    compareSwitch.dispatchEvent(changeEvent); // Ensure no errors are thrown

  });
});
