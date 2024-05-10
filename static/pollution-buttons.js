function addButtonsToInfoBox() {
    // Assuming each pollution detail is wrapped in a div or span inside infoBox
    const pollutionDetails = document.querySelectorAll('#infoBox .pollution-detail');
    pollutionDetails.forEach(detail => {
        // Check if the button is already there to avoid duplicates
        if (!detail.querySelector('.details-button')) {
            const button = document.createElement('button');
            button.innerText = 'Details';
            button.className = 'details-button';
            button.onclick = () => alert('More details here.');
            detail.appendChild(button);
        }
    });
}