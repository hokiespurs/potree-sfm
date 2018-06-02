window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));

viewer.setEDLEnabled(true);
viewer.setFOV(60);
viewer.setPointBudget(5*1000*1000);
viewer.setEDLEnabled(false);
viewer.setBackground("gradient"); // ["skybox", "gradient", "black", "white"];
viewer.loadSettingsFromURL();

Potree.loadPointCloud("assets/05_POTREEDATA/pointclouds/index/cloud.js", "pointcloud", e => {
    let pointcloud = e.pointcloud;
    let material = pointcloud.material;
    viewer.scene.addPointCloud(pointcloud);
    material.pointColorType = Potree.PointColorType.RGB; // any Potree.PointColorType.XXXX
    material.size = 1;
    material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
    material.shape = Potree.PointShape.SQUARE;
    viewer.fitToScreen();
});