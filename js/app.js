// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 4;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

// Create a Cube Mesh with basic material
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
var cube = new THREE.Mesh( geometry, material );

var texture = new THREE.TextureLoader().load( 'img/test.jpg' );
var geometry2 = new THREE.PlaneGeometry(4, 3, 1, 1);
var material2 = new THREE.MeshBasicMaterial( {map:texture, side:THREE.DoubleSide});
var field = new THREE.Mesh(geometry2, material2);
field.rotation.x = 0;

// Add cube to Scene
// scene.add( cube );
scene.add( field );
// Render Loop
var render = function () {
    requestAnimationFrame( render );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    // field.rotation.x += 0.01;
    // field.rotation.y += 0.02;

    // Render the scene
    renderer.render(scene, camera);
};

render();