//setup
const canvas = document.getElementById("gameCanvas");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene ();
scene.backhground = new THREE.Color(0x111111);

const camera = new THREE
