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
            infoBox.innerHTML += 'Air Quality Index: ' + content.airQualityIndex;
            infoBox.innerHTML += '<br>';

            for(let key in content.pollution){
                infoBox.innerHTML += key + ' ';
                infoBox.innerHTML += content.pollution[key];
                infoBox.innerHTML += ' μg/m<sup>3</sup>';
                infoBox.innerHTML += '<br>';
            }

            //Header med stad, koordinater och tid
            var headerBox = newFrame.querySelector('#header');
            headerBox.innerHTML += `<h1>${content.city}</h1>`;
            headerBox.innerHTML += `<h2>${content.location}</h2>`
            headerBox.innerHTML += `<h3>Last updated ${content.time}</h3>`; 

            const closeButton = newFrame.querySelector('.closebtn');
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
    document.getElementById("main").style.marginRight = "-200px";
}