// Adds the heatmap

let heatMap;
let filterListShowing = false;
var threshold = 0;

const threshold_pm25 = [0, 9, 35.4, 54, 125.4, 225.4, 275.1];
const threshold_pm10 = [0, 54, 154, 254, 354, 424, 504];
const threshold_no2 = [0, 53, 100, 360, 649, 1244, 1644];
const threshold_o3 = [0, 54, 70, 164, 204, 404, 504];
const threshold_so2 = [0, 35, 75, 185, 304, 604, 804];
const threshold_co = [0, 4.4, 9.4, 12.4, 15.4, 30.4, 40.4];

async function fetchAirQualityData() {
    const dataSet = [];
    for (let i = 1; i < 19; i++) {
        if (i == 17) {
            continue;
        } else {
            const url = `/api/get_points?page=${i}`;
            const response = await fetch(url);
            const data = await response.json();
            dataSet.push(...data.results);
        }
    }
    return dataSet;
}

async function addHeatMap(type, threshold, layer=false) {
    const data = await fetchAirQualityData();
    const heatPoints =[];

    data.forEach(item => {
        
        if (item.coordinates && item.measurements) {
            for (const measurement of item.measurements) {
                if (measurement.parameter == type) {
                    if (measurement.value <= threshold) {
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
    
    if (threshold > 0) {
        // If threshold is provided, create monochrome heat map
        heatMap = L.heatLayer(heatPoints, {max: 3, blur: 0, radius: 15, gradient: {
            '0': 'Yellow',
            '1': 'Yellow'
        }}).addTo(map);
    } else {
        // If threshold is 0, create normal heat map with gradient
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


function triggerFilterList() {
    const filterOptions = document.getElementById("filter-options");

    if (!filterListShowing) {
        filterOptions.style.display = "flex";
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
        const thresholdValue = item.getAttribute("value");

        removeHeatMap();
        //addHeatMap("no2", threshold_no2[thresholdValue], true);
        //addHeatMap("pm10", threshold_pm10[thresholdValue], true);
        addHeatMap("pm25", threshold_pm25[thresholdValue], true);
        //addHeatMap("o3", threshold_o3[thresholdValue], true);
        //addHeatMap("co2", threshold_co[thresholdValue], true);
        //addHeatMap("so2", threshold_so2[thresholdValue], true);

        const selectedOptionText = item.querySelector(".option-text").innerText;

        const btnText = document.querySelector(".sBtn-text");
        btnText.innerText = selectedOptionText;
        
        selectBtn.classList.remove("open");
    });
})