function addButtonsToInfoBox() {
    const pollutionDetails = document.querySelectorAll('#infoBox .pollution-detail');
    pollutionDetails.forEach(detail => {
        if (!detail.querySelector('.details-button')) {
            const button = document.createElement('button');
            button.innerText = 'Details';
            button.className = 'details-button';
            button.onclick = () => alert('More details here.');
            detail.appendChild(button);
        }
    });
}