let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function createMap(earthquakes) {

    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    let baseMaps = {
        "Street Map": streetmap,
        "Topographic Map": topo
    };

    let overlayMaps = {
        "Earthquakes": earthquakes
    };

    let map = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function() {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    
    legend.addTo(map);

}

function markerSize(magnitude) {
    return magnitude * 20000;
}

function chooseColor(depth) {
    if (depth <= 10) return "#a2ec21";
    else if (depth > 10 && depth <=30) return "#dddf4d";
    else if (depth > 30 && depth <=50) return "#f8c856";
    else if (depth > 50 && depth <=70) return "#da9d0d";
    else if (depth > 70 && depth <=90) return "#e95252";
    else return "red";
}

function createMarkers(response) {

    let earthquakes = response.features;

    console.log(earthquakes);

    quakeArray = [];

    for (let i = 0; i < earthquakes.length; i++) {

        let earthquake = earthquakes[i].properties;

        let coordinates = earthquakes[i].geometry.coordinates;

        let quakeMarker = L.circle([coordinates[1], coordinates[0]], {
            fillOpacity: 0.50,
            color: "black",
            weight: 0.3,
            fillColor: chooseColor(coordinates[2]),
            radius: markerSize(earthquake.mag)
        }).bindPopup("<h3>Location: " + earthquake.place + "<h3><h3>Magnitude: " + earthquake.mag + "<h3><h3>Depth: " + coordinates[2]);

        quakeArray.push(quakeMarker);
    }

    createMap(L.layerGroup(quakeArray));
}

d3.json(url).then(createMarkers);

