# images-in-a-potree
Project with the primary goal of adding SfM images into a potree viewer using THREE.js.

# Proposal

## Group members

- Richie Slocum w/ help from Bo Zhao

## Motivation

Photogrammetrically derived 3D pointcloud data generated using Structure from Motion (SfM) algorithms is increasingly being used by a variety of scientific fields.  The 3D data can be used to make precise measurements and depict complex phenomena.  A traditional challenge with this data is disseminating the raw data to users who do not have a computer capable of viewing and analyzing the data. The open source project, Potree, enables interaction with these pointclouds in a web browser by leveraging a 3d voxel equivalent of 2D map tiling to enable the rendering of millions of data points.

> Potree is a free open-source WebGL based point cloud renderer for large point clouds, developed at the Institute of Computer Graphics and Algorithms, TU Wien.

Potree was developed to enable the viewing of pointclouds which come from a variety of sources which are not always photogrammetrically derived.  Therefore, there are currently no hooks in place to enable viewing the images within the 3D view.  The primary motivation of this work is to add some georeferenced images to the potree pointcloud viewer in a way which improves a user's ability to interpret the data.  

The secondary motivation of this work is to customize the potree sidebar in a way which is simplifies the user interface and highlights tools which are useful for specific datasets.  A cesium map will also be implemented to provide a map depicting the spatial location of the pointcloud data.

## Project Description

For this project, I will implement a workflow or js library to add camera planes to the scene.  This is common in commercial SfM software packages, and provides the user insight into where the images were taken from.  The added information of the image can sometimes provide the user with more information than just the pointcloud.  Below is an example from Pix4d demonstrating the images visualized in 3D space.  If time allows, I will attempt tp implement the green rays going from a user selected point to each of the cameras which see that point.  

![pix4d](https://github.com/hokiespurs/images-in-a-potree/blob/master/img/Pix4D.png?raw=true)

Cesium will also be implemented to add a basemap under the pointcloud.  This will help give further perspective as to the location of the pointcloud.

![cesium](https://github.com/hokiespurs/images-in-a-potree/blob/master/img/cesium.png?raw=true)

Finally, the standard sidebar, shown above, will be modified to change the look and highlight only specific tools which apply for SfM pointclouds.  This customized sidebar will be designed during the project, and will aim to improve the user experience when viewing the dataset.

## Data Source

For my research at Oregon State University in the Civil Engineering Department, I have acquired and processed many photogrammetric pointclouds.  I will use these pointclouds to test this project.  Specifically, I will likely focus on Divi Carina Bay, on the USVI.  This data is already hosted [here](http://research.engr.oregonstate.edu/lidar/pointcloud/20171107_USVI/potree/DiviCarinaBay_potree_dense_filt/DiviCarinaBay.html). 

## Interface Design

The interface will be similar to the image from Pix4D shown in the project description.  There will be a pointcloud that the user can fly around, but there will be images added to the scene depicting where the image was acquired from.  The sidebar will be customized to enhance the user experience for specific datasets, and a Cesium map will be added beneath the pointcloud.

## Proposed Timeline
* Need to Update This (05/10/2018)
| Task                                                         |      Date      |
| :----------------------------------------------------------- | :------------: |
| Add Image texture to plane using THREE.js                    |   04/30/2018   |
| Add one Image plane-pyramid into a Potree scene w/ rotation matrix applied |   05/07/2018   |
| Add many image planes based on a text file                   |   05/14/2018   |
| Add Cesium Map                                               |   05/21/2018   |
| Custom Sidebar Design                                        |   05/21/2018   |
| Custom Sidebar                                               |   05/28/2018   |
| Finish Demo                                                  |   06/01/2018   |
| Finish Documentation                                         |   06/08/2018   |
| option 1: Add tool to draw rays from clicked points          | if time allows |
| option 2: Make nice js library to make adding these to Potree really easy | if time allows |
| option 3: Snap view to images with correct FOV               | if time allows |

## Interface Sketch
Below is a rough idea for the desired interface.  I hope to use a bootstrap navigation bar up top, with icons to indicate the possible dropdowns.  The main potree viewer will be enhanced with the optional addition of a Cesium map, and "image pyradmids" in the scene.  These image pyramids will allow the user to see how the pointcloud was generated.  An attribution will also be placed in the lower right, similar to how leaflet does.

![layout](https://github.com/hokiespurs/images-in-a-potree/blob/master/img/layoutdesignv1.jpg?raw=true)
