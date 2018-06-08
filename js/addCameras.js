//GLOBALS
var mouse = {x: 0, y: 0, doUse: false};
var INTERSECTED = null;
var camsvisible = true;
var cameraplaneview = false;
var lastXYZ = [0,0,0];
var raycaster = new THREE.Raycaster();
var wantcamsvisible = true;
var ncams = camX.length;
var currentid = ncams-1;
let measuringTool = new Potree.MeasuringTool(viewer);
var mapshow = true;
var lookAtPtNum = null;
var dofilterimages = false;
var lastLookAtPt = [0,0,0];
var SCALEIMG = 3;
// when the mouse moves, call the given function
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mousedown', onDocumentMouseClick, false);
document.addEventListener('keydown', onDocumentKeyPress, false);

// ADD PYRAMIDS TO SCENE

var imageobj = Array(ncams);
for(var imagenum=0;imagenum<ncams;imagenum++){
    imageobj[imagenum]=makeImageFrustrum(camdir+'02_THUMBNAILS/',camname[imagenum],camRoll[imagenum],camPitch[imagenum],camYaw[imagenum],camX[imagenum],camY[imagenum],camZ[imagenum]);
    imageobj[imagenum].myimagenum = imagenum;
    imageobj[imagenum].isFiltered = false;
    viewer.scene.scene.add(imageobj[imagenum]);
}
// ADD IMAGE PLANE TO SCENE AS INVISIBLE
var imageplane = makeImagePlane(camdir+'02_THUMBNAILS/',camname[0],camRoll[0],camPitch[0],camYaw[0],camX[0],camY[0],camZ[0]);
viewer.scene.scene.add(imageplane);
imageplane.visible = false;

//checks if user moved the screen, and therefore imageplane should be turned off
setInterval(checkMovement, 100);
setInterval(cameraOnMap, 100);


function makeImageFrustrum(imagedir,imagename,Rx,Ry,Rz,Cx,Cy,Cz){
    // instantiate a loader
    var loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    var imagetexture = loader.load(imagedir + imagename);

    var pixx = camPix[0]/camFocal;
    var pixy = camPix[1]/camFocal;

    var imageplane = new THREE.PlaneGeometry(pixx, pixy, 1, 1);
    imageplane.vertices[0].z = -1;
    imageplane.vertices[1].z = -1;
    imageplane.vertices[2].z = -1;
    imageplane.vertices[3].z = -1;

    var imagematerial = new THREE.MeshBasicMaterial( {map:imagetexture, side:THREE.DoubleSide});
    var image = new THREE.Mesh(imageplane, imagematerial);
    var pyramidgeometry = new THREE.Geometry();

    pyramidgeometry.vertices = [
        new THREE.Vector3( -pixx/2, -pixy/2, -1 ),
        new THREE.Vector3( -pixx/2, pixy/2, -1 ),
        new THREE.Vector3( pixx/2, pixy/2, -1 ),
        new THREE.Vector3( pixx/2, -pixy/2, -1 ),
        new THREE.Vector3( 0, 0, 0 )
    ];

    pyramidgeometry.faces = [
        new THREE.Face3( 1, 0, 4 ),
        new THREE.Face3( 2, 1, 4 ),
        new THREE.Face3( 3, 2, 4 ),
        new THREE.Face3( 0, 3, 4 )
    ];

    var pyramidmaterial = new THREE.MeshBasicMaterial( {   color: 0xf8f9fa,
        wireframe: true
    } );


    var pyramid = new THREE.Mesh( pyramidgeometry, pyramidmaterial );

    var imagepyramid  = new THREE.Object3D();

    imagepyramid.add(image);
    imagepyramid.add(pyramid);

    imagepyramid.position.x = Cx;
    imagepyramid.position.y = Cy;
    imagepyramid.position.z = Cz;

    imagepyramid.rotation.x = Rx * Math.PI/180;
    imagepyramid.rotation.y = Ry * Math.PI/180;
    imagepyramid.rotation.z = Rz * Math.PI/180;

    imagepyramid.scale.x = SCALEIMG;
    imagepyramid.scale.y = SCALEIMG;
    imagepyramid.scale.z = SCALEIMG;

    return imagepyramid
}

