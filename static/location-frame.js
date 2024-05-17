// Handles information frame of pop-up location
const { getFormattedPollutionName } = require('./location-data');
let frameList = [];
let compareMode = false;
const frameLocationMap = {};
/* Skapar en ny "frame" (info-frame.html) i html, lägger info i infoBox rutan och appendar till sidebar*/
function createAndAppendFrame(content, location) {
    return new Promise((resolve, reject) => {
        fetch('info-frame.html')
            .then(response => response.text())
            .then(html => {
                const newFrame = document.createElement('div');
                newFrame.classList.add('frame');
                newFrame.id = 'frame-' + Date.now();

                newFrame.innerHTML = html;

                const infoBox = newFrame.querySelector('#infoBox');

                const sidebar = document.getElementById('offcanvas');

                // place new frame at the top of the page
                const oldChild = sidebar.firstElementChild;
                sidebar.insertBefore(newFrame, oldChild);

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
                        <div id="test-cont">
                            <div id="pollution-components">
                                <span id="pollution-key">${getFormattedPollutionName(key)}</span>
                            </div>
                            <div id="pollution-measurements">
                                <span id="pollution-value">${content.pollution[key]}</span> <span id="pollution-unit">&nbsp μg/m<sup>3</sup> &nbsp </span>
                                <button class="details-button" id="${key}" onClick="createAndAppendDetailFrame('${key}', '${content.pollution[key]}', '${content}')">?</button>
                            </div>
                        </div>
                    `
                }

                infoBox.innerHTML += `<div id="forecast">Tomorrow's Air Quality Index Forecast: ${content.forecast[0]}</div>`;

                var headerBox = newFrame.querySelector('#detailed-view-header');
                headerBox.innerHTML += `
                    <h1 id="info-box-header-city-country">${content.city}, ${content.country}</h1>
                    <!--<h2 id="info-box-header-location">${content.location}</h2>-->
                    <p id="info-box-header-time">Last updated ${content.time}</p>`;

                //addButtonsToInfoBox(content);
                //addInfoButton(content);

                const closeButton = newFrame.querySelector('.detailed-view-close-button');
                closeButton.addEventListener('click', function () {
                    closeFrame(newFrame.id);
                });

                const compareButton = document.getElementById("compareSwitch");
                compareButton.addEventListener("change", toggleCompare);

                frameList.push(newFrame.id)

                frameLocationMap[newFrame.id] = location;

                // Once all operations are complete, resolve the Promise with the new frame
                resolve(newFrame);
            })
            .catch(error => {
                // If there's an error during the fetch or subsequent operations, reject the Promise
                reject(error);
            });
    });
}


function clickPollutionInfo(key, value, content){
    console.log(key, value, content)
}

/* Skapar en ny frame för en enskild typ av luftförorening */
function createAndAppendDetailFrame(pollutant, value, content) {
    return new Promise((resolve, reject) => {
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

            const formattedPollutantName = getFormattedPollutionName(pollutant);
            // Get specific information based on pollutant type
            let detailsText = getPollutantDetails(formattedPollutantName, value);

            infoBox.innerHTML += `
            <div class="pollution-details">
                <p>${formattedPollutantName} concentration is ${value} μg/m<sup>3</sup>.</p>
                ${detailsText}
            </div>`;

            var headerBox = newFrame.querySelector('#detailed-view-header');
            headerBox.innerHTML += `<h2>Information about ${formattedPollutantName}</h2>`;

            const closeButton = newFrame.querySelector('.detailed-view-close-button');
            closeButton.addEventListener('click', function () {
                closeFrame(newFrame.id);
            });

            const compareButton = document.getElementById("compareSwitch");
            compareButton.addEventListener("change", toggleCompare);

            frameList.push(newFrame.id);
        })
        .catch(error => {
            // If there's an error during the fetch or subsequent operations, reject the Promise
            reject(error);
        });
    });
}

