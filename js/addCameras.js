ncams = camX.length;
var imageobj = Array(ncams);
for(var imagenum=0;imagenum<ncams;imagenum++){
    imageobj[imagenum]=makeImageFrustrum(camdir+'02_THUMBNAILS/',camname[imagenum],camRoll[imagenum],camPitch[imagenum],camYaw[imagenum],camX[imagenum],camY[imagenum],camZ[imagenum]);
    viewer.scene.scene.add(imageobj[imagenum]);
}

function makeImageFrustrum(imagedir,imagename,Rx,Ry,Rz,Cx,Cy,Cz){
    // instantiate a loader
    var loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    var imagetexture = loader.load(imagedir + imagename);

    var imageplane = new THREE.PlaneGeometry(4, 3, 1, 1);
    var imagematerial = new THREE.MeshBasicMaterial( {map:imagetexture, side:THREE.DoubleSide});
    var image = new THREE.Mesh(imageplane, imagematerial);
    var pyramidgeometry = new THREE.Geometry();

    pyramidgeometry.vertices = [
        new THREE.Vector3( -2, -1.5, 0 ),
        new THREE.Vector3( -2, 1.5, 0 ),
        new THREE.Vector3( 2, 1.5, 0 ),
        new THREE.Vector3( 2, -1.5, 0 ),
        new THREE.Vector3( 0, 0, 4 )
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
    imagepyramid.rotation.x = Rx*Math.PI/180;
    imagepyramid.rotation.y = Ry*Math.PI/180;
    imagepyramid.rotation.z = Rz*Math.PI/180;
    imagepyramid.scale.x = 3;
    imagepyramid.scale.y = 3;
    imagepyramid.scale.z = 3;

    return imagepyramid
}