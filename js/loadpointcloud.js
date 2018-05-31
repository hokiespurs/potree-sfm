window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));

viewer.setEDLEnabled(true);
viewer.setFOV(60);
viewer.setPointBudget(5*1000*1000);
document.title = "Corvallis Solar Panels";
viewer.setEDLEnabled(false);
viewer.setBackground("gradient"); // ["skybox", "gradient", "black", "white"];
viewer.setDescription(`Solar Panels, Corvallis, OR`);
viewer.loadSettingsFromURL();

Potree.loadPointCloud("assets/cloud.js", "solarpanels", e => {
    let pointcloud = e.pointcloud;
    let material = pointcloud.material;
    viewer.scene.addPointCloud(pointcloud);
    material.pointColorType = Potree.PointColorType.RGB; // any Potree.PointColorType.XXXX
    material.size = 1;
    material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
    material.shape = Potree.PointShape.SQUARE;
    viewer.fitToScreen();
});