/* Get pollutant details based on the type */
function getPollutantDetails(pollutant, value) {
    let detailsText = '';

    switch (pollutant) {
        case 'PM2.5':
            detailsText = `
            <ul>
                <li>Description:<br>
                PM2.5 is a particulate matter, with diameters of 2.5 micrometers or less. PM2.5 is a very complex particle because it can be made up of many different things, they may also be entirely or partly liquid - aerosol. Sources of natural aerosol include dust, sea salt, volcanic ash. Man-made sources include factory and vehicle emissions, coal combustion and biomass burning. Due to its differnet variations and components, its almost impossible to know exactly whats contained in a particle in polluted areas.
                </li>
                <br>
                <li>
                Risks:<br>
                PM2.5 is much smaller than PM10, and has the capabilities of entering the human bloodstream and deep into the lungs, and it is much harder to remove from the body - for example, coughing or sneezing may rid of PM10, but won't rid any PM2.5. Constant exposure may reduce life expectancy by several months up to a few years, and may cause many cardiovascular diseases along the way.
                </li>
                <br>
                <li>
                Prevention and risk reduction:<br>
                There are many ways one can prevent the inhaling of PM2.5. In heavily polluted areas, face masks (PM2.5 masks) are designed to filter out particulate matter. Keep physical exercise indoors as high exertion increases breathing rate, which increases the exposure of the pollution. Smoking is also a big source of PM2.5, both to the smoker and their immediate surroundings, quiting smoking is a big step towards less polluted lungs.
                </li>
            </ul>`;
            break;

        case 'PM10':
            detailsText = `
            <ul>
                <li>Description:<br>
                PM10 is a type of particulate matter, with diameters of 10 micrometers or less. This includes PM2.5. The matter can be made up of several different components, such as nitrates, sulfates, organic chemicals, metals, soil, and dust particles. These particles mainly derive from the heavy wear of tough equipment such as motor vehicles, wood burning heaters and worn out car wheels. Particulate matter is considered the worst urban air pollution in terms of health effects.
                </li>
                <br>
                <li>Risks:<br>
                Despite being much larger than PM2.5, these particles are still small enough to pass through the nose and throat, and enter the lungs. In the short term, these particles may then cause irritated nose, throat, and eyes, worsen lung diseases in people already diagnosed, cause heart attacks and irregular heart beat, and cause premature death due to respiratory and cardiovascular diseases. Long term exposure could significantly decrease lung function, cause lung cancer, and nearly halt the lung development in small children.
                </li>
                <br>
                <li>Prevention and risk reduction:<br>
                In many countries, the biggest contributor to PM10 is factories such as paper and pulp industries. But stricter laws have forced the industry to lower their emissions since the millennial shift. There is still an abundance of particulate matter in many parts of the world, but there are ways to reduce PM even in heavily polluted areas - such as using cleaner fuels in car, driving with proper wheels, and avoiding wood burning.
            </ul>`;
            break;

        case 'CO':
            detailsText = `
            <ul>
                <li>Description:<br>
                Carbon monoxide (CO) is an odorless and colorless gas, released from a variety of combustions in our everyday lives, as well as from industrial energy production. Sources of carbon monoxide in urban areas consists of fossil fueled (carbon-based) vehicles, chimneys, furnaces, working machinery, gas heaters, and anywhere else where a fuel is burned. Big proportions of carbon monoxide can also be found in paper and metal related industrial zones, where the chemical is used as a reducing agent.
                </li>
                <br>

                <li>Risks:<br>
                Carbon monoxide is easily absorbed by the body when inhaling, and breathing high concentrations will bind the particles to the haemoglobin of the blood. Constant exposure can lead to dizziness, nausea, headache, fatigue, vomitting, and death. Although these symptoms often occur indoors, a slow but persistent exposure outdoors may lead to worsened oxygen uptake in the body. People with breathing problems and/or heart diseases are especially vulnerable to carbon monoxide poisoning.
                </li>
                <br>
                <li>Prevention and risk reduction:<br>
                Burning less fuel in our everyday lives will decrease the amount of carbon monoxide in the air. This includes choosing public transport or walks over personal cars, keeping open fires or other gases out in the open air, and making sure cars have efficient catalytic converters (Car models older than 30 years usually left this aspect out entirely) - which has been the new standard for modern vehicle manufacturers.
            </ul>`;
            break;

        case 'NO₂':
            detailsText = `
            <ul>
                <li>Description:<br>
                Nitrogen dioxide (NO2) is a reddish-brown gas with a strong pungent scent. NO2 is the second pollution in the pair collection of NOx, being the oxidized version of nitric oxide. Just like NO, Nitrogen dioxide is formed right after burned fossil fuels such as diesel, coal, and methane gas, where it is combined with nitric oxide. NO2 is also an important precursos to ozone pollution.
                </li>
                <br>
                <li>Risks:<br>
                There are major risks with inhaling nitrogen dioxide. The gas can cause inflammation in airways, reduce the lung function, and exposure to young children is likely to cause asthma. Studies have also shown the gas is associated with premature death, decreased lung growth, and intensified allergic attacks. Infants and children are most at risk - their bodyweight to breathing rate ratio will cause a disproportionately higher exposure to the pollution compared to adults. NO2 can also form particulate matter and ozone, as well as cause acid rain - which can negatively impact entire ecosystems.
                </li>
                <br>
                <li>Prevention and risk reduction:<br>
                Several international legislations and acts have caused the pollution to decline rapidly since the late 80's. As the bigger source of NOx is derived from urban traffic, a major step in reduction was the use of the selective catalytic reduction, a method used in cars, trucks, big ships and trains to effectively reduce the emission by 70-80%. Since the European legislation of Euro 6, several manufacturers of vehicles have adopted this method as the new standard. As an individual, closing windows facing heavy traffic streets will reduce the risks.
            </ul>`;
            break;

        case 'SO₂':
            detailsText = `
            <ul>
                <li>Description:<br>
                Sulfur dioxide (SO2) is a colorless gas derived from the combustion of fossil fuels and other sulfur-filled substances. Sulfur dioxide's biggest source is oil and coal combustion, such as power plants, manufacturing, petroleum refining, and metal processing - coal-fired power plants being the biggest culprit. Sulfur dioxide has a tendency to travel long distances in the air before settling down on the ground.
                </li>
                <br>
                <li>Risks:<br>
                There are several health risks when inhaling sulfur dioxide, the most prominent and immediate symptom is coughing, wheezing, and shortness of breath. Long term exposure may lead to reduced lung function, and can make it very hard for people with asthma to breathe. The precipitation of Sulfur dioxide may also lead to undrinkable and dangerous water sources in the environment.
                </li>
                <br>
                <li>Prevention and risk reduction:<br>
                As the biggest sources of Sulfur dioxide hail from factories and power plants, there is little an individual person can do to reduce the emission of sulfur dioxide. There have been several laws and policies regarding SO2 sources, such as every coal plant in the EU being dismantled by 2030.
            </ul>`;
            break;

        case 'O₃':
            detailsText = `
            <ul>
                <li>Description:<br>
                O3 is a ground-level type ozone smog formed from pollutions such as the NOx combined with sunlight. Ozone in higher altitude shields us from radiation, but the ground-level triple oxygen type ozone can bring serious health problems when inhaled. Because of the important ingredient of NOx (and methane), the source of O3 is considered the same as the source of NOx - fossil fuel combustion in cars, factories, and other emission rich engines. O3 can be very potent in urban areas, and even more so on sunny days.
                </li>
                <br>
                <li>Risks:<br>
                Ozone aggressively attacks lung tissue when inhaled, even short term exposure can lead to remarkable decrease in airway performance. In sunny days, ozone could cause immediate problems to exposed persons, such as shortness of breath, coughing, asthma attacks, respiratory infections, increased risk of pulmonary infections, and people with respiratory problems have a much higher chance of needing immediate medical treatment. Long term exposure, such as whole sunny days, can lead to metabolic disorders, nervous system issues, reproductive issues, cardiovascular mortality, and respiratory illnesses.
                </li>
                <br>
                <li>Prevention and risk reduction:<br>
                The main international prevention goal of O3 is reducing the methane emission, a big precursor of O3. The Climate and Clean Air Coalition suggests over 40% of emissions will be reduced by 2030 if control is implemented properly. Several projects around the world have been set to reduce the pollution, such as emission inspection programmes in vehicles. To reduce risk of respiratory problems, one can stay indoors during hot days in heavily polluted urban areas. Travelling eco-friendly will also reduce the amount of urban smog, like choosing walks or public transport over cars, not idling the engine in traffic, and using cruise control in highways.
            </ul>`;
            break;

        case 'NH₃':
            detailsText = `
            <ul>
                <li>Description:<br>
                Ammonia (NH3) is a colorless gas, with a strong, itching and irritating sweat-like scent. The vast majority of this pollution is derived from fertilizers in the farming industry, a tiny proportion comes from urban areas such as waste management facilities and vehicles. Due to its properties, the gas in the air is usually washed down to the ground with precipitation within a few days - turning the gas into ammonium salts and nitrogen.
                </li>
                <br>
                <li>Risks:<br>
                Ammonia poses a lot of health risks to humans, as well as in ecosystems. Recent studies indicate an increased risk of asthma in young children when exposed to ammonia. The gas is also culpable to the fine particulate matter (PM2.5), being the contributing factor for 50% of all matter in Europe. People exposed to this fine particulate matter are subject to long term illnesses and lung problems, as well as cancer.
                </li>
                <br>
                <li>Prevention and risk reduction:<br>
                Important management practices for livestock play a big role in ammonia levels. The international Gothenburg Protocol was created to abate air pollutions such as ammonia, and consists of guidances and documents of preventing ammonia from agricultural sources. Although many countries have successfully reduced the emissions, new revisions are in talk to avoid further long-term damage.
            </ul>`;
            break;

        case 'NO':
            detailsText = `
            <ul>
                <li>Description:<br>
                Nitric oxide (NO) is a colorless gas, derived from high temperature combustion. Nitric oxide itself is an essential component in the human body. It's involevement in the human functions include blood vessel dilation, hormone releases, and regulation of neurotransmission. When formed from combustion, nitric oxide will oxidise in the air and form nitric dioxide, a very harmful and poisonous gas. The biggest sources of outdoors NO is urban vehicle traffic, but can also be derived from forest fires and lightning strikes.
                </li>
                <br>
                <li>Risks:<br>
                Low, regulated, and healthy volumes of pure nitric oxide may be benefitial for humans, but over-exposure (eg from car pollution) may inpose risks of respiratory problems, metabolic disorders, hematologic side effects, and vomitting. The biggest risk of ambient NO by itself is the oxidation to form nitric dioxide (NO2). Higher concentrations of NO will contribute to the uprise of NOx (Nitrogen oxides), a collective term of oxides that pollute the air.
                </li>
                <br>
                <li>Prevention and risk reduction:<br>
                Just as many other gases derived from the combustion of fuel, the biggest reduction is to travel less using fossil fueled vehicles. International limits are also set to reduce the emission of bigger industrial sites. As the technology of air pollution control equipment becomes more accessible and cheap, more and more industrial sites have adapted to reduce their emissions of nitric oxide.
            </ul>`;
            break;


        default:
            detailsText = `
            <ul>
                <li>Information not available</li>
            </ul>`;
            break;
    }

    return detailsText;
}