function makeImagePlane(imagedir,imagename,Rx,Ry,Rz,Cx,Cy,Cz) {
    // instantiate a loader
    var loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    var imagetexture = loader.load(imagedir + imagename);

    var pixx = camPix[0]/camFocal;
    var pixy = camPix[1]/camFocal;

    var imageplane = new THREE.PlaneGeometry(pixx, pixy, 1, 1);
    imageplane.vertices[0].z = -1;
    imageplane.vertices[1].z = -1;
    imageplane.vertices[2].z = -1;
    imageplane.vertices[3].z = -1;

    var imagematerial = new THREE.MeshBasicMaterial( {map:imagetexture, side:THREE.DoubleSide});
    var image = new THREE.Mesh(imageplane, imagematerial);

    var imagepyramid  = new THREE.Object3D();

    imagepyramid.add(image);

    imagepyramid.children[0].material.opacity = 1;
    imagepyramid.children[0].material.transparent  = true;
    return imagepyramid
}

function changeImagePlane(id) {
    var loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    imageplane.children[0].material.dispose();
    imageplane.children[0].material.map = loader.load(camdir + '01_IMAGES/' + camname[id]);
    var Cx = camX[id];
    var Cy = camY[id];
    var Cz = camZ[id];
    var Rx = camRoll[id];
    var Ry = camPitch[id];
    var Rz = camYaw[id];

    imageplane.position.x = Cx;
    imageplane.position.y = Cy;
    imageplane.position.z = Cz;

    imageplane.rotation.x = Rx * Math.PI/180;
    imageplane.rotation.y = Ry * Math.PI/180;
    imageplane.rotation.z = Rz * Math.PI/180;

    imageplane.scale.x = SCALEIMG;
    imageplane.scale.y = SCALEIMG;
    imageplane.scale.z = SCALEIMG;

    imageplane.visible = true;
}
//Useful for debugging
function changeImagePlaneOrientation(Rx,Ry,Rz){
    imageplane.rotation.x = Rx * Math.PI/180;
    imageplane.rotation.y = Ry * Math.PI/180;
    imageplane.rotation.z = Rz * Math.PI/180;
}

function flyToCam(id){
    if(id<camX.length) {
        imageplane.visible = false;
        viewer.fpControls.stop();
        changetoOrbitmode();
        moveCamera(id);
        changeImagePlane(id);
        lastXYZ= [Math.round(camX[id]*100)/100, Math.round(camY[id]*100)/100, Math.round(camZ[id]*100)/100];
        $('#toggleimageplane').removeClass('disabled');
        $('#togglecam').addClass('disabled');
        turnImagesOff();
        currentid = id;
        cameraplaneview = true;
        camsvisible = true;
        $('#btnimagenum').text(id.toString());
        $('#cameraicon').addClass('buttonfgclicked');
        if (lookAtPtNum!=null){
            var xyzlookat = viewer.scene.measurements[lookAtPtNum].children[3].getWorldPosition();
            viewer.scene.view.lookAt(xyzlookat);
        }
    }
    else{
        console.log(id.toString() + 'Out of Range (Max = ' + camX.length.toString() + ')')
    }

}

function turnImagesOff(){
    if(camsvisible){
        let nimages = imageobj.length;
        let j=0;
        camsvisible = false;
        for(j=0;j<nimages;j++){
            imageobj[j].visible=false;
        }
    }
    $('#cameraicon').removeClass('buttonfgclicked');
}

function turnImagesOn(){
    if(!imageobj[0].visible){
        let nimages = imageobj.length;
        let j=0;
        camsvisible = true;
        for(j=0;j<nimages;j++){
            imageobj[j].visible=true;
        }
        filterImages();
    }
    $('#cameraicon').addClass('buttonfgclicked');
}

function toggleImagesVisible(){
    let nimages = imageobj.length;
    let j=0;
    camsvisible = !camsvisible;
    for(j=0;j<nimages;j++){
        imageobj[j].visible=camsvisible;
    }
    wantcamsvisible = camsvisible;
}

