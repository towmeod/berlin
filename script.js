console.clear();

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r124/three.module.min.js';

import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js';

let cols = 60;
let capture;
const s = p => {
  p.setup = function() {
    capture = p.createCapture(p.VIDEO);
    capture.size(80, 80);
    p.pixelDensity(1);
    p.createCanvas(cols, cols);
    render(p);
  };
};

new p5(s);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.z = 40;
camera.lookAt(new THREE.Vector3(0,0,0));

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);

const hemispherelight = new THREE.HemisphereLight( 0xffffff, 0x080808, 1);
scene.add(hemispherelight);

const spotLight = new THREE.SpotLight(0xffffff, 0.5);
spotLight.position.set(50, 50, 100);
spotLight.lookAt(new THREE.Vector3(0,0,0));
scene.add( spotLight );

var textureLoader = new THREE.TextureLoader();

var texture0 = textureLoader.load( 'https://www.mamboleoo.be/CodePen/dices/px.png?v' );
var texture1 = textureLoader.load( 'https://www.mamboleoo.be/CodePen/dices/nx.png?v' );
var texture2 = textureLoader.load( 'https://www.mamboleoo.be/CodePen/dices/py.png?v' );
var texture3 = textureLoader.load( 'https://www.mamboleoo.be/CodePen/dices/ny.png?v' );
var texture4 = textureLoader.load( 'https://www.mamboleoo.be/CodePen/dices/pz.png?v' );
var texture5 = textureLoader.load( 'https://www.mamboleoo.be/CodePen/dices/nz.png?v' );

var textureN0 = textureLoader.load( 'https://www.mamboleoo.be/CodePen/dices/px_n.png?v' );
var textureN1 = textureLoader.load( 'https://www.mamboleoo.be/CodePen/dices/nx_n.png?v' );
var textureN2 = textureLoader.load( 'https://www.mamboleoo.be/CodePen/dices/py_n.png?v' );
var textureN3 = textureLoader.load( 'https://www.mamboleoo.be/CodePen/dices/ny_n.png?v' );
var textureN4 = textureLoader.load( 'https://www.mamboleoo.be/CodePen/dices/pz_n.png?v' );
var textureN5 = textureLoader.load( 'https://www.mamboleoo.be/CodePen/dices/nz_n.png?v' );
var materials = [
    new THREE.MeshPhongMaterial( { shininess: 100, specular: 0xcccccc, transparent: true, normalMap: textureN0, map: texture0 } ),
    new THREE.MeshPhongMaterial( { shininess: 100, specular: 0xcccccc, transparent: true, normalMap: textureN1, map: texture1 } ),
    new THREE.MeshPhongMaterial( { shininess: 100, specular: 0xcccccc, transparent: true, normalMap: textureN2, map: texture2 } ),
    new THREE.MeshPhongMaterial( { shininess: 100, specular: 0xcccccc, transparent: true, normalMap: textureN3, map: texture3 } ),
    new THREE.MeshPhongMaterial( { shininess: 100, specular: 0xcccccc, transparent: true, normalMap: textureN4, map: texture4 } ),
    new THREE.MeshPhongMaterial( { shininess: 100, specular: 0xcccccc, transparent: true, normalMap: textureN5, map: texture5 } )
];

const PI = Math.PI;
const FACES = [
  new THREE.Vector3(0, PI / 2, 0),
  new THREE.Vector3(0, 0, PI),
  new THREE.Vector3(PI / 2, 0, 0),
  new THREE.Vector3(PI / 2, 0, PI),
  new THREE.Vector3(PI, 0, 0),
  new THREE.Vector3(PI / 2, PI / 2, PI / 2)
];

const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
let meshGrid = new THREE.InstancedMesh(geometry, materials, cols * cols);
console.log(meshGrid);
meshGrid.instanceMatrix.setUsage(THREE.DynamicDrawUsage); 
scene.add(meshGrid);

const cubes = []
for (let x = -cols/2; x < cols / 2; x++) {
  for (let y = -cols/2; y < cols / 2; y++) {
    cubes.push({x:0,y:0,z:0});
  }
}

let euler = new THREE.Euler(0, 0, 0, 'XYZ' )
function run (p) {
  p.image(capture, 0, 0, cols, cols);
  p.loadPixels();
  
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < cols; x++) {
      let c = p.color(p.pixels[(y * cols + x) * 4], p.pixels[(y * cols + x) * 4 + 1], p.pixels[(y * cols + x) * 4 + 2]);
      let value = p.brightness(c);
      const index = (y * cols + x);
      let rot = 5 - Math.floor(((value - 1) / 100) * 6);
      rot = Math.min(5, Math.max(rot, 0));
      gsap.to(cubes[index], {
        x: FACES[rot].x,
        y: FACES[rot].y,
        z: FACES[rot].z,
        duration: 0.6,
        ease: 'power1.out'
      });
    }
  }
  
  let i = 0;
  const offset = (cols - 1) / 2;
  const matrix = new THREE.Matrix4();
  for (let x = 0; x < cols; x ++) {
    for (let y = 0; y < cols; y ++) {
        const index = (y * cols + x);
      
        euler.x = cubes[index].x;
        euler.y = cubes[index].y;
        euler.z = cubes[index].z;
        matrix.makeRotationFromEuler(euler);
        matrix.setPosition(offset - x, offset - y, 0);

        meshGrid.setMatrixAt(i, matrix );
        i ++;
    }
  }
  
  meshGrid.instanceMatrix.needsUpdate = true;
}

function render(p) {
  requestAnimationFrame(() => render(p));
  renderer.render(scene, camera);
  run(p);
}
window.addEventListener('resize', windowResized);
function windowResized() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}