/* Stänger tidigare frame inför skapandet av nästa frame, om Compare Mode inte är aktiverat */
function prepareNextFrame(compareMode) {
    if (!compareMode) {
        // Close all existing frames if not in compare mode
        while (frameList.length > 0) {
            const frameId = frameList.pop();
            closeFrame(frameId); // This removes the frame and marker
        }
    }
}

function closeFrame(frameId) {
    const frame = document.getElementById(frameId);
    if (frame) {
        frame.remove();
    }

    // Find and remove the corresponding Location object
    const location = frameLocationMap[frameId];
    if (location) {
        location.close(); // Call the method to remove the marker
        delete frameLocationMap[frameId]; // Remove the mapping
    }

    // Also remove the frame ID from frameList
    const index = frameList.indexOf(frameId);
    if (index > -1) {
        frameList.splice(index, 1);
    }
}

function toggleCompare() {
    compareMode = !compareMode;

    if (!compareMode) {
        prepareNextFrame(compareMode); // Clear existing frames when exiting compare mode
    }
}

function openNav() {
    document.getElementById("offcanvas").style.width = "380";
    document.getElementById("offcanvas").style.position = "absolute";
    document.getElementById("offcanvas").style.right = "10px";
    document.getElementById("main").style.marginRight = "-200px";
}

module.exports = { createAndAppendFrame, clickPollutionInfo, createAndAppendDetailFrame,getPollutantDetails,prepareNextFrame,
    closeFrame,  toggleCompare, openNav, frameList, compareMode, frameLocationMap};