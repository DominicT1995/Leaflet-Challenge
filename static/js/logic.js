// Set global variables for earthquake and tectonic plates jsons
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let tectonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

function createMap(earthquakes) {

    // Set variables for out tile layers for the leaflet map
    let outdoor = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC'
    });

    let sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    let gray = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    });

    // Set styling parameters for tectonic plate lines
    let mapStyle = {
        color: "yellow",
        weight: 2
    };

    // Define basemaps for our tilelayers for the control
    let baseMaps = {
        "Satellite": sat,
        "Grayscale": gray,
        "Outdoors": outdoor
    };

    // Access the tectonic plates json
    d3.json(tectonicUrl).then(function(data) {

        let plates = L.geoJson(data, {
            style: mapStyle
        });
    
        // Set overlays for the control based on our created layer groups
        let overlayMaps = {
            "Tectonic Plates": plates,
            "Earthquakes": earthquakes
        };

        // Create the leaflet map centered over the U.S. with default loading layers
        let map = L.map("map", {
            center: [37.09, -95.71],
            zoom: 5,
            layers: [gray, earthquakes]
        });

        // Add our layer control with created tilelayers and overlays and add to map
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(map);

        // Define a variable for the map legend with positioning in bottom right
        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function() {
        
            // Create html div tag to house legend and establish density intervals for earthquake depth
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
        
        // Add our legend to the map
        legend.addTo(map);

    });

}

// Define function to handle negative magnitudes and adjust marker sizes for map visualization
function markerSize(magnitude) {
    
    if (magnitude < 0) {
        return 1 / Math.abs(magnitude) * 2.5;
    }
    else {
        return magnitude * 25000;
    }
}

// Define function to assign marker color based on earthquake depth
function chooseColor(depth) {
    if (depth <= 10) return "#a2ec21";
    else if (depth > 10 && depth <=30) return "#e0ec15";
    else if (depth > 30 && depth <=50) return "#ffd760";
    else if (depth > 50 && depth <=70) return "#ffb70b";
    else if (depth > 70 && depth <=90) return "#ff7c00";
    else return "#ff4545";
}

function createMarkers(response) {

    // Define variable for easy access to features
    let earthquakes = response.features;

    // Initialize marker array
    quakeArray = [];

    // Iterate through all earthquakes
    for (let i = 0; i < earthquakes.length; i++) {

        let earthquake = earthquakes[i].properties;

        let coordinates = earthquakes[i].geometry.coordinates;

        // For earch earthquake, set circle marker coordinates, color and size with established functions
        // Bind a popup with the earthquake location, magnitude, and depth to each marker
        let quakeMarker = L.circle([coordinates[1], coordinates[0]], {
            fillOpacity: 0.75,
            color: "black",
            weight: 0.3,
            fillColor: chooseColor(coordinates[2]),
            radius: markerSize(earthquake.mag)
        }).bindPopup("<h3>Location: " + earthquake.place + "<h3><h3>Magnitude: " + earthquake.mag + "<h3><h3>Depth: " + coordinates[2]);

        // Push each individual marker to the initialized array
        quakeArray.push(quakeMarker);
    }

    // Call the createMap function using the marker array
    createMap(L.layerGroup(quakeArray));
}

// Access earthquake json and run the createMarkers function
d3.json(url).then(createMarkers);

