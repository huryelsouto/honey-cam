const brandImagePath = "../brands/Hikvision.png";  // Define this variable as needed
const brandImageWidth = 600; // Define this variable as needed
const rtspAddress = "";     // Define this variable as needed
const userName = "";        // Define this variable as needed

document.getElementById('brand_image').src = brandImagePath;
document.getElementById('brand_image').width = brandImageWidth;
document.getElementById('rtspAddress').innerText = rtspAddress;
document.getElementById('userName').innerText = userName;

import * as THREE from 'three';

let camera, scene, renderer;
let lon = 0, lat = 0, phi = 0, theta = 0;
let onPointerDownPointerX = 0, onPointerDownPointerY = 0;
let onPointerDownLon = 0, onPointerDownLat = 0;
const imgPath = '../images/img.png';  // Define the image path
const distance = 50;

let xRotationAngle = 1;  // Define this variable as needed
let yRotationAngle = 1;  // Define this variable as needed
let timeout = 20;         // Define this variable as needed
let width = 1;           // Define this variable as needed
let height = 1;          // Define this variable as needed
let zoomRatio = 1;       // Define this variable as needed

init();
animate();

function init() {
    const container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
    scene = new THREE.Scene();

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const texture = new THREE.TextureLoader().load(imgPath);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth * width, window.innerHeight * height);
    container.appendChild(renderer.domElement);

    document.addEventListener('pointerdown', onPointerDown);
    document.getElementById('up').addEventListener('click', rotateUp);
    document.getElementById('down').addEventListener('click', rotateDown);
    document.getElementById('left').addEventListener('click', rotateLeft);
    document.getElementById('right').addEventListener('click', rotateRight);
    document.getElementById('zoom-in').addEventListener('click', zoomIn);
    document.getElementById('zoom-out').addEventListener('click', zoomOut);
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * width, window.innerHeight * height);
}

function onPointerDown(event) {
    onPointerDownLon = lon;
    onPointerDownLat = lat;
}

function rotateRight() {
    setTimeout(() => {
        lon = xRotationAngle + onPointerDownLon;
    }, timeout);
}

function rotateLeft() {
    setTimeout(() => {
        lon = -xRotationAngle + onPointerDownLon;
    }, timeout);
}

function rotateUp() {
    setTimeout(() => {
        lat = -yRotationAngle + onPointerDownLat;
    }, timeout);
}

function rotateDown() {
    setTimeout(() => {
        lat = yRotationAngle + onPointerDownLat;
    }, timeout);
}

function zoomIn() {
    setTimeout(() => {
        const fov = camera.fov + -zoomRatio * 5;
        camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
        camera.updateProjectionMatrix();
    }, timeout);
}

function zoomOut() {
    setTimeout(() => {
        const fov = camera.fov + zoomRatio * 5;
        camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
        camera.updateProjectionMatrix();
    }, timeout);
}

function animate() {
    requestAnimationFrame(animate);
    update();
}

function update() {
    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);
    camera.position.x = distance * Math.sin(phi) * Math.cos(theta);
    camera.position.y = distance * Math.cos(phi);
    camera.position.z = distance * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
}
