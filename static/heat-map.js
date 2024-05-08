// Adds the heatmap

let heatMap;
let filterListShowing = false;

async function fetchAirQualityData() {
    const dataSet = [];
    for (let i = 1; i< 19; i++){
        if (i == 17){
            continue
        }else{
            const url = `/api/get_points?page=${i}`;
            const response = await fetch(url);
            const data = await response.json();
            dataSet.push(...data.results);
        }
    }
    return dataSet;
}

async function addHeatMap(type){
    resetButtons();

    setActiveButtonColor(type);

    displayDisableHeatmapButton();

    const data = await fetchAirQualityData();
    const heatPoints =[];

    data.forEach(item => {
        if (item.coordinates && item.measurements) {
            for (const measurement of item.measurements) {
                if (measurement.parameter == type){
                    heatPoints.push([
                        item.coordinates.latitude,
                        item.coordinates.longitude,
                        measurement.value
                    ]);
                }
            }
        }
    });

    removeHeatMap();

    heatMap = L.heatLayer(heatPoints, {max:3, blur:0, radius: 15, gradient: {
        '0': 'Navy', '0.25': 'Navy',
        '0.26': 'Green',
        '0.5': 'Green',
        '0.51': 'Yellow',
        '0.75': 'Yellow',
        '0.76': 'Red',
        '1': 'Red'
      },}).addTo(map);
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

function setActiveButtonColor(type) {
    switch (type) {
        case 'pm25':
            document.getElementById('button-pm25').style.backgroundColor = '#B3E5FC';
            return;
        case 'pm10':
            document.getElementById('button-pm10').style.backgroundColor = '#B3E5FC';
            return;
        case 'no2':
            document.getElementById('button-no2').style.backgroundColor = '#B3E5FC';
            return;
        }
    }

function resetButtons() {
    document.getElementById('button-pm25').style.backgroundColor = '#ffffff';
    document.getElementById('button-pm10').style.backgroundColor = '#ffffff';
    document.getElementById('button-no2').style.backgroundColor = '#ffffff';
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
    const filterOptions = document.getElementById("filter-options");

    if (!filterListShowing) {
        filterOptions.style.display = "flex";
        hideDisableHeatmapButton();
    } else {
        filterOptions.style.display = "none";
    }

    filterListShowing = !filterListShowing;
}