function moveCamera(id) {
    viewer.scene.view.position.x = camX[id];
    viewer.scene.view.position.y = camY[id];
    viewer.scene.view.position.z = camZ[id];

    let a = new THREE.Euler(camRoll[id]*Math.PI/180,camPitch[id]*Math.PI/180,camYaw[id]*Math.PI/180,'XYZ');
    let b = new THREE.Vector3( 0, 0, -1 );
    b.applyEuler(a);
    b.x = b.x + camX[id];
    b.y = b.y + camY[id];
    b.z = b.z + camZ[id];

    //var lookatpt = [camX[id]+b.x, camY[id]+b.y, camZ[id]+b.z];
    viewer.scene.view.lookAt(b);

    // viewer.scene.view.pitch = (camRoll[id] -90)* Math.PI/180;
    // viewer.scene.view.yaw = camYaw[id] * Math.PI/180;
    // viewer.fpControls.stop();
}

function changeCameraOrientation(pitch,yaw){
    viewer.scene.view.pitch = pitch * Math.PI/180;
    viewer.scene.view.yaw = yaw * Math.PI/180;
}
// CHANGE CAMERA MODE
function changetoflymode() {
    viewer.setNavigationMode(Potree.OrbitControls);
}

function changetoOrbitmode() {
    viewer.setNavigationMode(Potree.FirstPersonControls);
    viewer.fpControls.lockElevation = true;
}

// CHECK TO SEE IF CAMERA HAS MOVED. IF YES, GET OUT OF FIRST PERSON VIEW AND REMOVE CAMERA PLANE
function checkMovement(){
    //only check if imageplane is visible
    if (cameraplaneview){
        var currentXYZ = getCurrentPos();
        if(currentXYZ[0]!=lastXYZ[0] || currentXYZ[1]!=lastXYZ[1] || currentXYZ[2]!=lastXYZ[2]){
            imageplane.visible=false;
            changetoflymode();
            if (camsvisible | cameraplaneview){
                turnImagesOn();
            }
            cameraplaneview = false;
            // fix issue where radius was crazy far away
            if (viewer.scene.view.radius>50){
                viewer.scene.view.radius = 50;
            }
        }
    }
    if (lookAtPtNum!=null && dofilterimages && !cameraplaneview){
        var currentlookatpt =  viewer.scene.measurements[lookAtPtNum].children[3].getWorldPosition();

        if(currentlookatpt.x!=lastLookAtPt.x || currentlookatpt.y!=lastLookAtPt.y || currentlookatpt.z!=lastLookAtPt.z) {
            filterImages();
            console.log("filtering images");
            lastLookAtPt = currentlookatpt;
        }
    }

}

// RETURN CURRENT CAMERA POSITION [X, Y, Z]
function getCurrentPos(){
    var ixyz = [Math.round(viewer.scene.view.position.x*100)/100,
                Math.round(viewer.scene.view.position.y*100)/100,
                Math.round(viewer.scene.view.position.z*100)/100];
    return ixyz;
}

// HANDLE MOUSE OVER PYRAMIDS
function onDocumentMouseMove(event) {
    // the following line would stop any other event handler from firing
    // (such as the mouse's TrackballControls)
    // event.preventDefault();

    // update the mouse variable
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    var elementType="";
    try {
        elementType = document.elementFromPoint(event.clientX, event.clientY).tagName;
    }
    catch(err) {
        elementType = "ERROR";
    }

    mouse.doUse = elementType=='CANVAS';
    checkIntersections();
}

function onDocumentMouseClick(event) {
    if (mouse.doUse && event.button==0) {
        raycaster.setFromCamera(mouse, viewer.scene.cameraP);

        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(viewer.scene.scene.children, true);
        for (var i = 0; i < intersects.length; i++) {
            if (intersects[i].object.geometry.vertices.length == 5) {
                flytoimagenum = intersects[i].object.parent.myimagenum;
                flyToCam(flytoimagenum);
            }
        }
    }
}

