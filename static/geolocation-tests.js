const { onLocationButtonClick } = require('./geolocation');

// Mock Position object
const mockPosition = {
    coords: {
      latitude: 51.5074, // Example latitude value
      longitude: -0.1278, // Example longitude value
    },
  };

// Mocking navigator object
const originalNavigator = { ...navigator }; // Save the original navigator object

// Mock navigator object with geolocation support
const mockNavigatorWithGeolocation = {
  ...originalNavigator,
  geolocation: {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  }
};

// Mock navigator object without geolocation support
const mockNavigatorWithoutGeolocation = {
  ...originalNavigator,
  geolocation: undefined, // Simulate absence of Geolocation API support
};

describe('Test onLocationButtonClick', () => {
     test('Geolocation supported', () => {

      // Replacing navigator with the mock that supports geolocation
      global.navigator = mockNavigatorWithGeolocation;

      // Mocking the position returned by getCurrentPosition
      mockNavigatorWithGeolocation.geolocation.getCurrentPosition.mockImplementationOnce(
        successCallback => successCallback(mockPosition)
      );

      // Calling tested function
      onLocationButtonClick();

      expect(map.setView).toHaveBeenCalledWith([mockPosition.coords.latitude, mockPosition.coords.longitude], 13);
    });
  
    test('Geolocation not supported', () => {

      // Replace navigator with the mock that doesn't support geolocation
      global.navigator = mockNavigatorWithoutGeolocation;

      // Calling tested function
      onLocationButtonClick();

      expect(console.error).toHaveBeenCalledWith('Geolocation is not supported by this browser');
    });
  });
  
  // Restore the original navigator object after tests
  afterAll(() => {
    global.navigator = originalNavigator;
  });