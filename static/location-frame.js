// Handles information frame of pop-up location

let frameList = [];
let compareMode = false;

/* Skapar en ny "frame" (info-frame.html) i html, lägger info i infoBox rutan och appendar till sidebar*/
function createAndAppendFrame(content) {
    fetch('info-frame.html')
        .then(response => response.text())
        .then(html => {
            const newFrame = document.createElement('div');
            newFrame.classList.add('frame');
            newFrame.id = 'frame-' + Date.now(); 

            newFrame.innerHTML = html;

            const infoBox = newFrame.querySelector('#infoBox');

            const sidebar = document.getElementById('offcanvas');
            sidebar.appendChild(newFrame);

            //Lägger till mätvärden för luftföroreningar i sidebar 
            infoBox.innerHTML += `<div id="AQI-box">Today's Air Quality Index: ${content.airQualityIndex}</div>`;

            for(let key in content.pollution){
                infoBox.innerHTML += `
                <div id="pollution-components">
                    <span id="pollution-key">${key}</span>
                    <span id="pollution-value">${content.pollution[key]} μg/m<sup>3</sup></span>
                </div>`
            }

            infoBox.innerHTML += `<div id="forecast">Tomorrow's Air Quality Index Forecast is ${content.forecast}</div>`;

            //Header med stad, koordinater och tid
            var headerBox = newFrame.querySelector('#detailed-view-header');
            headerBox.innerHTML += `
            <h1 id="info-box-header-city-country">${content.city}, ${content.country}</h1>
            <!--<h2 id="info-box-header-location">${content.location}</h2>-->
            <p id="info-box-header-time">Last updated ${content.time}</p>
            `

            const closeButton = newFrame.querySelector('.detailed-view-close-button');
            closeButton.addEventListener('click', function() {
                    closeFrame(newFrame.id);
                });

            const compareButton = document.getElementById("compareSwitch");
            compareButton.addEventListener("change", toggleCompare);
            
            frameList.push(newFrame.id)
        })
}


/* Stänger tidigare frame inför skapandet av nästa frame, om Compare Mode inte är aktiverat */
function prepareNextFrame(compareMode) {
    if (!compareMode) {
        if (frameList.length > 0) {
            for (var i = 0; i < frameList.length; i++) {
                closeFrame(frameList[i]);
            }
            frameList = [];
        }
        return;
    }
}

function closeFrame(frameId) {
    const frame = document.getElementById(frameId);
    if (frame) {
        frame.remove();
    }
    removeMarker();
}

function toggleCompare() {
    compareMode = !compareMode;
}

/* Öppnar sidebaren (initialt utanför skärmen) */ /* TODO */
function openNav() {
    document.getElementById("offcanvas").style.width = "380";
    document.getElementById("offcanvas").style.position = "absolute";
    document.getElementById("offcanvas").style.right = "10px";
    document.getElementById("main").style.marginRight = "-200px";
}