function onDocumentKeyPress(event){
    var keycode = event.code;
    switch (keycode){
        case "Space":
            flyTo(XYZPTend,100,5000);
            break;
        case "Digit1":
            XYZPTend = getCameraXYZPT();
            break;
    }
    console.log(event);
}
function checkIntersections() {
    if (mouse.doUse) {
        raycaster.setFromCamera(mouse, viewer.scene.cameraP);

        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(viewer.scene.scene.children, true);
        if (intersects.length > 0) {
            var dist2obj = 99999;
            for (var i = 0; i < intersects.length; i++) { //for each intersected object
                if (intersects[i].object.geometry.vertices.length == 5) { // see if it has 5 vertices (pyramid)
                    if (intersects[i].distance < dist2obj) { // if it does, see if it's closer than the last distance
                        dist2obj = intersects[i].distance;
                        if (INTERSECTED != intersects[i].object) { //if it isnt the previous object
                            if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex); //change the old one back

                            INTERSECTED = intersects[i].object; //make this the new one
                            INTERSECTED.currentHex = INTERSECTED.material.color.getHex(); //get its color
                            intersects[i].object.material.color.set(0xff0000); //change it's color
                        }
                    }
                }
            }
        }
        else {
            if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
            INTERSECTED = null;
        }
        //renderer.render( scene, camera );
    }
    else {
        if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
    }
}

//MEASUREMENT FUNCTIONS
function measPoint(){
    let measurement = measuringTool.startInsertion({
        showDistances: false,
        showAngles: false,
        showCoordinates: true,
        showArea: false,
        closed: true,
        maxMarkers: 1,
        name: 'Point'});
}

function measDistance(){
    let measurement = measuringTool.startInsertion({
        showDistances: true,
        showArea: false,
        closed: false,
        name: 'Distance'});
}

function measHeight(){
    let measurement = measuringTool.startInsertion({
        showDistances: false,
        showHeight: true,
        showArea: false,
        closed: false,
        maxMarkers: 2,
        name: 'Height'});
}

function measAngle(){
    let measurement = measuringTool.startInsertion({
        showDistances: false,
        showAngles: true,
        showArea: false,
        closed: true,
        maxMarkers: 3,
        name: 'Angle'});
}

function measClear(){
    viewer.scene.removeAllMeasurements();
    lookAtPtNum = null;
    dofilterimages = false;
    $('#filterbtn').removeClass('buttonfgclicked');
    $('#lookatbtn').removeClass('buttonfgclicked');

    turnImagesOn();
    if (cameraplaneview){
        turnImagesOff();
    }

    $('#lookAtFilter').hide();
    $('#toggleLookAtPtVisible').hide();
}

function measLookAt(){
    if(lookAtPtNum!=null){
        viewer.scene.measurements[lookAtPtNum].visible= false;
        lookAtPtNum = null;
        var lastLookAtPt = [0,0,0];
        $('#lookAtFilter').hide();
        $('#toggleLookAtPtVisible').hide();
        $('#lookatbtn').removeClass('buttonfgclicked');
        $('#filterbtn').addClass('buttonfgclicked');
    }
    else {
        lookAtPtNum = viewer.scene.measurements.length;
        let measurement = measuringTool.startInsertion({
            showDistances: false,
            showAngles: false,
            showCoordinates: false,
            showArea: false,
            closed: true,
            maxMarkers: 1,
            name: 'Point'
        });

        viewer.scene.measurements[lookAtPtNum].children[3].material.color.setRGB(255, 0, 255);
        $('#lookAtFilter').show();
        $('#toggleLookAtPtVisible').show();
        $('#lookatvisible').addClass('buttonfgclicked');
        $('#lookatbtn').addClass('buttonfgclicked');
        $('#cameraicon').addClass('buttonfgclicked');
        $('#filterbtn').addClass('buttonfgclicked');
        dofilterimages = true;
    }
}

function filterImages(){
    if (lookAtPtNum!=null & dofilterimages == true) {
        xyzlookat = viewer.scene.measurements[lookAtPtNum].children[3].getWorldPosition();

        var Xw = xyzlookat.x;
        var Yw = xyzlookat.y;
        var Zw = xyzlookat.z;

        let testid = 1080;
        var f = camFocal;
        var cx = camPix[0] / 2;
        var cy = camPix[1] / 2;


        for (var imagenum = 0; imagenum < ncams; imagenum++) {
            var Xc = camX[imagenum];
            var Yc = camY[imagenum];
            var Zc = camZ[imagenum];
            var Rx = camRoll[imagenum];
            var Ry = camPitch[imagenum];
            var Rz = camYaw[imagenum];

            if (!isptincamera(f, cx, cy, Xc, Yc, Zc, Xw, Yw, Zw, Rx, Ry, Rz)) {
                imageobj[imagenum].visible = false;
                imageobj[imagenum].isFiltered = true;
            }
            else {
                imageobj[imagenum].visible = true;
                imageobj[imagenum].isFiltered = false;
            }
            camsvisible = true;
        }
    }
}

