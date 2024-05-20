// Adds the heatmap

let heatMap;
let filterListShowing = false;
var thresholdValue = 0;
let currentType;

const threshold_pm25 = [0, 9, 35.4, 54, 125.4, 225.4, 275.1];
const threshold_pm10 = [0, 54, 154, 254, 354, 424, 504];
const threshold_no2 = [0, 53, 100, 360, 649, 1244, 1644];
const threshold_o3 = [0, 54, 70, 164, 204, 404, 504];
const threshold_so2 = [0, 35, 75, 185, 304, 604, 804];
const threshold_co = [0, 4.4, 9.4, 12.4, 15.4, 30.4, 40.4];

async function fetchAirQualityData() {
    try{
        const url = '/api/return_points';
        const response = await fetch(url);
        const data = await response.json();
        return data
    }catch (error) {
        console.error('Failed to fetch air quality data', error);
        return [];
    }
}

async function addHeatMap() {
    resetButtons();
    console.log(currentType)
    typeArray = getCurrentThreshold();
    thresholdHigh = typeArray[thresholdValue];
    thresholdLow = typeArray[thresholdValue-1];

    displayDisableHeatmapButton();

    const data = await fetchAirQualityData();
    const heatPoints =[];

    data.forEach(item => {
        if (item.coordinates && item.measurements) {
            for (const measurement of item.measurements) {
                if (measurement.parameter == currentType) {
                    if (measurement.value <= thresholdHigh && measurement.value >= thresholdLow || thresholdValue == 0) {
                        heatPoints.push([
                            item.coordinates.latitude,
                            item.coordinates.longitude,
                            measurement.value
                        ]);
                        
                    }
                }
            }
        }
    });

    //if (!layer) {
        removeHeatMap();
    //}
    switch (thresholdValue) {
        case "0":
            heatMap = L.heatLayer(heatPoints, {max: 4, blur: 0, radius: 15, gradient: {
                '0': 'Navy',
                '0.25': 'Navy',
                '0.26': 'Green',
                '0.5': 'Green',
                '0.51': 'Yellow',
                '0.75': 'Yellow',
                '0.76': 'Red',
                '1': 'Red'
            }}).addTo(map);
            break;
        case "1":
                // If threshold is 0, create normal heat map with gradient
            heatMap = L.heatLayer(heatPoints, {max: 3, blur: 0, radius: 15, gradient: {
                '0': 'Green',
                '1': 'Green'
            }}).addTo(map);
            break;
        case "2":
            heatMap = L.heatLayer(heatPoints, {max: 3, blur: 0, radius: 15, gradient: {
                '0': 'GreenYellow',
                '1': 'GreenYellow'
            }}).addTo(map);
            break;
        case "3":
            heatMap = L.heatLayer(heatPoints, {max: 3, blur: 0, radius: 15, gradient: {
                '0': 'Yellow',
                '1': 'Yellow'
            }}).addTo(map);
            break;
        case "4":
            heatMap = L.heatLayer(heatPoints, {max: 3, blur: 0, radius: 15, gradient: {
                '0': 'Orange',
                '1': 'Orange'
            }}).addTo(map);
            break;
        case "5":
            heatMap = L.heatLayer(heatPoints, {max: 3, blur: 0, radius: 15, gradient: {
                '0': 'Red',
                '1': 'Red'
            }}).addTo(map);
            break;
        case "6":
            heatMap = L.heatLayer(heatPoints, {max: 3, blur: 0, radius: 15, gradient: {
                '0': 'Black',
                '1': 'Black'
            }}).addTo(map);
            break;
        default:
            heatMap = L.heatLayer(heatPoints, {max: 3, blur: 0, radius: 15, gradient: {
                '0': 'Navy',
                '0.25': 'Navy',
                '0.26': 'Green',
                '0.5': 'Green',
                '0.51': 'Yellow',
                '0.75': 'Yellow',
                '0.76': 'Red',
                '1': 'Red'
            }}).addTo(map);
    }
}

function removeHeatMap() {
    if (heatMap) {
        map.removeLayer(heatMap);
    }
}


function removeHeatMapAndResetButtons() {
    removeHeatMap();
    resetButtons();
    hideDisableHeatmapButton();
    }

function addFilter(type) {
    currentType = type;
    switch (type) {
        case 'pm25':
            document.getElementById('button-pm25').style.backgroundColor = 'var(--secondary)';
        case 'pm10':
            document.getElementById('button-pm10').style.backgroundColor = 'var(--secondary)';
        case 'no2':
            document.getElementById('button-no2').style.backgroundColor = 'var(--secondary)';
        }
    addHeatMap()
    }

function resetButtons() {
    document.getElementById('button-pm25').style.backgroundColor = 'var(--background)';
    document.getElementById('button-pm10').style.backgroundColor = 'var(--background)';
    document.getElementById('button-no2').style.backgroundColor = 'var(--background)';
}

function displayDisableHeatmapButton(){
    const filterOptionDisableHeatmap = document.getElementById("button-remove-heatmap");
    filterOptionDisableHeatmap.style.display = "block";
}

function hideDisableHeatmapButton() {
    const filterOptionDisableHeatmap = document.getElementById("button-remove-heatmap");
    filterOptionDisableHeatmap.style.display = "none";
}

function triggerFilterList() {
    const filterButton = document.querySelector(".filter-button"); // Hitta knappen för klassen "filter-button"
    const filterOptions = document.getElementById("filter-options");

    if (!filterListShowing) {
        filterOptions.style.display = "flex";
        hideDisableHeatmapButton();

    } else {
        filterOptions.style.display = "none";
        
    }

    filterListShowing = !filterListShowing;
}

const selectBtn = document.querySelector(".select-menu");
items = document.querySelectorAll(".option");

selectBtn.addEventListener("click", () => {
    selectBtn.classList.toggle("active");
});

items.forEach(item => {
    item.addEventListener("click", () => {
        document.querySelectorAll(".option.checked").forEach(item => {
            item.classList.remove("checked");
        });

        item.classList.add("checked");
        thresholdValue = item.getAttribute("value");

        addHeatMap();

        const selectedOptionText = item.querySelector(".option-text").innerText;

        const btnText = document.querySelector(".sBtn-text");
        btnText.innerText = selectedOptionText;
        
        selectBtn.classList.remove("open");
    });
})

function getCurrentThreshold() {
    switch(currentType) {
        case "pm25":
            return threshold_pm25;
        case "pm10":
            return threshold_pm10;
        case "no2":
            return threshold_no2;
    }
}