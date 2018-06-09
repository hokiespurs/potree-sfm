# potree-sfm
<img src="img/mainheader.gif" width="100%" href="http://research.engr.oregonstate.edu/lidar/pointcloud/divicarina/">

[view demo](http://research.engr.oregonstate.edu/lidar/pointcloud/divicarina/)

This project demonstrates a method for visualizing SfM derived pointcloud and image data in a web browser. Small details, which were not resolved by the SfM pointcloud, can still be visualized using the images.

## Features
- [Leaflet](https://leafletjs.com/) map with:
  - a 5cm orthophoto overlaid on a [CartoDB](https://carto.com/location-data-services/basemaps/) basemap
  - a draggable marker representing the current view position
  - Orange (current view) and Cyan (image) polygons representing the estimated camera footprint (at minimum Z elevation)
  - a resizeable `<div>` container
- [Bootstrap](https://getbootstrap.com/) toolbar with options to:
  - change to "look through" the previous camera
  - toggle image visibility
  - change to "look through" the next camera
  - toggle map visibility
  - Measurement Tools
  - Change the pointcloud appearance
  - Download Data
  - Toggle Information Modal
  - Toggle Help Modal with [Bootstrap Carousel](https://getbootstrap.com/docs/4.0/components/carousel/) of "howto" images
- Main, 3D viewer
  - 3D pointcloud generated via Structure from Motion processing with [Agisoft Photoscan](http://www.agisoft.com/)
  - Pointcloud visualization and coloring powered by [potree]()
  - 3D "Image pyramids" depicting camera positions powered by [three.js]()
  
## Dependencies
This project was made possible by leveraging the contributions of many open-source code available from:
- [potree](http://potree.org/)
- [three.js](https://threejs.org/)
- [bootstrap 4.1.0](https://getbootstrap.com/)
- etc

## Project Acknowledgements
This project was completed as a final project for "Geovisual Analytics ([GEOG 572](https://github.com/jakobzhao/geog4572))", taught at Oregon State University by Bo Zhao.  

## Data Acknowledgements
These data were collected as part of a 2017 Hurricane Irma and Maria Disaster
Reconnaissance Survey in the US Virgin Islands.  Funding was provided by the 
National Science Foundation through awards CMMI-1761461, CMMI-1661315.  Any 
opinions, findings, and conclusions or recommendations expressed in this 
material are those of the author(s) and do not necessarily reflect the views of
the National Science Foundation

## Metadata
```
-----------------------------
   Divi Carina Bay                     
-----------------------------
Date                         : 13/14 Nov, 2017
Local Time                   : 0835-0932     + 1455-1505
UTC Time                     : 1235-1332 UTC + 1855-1905 UTC
Location                     : "Divi Carina Bay", St Croix, USVI, USA
Latitude                     : 17°44'32.91"N
Longitude                    : 64°36'17.97"W
                             
UAS Platform                 : DJI Mavic Pro with Polarizing Lens Filter

-----------------------------
   MAPPING DATUM/ACCURACY 
-----------------------------
Horizontal Datum             : NAD83 UTM 20N
Absolute Horizontal Accuracy : *Unknown
Vertical Datum               : "Above Sea Level" from DJI Mavic GPS in exif data
Absolute Vertical Accuracy   : *Unknown
QAQC                         : Minimal 

*Note: The horizontal and vertical accuracies are estimated based on intuition.
Data was coregistered to a 2012 aerial lidar dataset using photo-identifiable 
targets throughout the scene.

-----------------------------
   SUMMARY 
-----------------------------
Data was acquired at Divi Carina Bay Resort on two consecutive days.  The 
hotel was badly damaged from the storm, and the acquisition was performed with
the goal of generating a high resolution 3D model and capturing the stuctural
damage to the building.  Multiple nadir and oblique flights were performed in 
an effort to capture data from all sides of the building.
```
