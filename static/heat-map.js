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

function triggerFilterList() {
    const filterOptions = document.getElementById("filter-options");

    if (!filterListShowing) {
        filterOptions.style.display = "flex";
    } else {
        filterOptions.style.display = "none";
    }

    filterListShowing = !filterListShowing;
}