function cameraOnMap(){
    // Add Camera Dot to Map
    var camerapos = viewer.scene.view.position;
    var cameraLatLon = projected2WGS84(camerapos.x,camerapos.y);

    uasmarker.setLatLng(cameraLatLon);
    uasmarker.update();
    // Get Mean Z of PC to compute plane for footprint
    var meanZ = 0; // HARDCODED

    // Add camera Footprint to Map
    var xyzCamera = getCurrentPos();
    var campitch = viewer.scene.view.pitch;
    var camyaw = viewer.scene.view.yaw;
    var camfcxcy = calcCamerafcxcy();
    updateFootprintPanTilt(camerafootprintpolygon,xyzCamera[0],xyzCamera[1],xyzCamera[2]-meanZ,camyaw-Math.PI/2,campitch-Math.PI/2,camfcxcy[0],camfcxcy[1],camfcxcy[2]);

    // Add image footprint to Map
    if (cameraplaneview){
        updateFootprintRxyz(imagefootprintpolygon,camX[currentid],camY[currentid],camZ[currentid]-meanZ,camRoll[currentid],camPitch[currentid],camYaw[currentid],camFocal,camPix[0]/2,camPix[1]/2);
    }
    else {
        updateFootprintRxyz(imagefootprintpolygon,0,0,0,0,0,0,camFocal,camPix[0]/2,camPix[1]/2);
    }

    // add magenta dot if in camera
    if (lookAtPtNum!=null){
        var camerapos = viewer.scene.measurements[lookAtPtNum].children[3].getWorldPosition();
        var cameraLatLon = projected2WGS84(camerapos.x,camerapos.y);

        lookatmarker.setLatLng(cameraLatLon);
        lookatmarker.update();
    }
    else {
        lookatmarker.setLatLng([0,0]);
        lookatmarker.update();    }
}

function calcCamerafcxcy(){
    var camfov = viewer.getFOV()*Math.PI/180;
    var cx = window.innerWidth/2;
    var cy = window.innerHeight/2;
    var f = cy/Math.tan(camfov/2);
    return [f,cy,cx]
}

function updateFootprintRxyz(polygon,Xc,Yc,Zc,Rx,Ry,Rz,f,cx,cy){
    Rx = Rx*Math.PI/180;
    Ry = (Ry-180)*Math.PI/180;
    Rz = -Rz*Math.PI/180;

    P = calcP_RxRyRz(Xc,Yc,Zc,Rx,Ry,Rz,f,cx,cy);
    footprintLL = calcFootprint(P,f,cx,cy);
    polygon.setLatLngs(footprintLL);
    polygon.redraw();
}

function updateFootprintPanTilt(polygon,Xc,Yc,Zc,pan,tilt,f,cx,cy){
    P = calcP_pantilt(Xc,Yc,Zc,pan,tilt,f,cx,cy);
    footprintLL = calcFootprint(P,f,cx,cy);
    polygon.setLatLngs(footprintLL);
    polygon.redraw();
}

function projected2WGS84(x,y){
    let pointcloudProjection = "+proj=utm +zone=20 +ellps=GRS80 +datum=NAD83 +units=m +no_defs";
    let mapProjection = proj4.defs("WGS84");

    var lonlat = proj4(pointcloudProjection,mapProjection,[x,y]);

    return [lonlat[1], lonlat[0]]
}

function projectedFromWGS84(lat,lng){
    let pointcloudProjection = "+proj=utm +zone=20 +ellps=GRS80 +datum=NAD83 +units=m +no_defs";
    let mapProjection = proj4.defs("WGS84");

    var xy = proj4(mapProjection,pointcloudProjection,[lng,lat]);

    return [xy[0], xy[1]]
}

function markerdragged(){
    var LatLng = uasmarker.getLatLng();
    var newxy = projectedFromWGS84(LatLng.lat,LatLng.lng);

    viewer.scene.view.position.x = newxy[0];
    viewer.scene.view.position.y = newxy[1];
}

