window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));

viewer.setEDLEnabled(true);
viewer.setFOV(60);
viewer.setPointBudget(1*1000*1000);
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

var XYZPTstart = getCameraXYZPT();
var XYZPTend = getCameraXYZPT();
var deltabetween = [0, 0, 0, 0, 0];
var flyTimer;

function getCameraXYZPT(){
    return {x: viewer.scene.view.position.x,
        y: viewer.scene.view.position.y,
        z: viewer.scene.view.position.z,
        yaw: viewer.scene.view.yaw,
        pitch: viewer.scene.view.pitch}
}

function flyTo(endpt,steps,tottime){
    XYZPTstart = getCameraXYZPT();
    XYZPTend = endpt;
    flyTimer = setInterval(stepflyTo,tottime/steps);
    setTimeout(function(){ clearTimeout(flyTimer); }, tottime);

    deltabetween[0] = (XYZPTend.x - XYZPTstart.x)/steps;
    deltabetween[1] = (XYZPTend.y - XYZPTstart.y)/steps;
    deltabetween[2] = (XYZPTend.z - XYZPTstart.z)/steps;
    deltabetween[3] = (XYZPTend.yaw - XYZPTstart.yaw)/steps;
    deltabetween[4] = (XYZPTend.pitch - XYZPTstart.pitch)/steps;
}

function stepflyTo(){
    viewer.scene.view.position.x += deltabetween[0];
    viewer.scene.view.position.y += deltabetween[1];
    viewer.scene.view.position.z += deltabetween[2];
    viewer.scene.view.yaw += deltabetween[3];
    viewer.scene.view.pitch += deltabetween[4];
}