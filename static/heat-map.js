// Adds the heatmap

let heatMap;
let filterListShowing = false;
var threshold = 0;

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

async function addHeatMap(type, threshold) {
    const data = await fetchAirQualityData();
    const heatPoints =[];

    data.forEach(item => {
        if (item.coordinates && item.measurements) {
            for (const measurement of item.measurements) {
                if (measurement.parameter == type) {
                    if (measurement.value > threshold) {
                        heatPoints.push([
                            item.coordinates.latitude,
                            item.coordinates.longitude,
                            measurement.value
                        ]);
                    } else if (threshold == 0) {
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

    removeHeatMap();

        if (threshold > 0) {
            // If threshold is provided, create monochrome heat map
            heatMap = L.heatLayer(heatPoints, {max: 3, blur: 0, radius: 15, gradient: {
                '0': 'Yellow',
                '1': 'Yellow'
            }}).addTo(map);
        } else {
            // If threshold is not provided, create normal heat map with gradient
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

const selectBtn = document.querySelector(".select-menu"),
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
        threshold = parseFloat(thresholdValue);

        const selectedOptionText = item.querySelector(".option-text").innerText;

        const btnText = document.querySelector(".sBtn-text");
        btnText.innerText = selectedOptionText;
        
        selectBtn.classList.remove("open");
    });
})