// PHOTOGRAMMETRY
function calcFootprint(P,f,cx,cy){
    var footprintpixels = calcCornerPixHorizonTrim(P,f,cx,cy);
    if (footprintpixels.length==0){
        return([[0,0],[0,0],[0,0],[0,0]])
    }
    var i;
    var LLcorners = Array();
    for(i=0;i<footprintpixels.length;i++){
        var Putm = uv2xyconstz(footprintpixels[i][0],footprintpixels[i][1],P);
        LLcorners.push(projected2WGS84(Putm[0],Putm[1]));
    }
    return LLcorners
}

function calcP_pantilt(Xc,Yc,Zc,pan,tilt,f,cx,cy){
    let P1 = [f*Math.cos(pan)*Math.cos(tilt) + cx*Math.cos(pan)*Math.sin(tilt),
        f*Math.cos(tilt)*Math.sin(pan) + cx*Math.sin(pan)*Math.sin(tilt),
        cx*Math.cos(tilt) - f*Math.sin(tilt),
        - Xc*(f*Math.cos(pan)*Math.cos(tilt) + cx*Math.cos(pan)*Math.sin(tilt)) - Yc*(f*Math.cos(tilt)*Math.sin(pan) + cx*Math.sin(pan)*Math.sin(tilt)) - Zc*(cx*Math.cos(tilt) - f*Math.sin(tilt))];
    let P2 = [cy*Math.cos(pan)*Math.sin(tilt) - f*Math.sin(pan),
        f*Math.cos(pan) + cy*Math.sin(pan)*Math.sin(tilt),
        cy*Math.cos(tilt),
        Xc*(f*Math.sin(pan) - cy*Math.cos(pan)*Math.sin(tilt)) - Yc*(f*Math.cos(pan) + cy*Math.sin(pan)*Math.sin(tilt)) - Zc*cy*Math.cos(tilt)];
    let P3 = [Math.cos(pan)*Math.sin(tilt),
        Math.sin(pan)*Math.sin(tilt),
        Math.cos(tilt),
        - Zc*Math.cos(tilt) - Xc*Math.cos(pan)*Math.sin(tilt) - Yc*Math.sin(pan)*Math.sin(tilt)];
    return [P1, P2, P3];
}

function calcP_RxRyRz(Xc,Yc,Zc,Rx,Ry,Rz,f,cx,cy){
    let P1 = [cx*Math.sin(Ry) + f*Math.cos(Ry)*Math.cos(Rz),
        f*(Math.cos(Rx)*Math.sin(Rz) + Math.cos(Rz)*Math.sin(Rx)*Math.sin(Ry)) - cx*Math.cos(Ry)*Math.sin(Rx),
        f*(Math.sin(Rx)*Math.sin(Rz) - Math.cos(Rx)*Math.cos(Rz)*Math.sin(Ry)) + cx*Math.cos(Rx)*Math.cos(Ry),
        - Xc*(cx*Math.sin(Ry) + f*Math.cos(Ry)*Math.cos(Rz)) - Zc*(f*(Math.sin(Rx)*Math.sin(Rz) - Math.cos(Rx)*Math.cos(Rz)*Math.sin(Ry)) + cx*Math.cos(Rx)*Math.cos(Ry)) - Yc*(f*(Math.cos(Rx)*Math.sin(Rz) + Math.cos(Rz)*Math.sin(Rx)*Math.sin(Ry)) - cx*Math.cos(Ry)*Math.sin(Rx))];
    let P2 = [cy*Math.sin(Ry) - f*Math.cos(Ry)*Math.sin(Rz),
        f*(Math.cos(Rx)*Math.cos(Rz) - Math.sin(Rx)*Math.sin(Ry)*Math.sin(Rz)) - cy*Math.cos(Ry)*Math.sin(Rx),
        f*(Math.cos(Rz)*Math.sin(Rx) + Math.cos(Rx)*Math.sin(Ry)*Math.sin(Rz)) + cy*Math.cos(Rx)*Math.cos(Ry),
        - Xc*(cy*Math.sin(Ry) - f*Math.cos(Ry)*Math.sin(Rz)) - Zc*(f*(Math.cos(Rz)*Math.sin(Rx) + Math.cos(Rx)*Math.sin(Ry)*Math.sin(Rz)) + cy*Math.cos(Rx)*Math.cos(Ry)) - Yc*(f*(Math.cos(Rx)*Math.cos(Rz) - Math.sin(Rx)*Math.sin(Ry)*Math.sin(Rz)) - cy*Math.cos(Ry)*Math.sin(Rx))];
    let P3 = [Math.sin(Ry),
        -Math.cos(Ry)*Math.sin(Rx),
        Math.cos(Rx)*Math.cos(Ry),
        Yc*Math.cos(Ry)*Math.sin(Rx) - Zc*Math.cos(Rx)*Math.cos(Ry) - Xc*Math.sin(Ry)];
    return [P1, P2, P3];
}

