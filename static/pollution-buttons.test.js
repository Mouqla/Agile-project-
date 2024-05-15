const { addButtonsToInfoBox } = require('./pollution-buttons');

describe('addButtonsToInfoBox', () => {
    beforeEach(() => {
      // Set up the DOM environment
      document.body.innerHTML = `
        <div id="infoBox">
          <div class="pollution-detail"></div>
          <div class="pollution-detail"></div>
        </div>
      `;
    });
  
    test('should add "Details" button to each pollution detail', () => {
      addButtonsToInfoBox();
      const buttons = document.querySelectorAll('.details-button');
      expect(buttons.length).toBe(2);
    });
  
    test('should set button text to "Details"', () => {
      addButtonsToInfoBox();
      const buttons = document.querySelectorAll('.details-button');
      buttons.forEach(button => {
        expect(button.innerText).toBe('Details');
      });
    });
  
    test('should add correct class name to the button', () => {
      addButtonsToInfoBox();
      const buttons = document.querySelectorAll('.details-button');
      buttons.forEach(button => {
        expect(button.classList.contains('details-button')).toBe(true);
      });
    });
  
    test('should trigger alert when button is clicked', () => {
      addButtonsToInfoBox();
      const buttons = document.querySelectorAll('.details-button');
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
      buttons.forEach(button => {
        button.click();
        expect(mockAlert).toHaveBeenCalledWith('More details here.');
      });
    });
  });