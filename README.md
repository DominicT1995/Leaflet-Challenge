# Leaflet-Challenge
UTSA Data Analytics Bootcamp challenge utilizing Leaflet.js in order to create an interactive visualization to display real-time earthquake data.

------------------------------------------------------------------------------------------------------------------
INDEX.HTML

The index.html file serves to build the initial skeleton of the webpage and primarily references the static/js/logic.js and static/css/style.css file paths in the script tags in order to populate the html with the styled leaflet map visualization.

STATIC

Within the Leaflet-Challenge repository there is the static folder that contains the js folder which holds the logic.js file. The logic.js file is responsible for running the script that populates the index.html page with the interactive leaflet map based on earthquake and tectonic plate data.

The map will load, by defualt, on the Grayscale tile layer with the Earthquakes overlay visible and zoomed in to view the U.S. In the top right corner, the control can be used to switch between satellite, outdoor, and grayscale tile layers. The control can also be used to turn the Tectonic Plates and Earthquakes overlays either on or off. The Tectonic Plates overlay will display yellow lines on the map that designate fault lines of the tectonic plates present under the earths crust. If Tectonic Plates and Earthquakes overlays are on together, it can be seen that these lines are a hotspot for earthquake activity. The Earthquakes overlay will show circular markers for all earthquakes recorded in the past week. Marker size correlates with magnitude and color correlates with the depth of the earthquake, with greener markers being more shallow and more red markers being deeper. The legend in the bottom right corner can be used to aid in visually determining depth based on color of the marker. Markers can also be clicked on to bring up a popup which will show the location, the magnitude, and the depth of the selected earthquake.