function calcCornerPixHorizonTrim(P,f,cx,cy) {
    // determine angle to not go over

    let horizonangle = 85*Math.PI/180;
    // [ 4       1 ]
    // |           | Pixel corners in this order
    // |           |
    // [ 3       2 ]

    var pix_of_corners = [[cx*2, 1],
        [cx*2, cy*2],
        [1, cy*2],
        [1, 1]];

    var el_of_corners = Array(4);

    var i;
    for(i=0;i<4;i++){
        el_of_corners[i] = calcEl(P,pix_of_corners[i][0],pix_of_corners[i][1]);
    }

    var pixellist = Array();
    for(i=0;i<4;i++){
        var i1 = i;
        var i2 = i+1;if (i2==4){i2=0;}
        pixellist = calcSegmentInterp(pix_of_corners[i],pix_of_corners[i2],el_of_corners[i1],el_of_corners[i2],horizonangle,pixellist);
    }

    return pixellist;
}

function calcSegmentInterp(pix1, pix2, el1, el2, horizonangle, pixellist){
    // Null Case: both points are above the horizon angle
    if (el1>=horizonangle && el2>=horizonangle){return pixellist;}

    // If first below horizon, push that point to pixellist
    if (el1<horizonangle){
        pixellist.push(pix1);
        if (el2<horizonangle) {return pixellist;}
    }

    // Interpolate along segment
    // find whether xpix or ypix are varying
    var xvarying = false;
    if (pix1[1]==pix2[1]){xvarying=true;}
    // interpolate
    var T = (horizonangle-el1)/(el2-el1);
    if (xvarying){
        var ypix = pix1[1];
        var xpix = pix1[0] + (pix2[0] - pix1[0]) * T;
        pixellist.push([xpix, ypix])
    }
    else {
        var xpix = pix1[0];
        var ypix = pix1[1] + (pix2[1] - pix1[1]) * T;
        pixellist.push([xpix, ypix])
    }
    return pixellist;
}

function calcEl(P,pixx,pixy){
    var fullP = P.slice(0);
    var iP = math.inv([[fullP[0][0], fullP[0][1], fullP[0][2]],
        [fullP[1][0], fullP[1][1], fullP[1][2]],
        [fullP[2][0], fullP[2][1], fullP[2][2]]]);
    var uvs1 = [pixx,pixy,1];
    var xyz1 = math.multiply(iP,uvs1);

    var r = Math.sqrt((xyz1[0])**2+(xyz1[1])**2);
    var el = Math.PI/2 + Math.atan2(xyz1[2],r);

    return el;
}

