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
            infoBox.innerHTML += `
            <div id="AQI-box"> 
                <div id="AQI-circle"></div>
                <span id="AQI-text">&nbsp Today's Air Quality Index: ${content.airQualityIndex[0]}</span>
            </div>`;

            document.getElementById("AQI-circle").style.background = content.airQualityIndex[1];

            infoBox.innerHTML += `<div id="pollution-components-container"></div>`;
            const pollutionCompsCont = document.getElementById("pollution-components-container");
            for(let key in content.pollution){
                pollutionCompsCont.innerHTML += `
                <div id="pollution-components">
                    <span id="pollution-key">${getFormattedPollutionName(key)}</span>
                    <div>
                        <span id="pollution-value">${content.pollution[key]}</span> <span id="pollution-unit">μg/m<sup>3</sup></span>
                    </div>
                </div>`
            }

            infoBox.innerHTML += `<div id="forecast">Tomorrow's Air Quality Index Forecast: ${content.forecast[0]}</div>`;

            //Header med stad, koordinater och tid
            var headerBox = newFrame.querySelector('#detailed-view-header');
            headerBox.innerHTML += `
            <h1 id="info-box-header-city-country">${content.city}, ${content.country}</h1>
            <!--<h2 id="info-box-header-location">${content.location}</h2>-->
            <span id="info-box-header-time">Last updated ${content.time}</span>
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