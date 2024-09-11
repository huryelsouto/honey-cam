import * as THREE from 'three';
import { readJson } from '../js/utils/json-manipulator.js';

fetch('/api/router.php/auth', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
})
    .then(result => {
        if (!result.ok) {
            window.location.href = '../index.html';
        }
        return result.json();
    })
    .then(data => {
        document.getElementById('userName').innerText = data.username;
    })
    .catch(error => console.error("Error: " + error));

const camConfigs = await readJson('../config/cam-picture.json');
const brandConfigs = await readJson('../config/brand.json');

const brandImagePath = brandConfigs.brandImagePath;  // Define this variable as needed
const brandImageWidth = brandConfigs.brandImageWidth; // Define this variable as needed
const rtspAddress = camConfigs.rtspAddress;     // Define this variable as needed

document.getElementById('brand_image').src = brandImagePath;
document.getElementById('brand_image').style.width = brandImageWidth;
document.getElementById('rtspAddress').innerText = rtspAddress;


let camera, scene, renderer;
let lon = 0, lat = 0, phi = 0, theta = 0;
let onPointerDownPointerX = 0, onPointerDownPointerY = 0;
let onPointerDownLon = 0, onPointerDownLat = 0;
const imgPath = camConfigs.imgPath;  // Define the image path
const distance = 50;

let xRotationAngle = camConfigs.xRotationAngle;  // Define this variable as needed
let yRotationAngle = camConfigs.yRotationAngle;  // Define this variable as needed
let timeout = camConfigs.timeout;         // Define this variable as needed
let width = camConfigs.width;           // Define this variable as needed
let height = camConfigs.height;          // Define this variable as needed
let zoomRatio = camConfigs.zoomRatio;       // Define this variable as needed

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