function isptincamera(f,cx,cy,Xc,Yc,Zc,Xw,Yw,Zw,Rx,Ry,Rz) {
    // XYZ Euler Order
    Rx = Rx * Math.PI/180;
    Ry = Ry * Math.PI/180;
    Rz = Rz * Math.PI/180;

    var pixx = (Xc*(cx*Math.sin(Ry) + f*Math.cos(Ry)*Math.cos(Rz)) - Xw*(cx*Math.sin(Ry) + f*Math.cos(Ry)*Math.cos(Rz)) + Zc*(f*(Math.sin(Rx)*Math.sin(Rz) - Math.cos(Rx)*Math.cos(Rz)*Math.sin(Ry)) + cx*Math.cos(Rx)*Math.cos(Ry)) - Zw*(f*(Math.sin(Rx)*Math.sin(Rz) - Math.cos(Rx)*Math.cos(Rz)*Math.sin(Ry)) + cx*Math.cos(Rx)*Math.cos(Ry)) + Yc*(f*(Math.cos(Rx)*Math.sin(Rz) + Math.cos(Rz)*Math.sin(Rx)*Math.sin(Ry)) - cx*Math.cos(Ry)*Math.sin(Rx)) - Yw*(f*(Math.cos(Rx)*Math.sin(Rz) + Math.cos(Rz)*Math.sin(Rx)*Math.sin(Ry)) - cx*Math.cos(Ry)*Math.sin(Rx)))/(Xc*Math.sin(Ry) - Xw*Math.sin(Ry) + Zc*Math.cos(Rx)*Math.cos(Ry) - Zw*Math.cos(Rx)*Math.cos(Ry) - Yc*Math.cos(Ry)*Math.sin(Rx) + Yw*Math.cos(Ry)*Math.sin(Rx));
    var pixy = (Xc*(cy*Math.sin(Ry) - f*Math.cos(Ry)*Math.sin(Rz)) - Xw*(cy*Math.sin(Ry) - f*Math.cos(Ry)*Math.sin(Rz)) + Zc*(f*(Math.cos(Rz)*Math.sin(Rx) + Math.cos(Rx)*Math.sin(Ry)*Math.sin(Rz)) + cy*Math.cos(Rx)*Math.cos(Ry)) - Zw*(f*(Math.cos(Rz)*Math.sin(Rx) + Math.cos(Rx)*Math.sin(Ry)*Math.sin(Rz)) + cy*Math.cos(Rx)*Math.cos(Ry)) + Yc*(f*(Math.cos(Rx)*Math.cos(Rz) - Math.sin(Rx)*Math.sin(Ry)*Math.sin(Rz)) - cy*Math.cos(Ry)*Math.sin(Rx)) - Yw*(f*(Math.cos(Rx)*Math.cos(Rz) - Math.sin(Rx)*Math.sin(Ry)*Math.sin(Rz)) - cy*Math.cos(Ry)*Math.sin(Rx)))/(Xc*Math.sin(Ry) - Xw*Math.sin(Ry) + Zc*Math.cos(Rx)*Math.cos(Ry) - Zw*Math.cos(Rx)*Math.cos(Ry) - Yc*Math.cos(Ry)*Math.sin(Rx) + Yw*Math.cos(Ry)*Math.sin(Rx));
    var s = Xw*Math.sin(Ry) - Xc*Math.sin(Ry) - Zc*Math.cos(Rx)*Math.cos(Ry) + Zw*Math.cos(Rx)*Math.cos(Ry) + Yc*Math.cos(Ry)*Math.sin(Rx) - Yw*Math.cos(Ry)*Math.sin(Rx)

    let isgood = !(pixx<0 | pixx>(cx*2) | pixy<0 | pixy>(cy*2) | s>0);
    return isgood
}

function uv2xyconstz(pixx,pixy,P){
    //assumes Zw = 0;
    var Xw = (P[0][1]*P[1][3] - P[0][3]*P[1][1] - P[0][1]*P[2][3]*pixy + P[0][3]*P[2][1]*pixy + P[1][1]*P[2][3]*pixx - P[1][3]*P[2][1]*pixx)/(P[0][0]*P[1][1] - P[0][1]*P[1][0] - P[0][0]*P[2][1]*pixy + P[0][1]*P[2][0]*pixy + P[1][0]*P[2][1]*pixx - P[1][1]*P[2][0]*pixx);
    var Yw = -(P[0][0]*P[1][3] - P[0][3]*P[1][0] - P[0][0]*P[2][3]*pixy + P[0][3]*P[2][0]*pixy + P[1][0]*P[2][3]*pixx - P[1][3]*P[2][0]*pixx)/(P[0][0]*P[1][1] - P[0][1]*P[1][0] - P[0][0]*P[2][1]*pixy + P[0][1]*P[2][0]*pixy + P[1][0]*P[2][1]*pixx - P[1][1]*P[2][0]*pixx);
    var s = (P[0][0]*P[1][1]*P[2][3] - P[0][0]*P[1][3]*P[2][1] - P[0][1]*P[1][0]*P[2][3] + P[0][1]*P[1][3]*P[2][0] + P[0][3]*P[1][0]*P[2][1] - P[0][3]*P[1][1]*P[2][0])/(P[0][0]*P[1][1] - P[0][1]*P[1][0] - P[0][0]*P[2][1]*pixy + P[0][1]*P[2][0]*pixy + P[1][0]*P[2][1]*pixx - P[1][1]*P[2][0]*pixx);

    return [Xw, Yw, s];
}