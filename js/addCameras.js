//GLOBALS
var mouse = {x: 0, y: 0};
var INTERSECTED = null;
var camsvisible = true;
var lastXYZ = [0,0,0];
var raycaster = new THREE.Raycaster();
var wantcamsvisible = true;

// when the mouse moves, call the given function
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('click', onDocumentMouseClick, false);

// ADD PYRAMIDS TO SCENE
ncams = camX.length;
var imageobj = Array(ncams);
for(var imagenum=0;imagenum<ncams;imagenum++){
    imageobj[imagenum]=makeImageFrustrum(camdir+'02_THUMBNAILS/',camname[imagenum],camRoll[imagenum],camPitch[imagenum],camYaw[imagenum],camX[imagenum],camY[imagenum],camZ[imagenum]);
    imageobj[imagenum].myimagenum = imagenum;
    viewer.scene.scene.add(imageobj[imagenum]);
}
// ADD IMAGE PLANE TO SCENE AS INVISIBLE
var imageplane = makeImagePlane(camdir+'02_THUMBNAILS/',camname[0],camRoll[0],camPitch[0],camYaw[0],camX[0],camY[0],camZ[0]);
viewer.scene.scene.add(imageplane);
imageplane.visible = false;

//checks if user moved the screen, and therefore imageplane should be turned off
setInterval(checkMovement, 500);


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

    console.log(Rx.toString() + ' | ' + Ry.toString() + ' | ' + Rz.toString());
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
    }
    else{
        console.log(id.toString() + 'Out of Range (Max = ' + camX.length.toString() + ')')
    }

}

function turnImagesOff(){
    if(camsvisible){
        let nimages = imageobj.length;
        let j=0;
        camsvisible = !camsvisible;
        for(j=0;j<nimages;j++){
            imageobj[j].visible=camsvisible;
        }
    }
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
    viewer.scene.view.pitch = (camRoll[id] -90)* Math.PI/180;
    viewer.scene.view.yaw = camYaw[id] * Math.PI/180;
    viewer.fpControls.stop();
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
    if (imageplane.visible==true){
        var currentXYZ = getCurrentPos();
        if(currentXYZ[0]!=lastXYZ[0] || currentXYZ[0]!=lastXYZ[0] || currentXYZ[0]!=lastXYZ[0]){
            imageplane.visible=false;
            $('#toggleimageplane').addClass('disabled');
            $('#togglecam').removeClass('disabled');
            changetoflymode();
            console.log('MOVED')
            console.log(currentXYZ);
            console.log(lastXYZ);
            if (wantcamsvisible && !camsvisible){
                toggleImagesVisible();
            }
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
    checkIntersections();
}

function onDocumentMouseClick(event) {
    raycaster.setFromCamera( mouse, viewer.scene.cameraP );

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects( viewer.scene.scene.children, true);
    for ( var i = 0; i < intersects.length; i++ ) {
        if (intersects[i].object.geometry.vertices.length==5){
            flytoimagenum = intersects[i].object.parent.myimagenum;
            flyToCam(flytoimagenum);
        }
    }
}

function checkIntersections() {

    raycaster.setFromCamera(mouse, viewer.scene.cameraP);

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(viewer.scene.scene.children, true);
    if (intersects.length > 0) {
        var dist2obj = 99999;
        for (var i = 0; i < intersects.length; i++) { //for each intersected object
            if (intersects[i].object.geometry.vertices.length == 5) { // see if it has 5 vertices (pyramid)
                if (intersects[i].distance<dist2obj){ // if it does, see if it's closer than the last distance
                    dist2obj = intersects[i].distance;
                    if (INTERSECTED != intersects[ i ].object) { //if it isnt the previous object
                        if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex ); //change the old one back

                        INTERSECTED = intersects[i].object; //make this the new one
                        INTERSECTED.currentHex = INTERSECTED.material.color.getHex(); //get its color
                        intersects[i].object.material.color.set(0xff0000); //change it's color
                    }
                }
            }
        }
    }
    else {
        if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
        INTERSECTED = null;
    }
    //renderer.render( scene, camera );
}