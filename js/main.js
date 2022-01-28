import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js' //'./three-module.js'
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.19.0' //'./cannon-es.js'
import {OrbitControls} from  'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js'//'./OrbitControls.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
const orbitRadius = 70
camera.position.setX(-1*orbitRadius)

let clock = new THREE.Clock()
let delta = 0
let fps = 60
let interval = 1/fps

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg")
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)


renderer.render(scene, camera)

const backgroundTexture = new THREE.TextureLoader().load('../assets/img/space.jpg')
scene.background = backgroundTexture

const world = new CANNON.World()

let screenMidx = window.innerWidth/2
let screenMidy = window.innerHeight/2

// set up shape
const icoGeometry = new THREE.IcosahedronGeometry(20, 0)
const icoMaterial = new THREE.MeshStandardMaterial({color: 0x46d4a2})
const ico = new THREE.Mesh(icoGeometry, icoMaterial)
const icoBodyShape = new CANNON.Sphere(1)
var icoBody = new CANNON.Body({
  mass: 1,
})
icoBody.addShape(icoBodyShape)
icoBody.angularDamping = 0.3
scene.add(ico)
world.addBody(icoBody)

// set up point lighting
const pointLightArray = Array()
var positionFactor = 18
var intensity = 0.8

for (let i = 0; i < 8; i++) {
  pointLightArray.push(new THREE.PointLight(0xfffff, intensity))

  var xval = (i%8 > 3 ? 1 : -1)*positionFactor
  var yval = (i%4 > 1 == 0 ? 1 : -1)*positionFactor
  var zval = (i%2 > 0 == 0 ? 1 : -1)*positionFactor

  pointLightArray[i].position.set(xval, yval, zval)
  scene.add(pointLightArray[i])
}

// // point light helpers
// const lightHelperArray = Array()
// for (let i = 0; i < pointLightArray.length; i++) {
//   lightHelperArray.push(new THREE.PointLightHelper(pointLightArray[i]))
//   scene.add(lightHelperArray[i])
// }

// //grid helper
// const gridHelper = new THREE.GridHelper(200, 50)
// scene.add(gridHelper)

// ambient light
const ambientLight = new THREE.AmbientLight(0xfffff, 0.4)
scene.add(ambientLight)

// orbit controls
const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.enableZoom = false;


// add "stars"
function addStar(geometry, material) {
  const star = new THREE.Mesh(geometry, material)

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))
  star.position.set(x, y, z)
  scene.add(star)
}
const starGeometry = new THREE.SphereGeometry(0.25, 24, 24)
const starMaterial = new THREE.MeshStandardMaterial({color: 0xfffff})

for (let i=0; i<200; i++) {
  addStar(starGeometry, starMaterial)
}

// camera orbit stuff
let orbitAngle = 0
const orbitSpeed = 0.002
function orbitCamera() {
  let multiplier = orbitRadius*orbitSpeed
  camera.position.x += multiplier*Math.sin(orbitAngle)
  camera.position.z += multiplier*Math.cos(orbitAngle)
  camera.lookAt([0, 0, 0])

  if (orbitAngle==360) {
    orbitAngle= 0
  } else {
    orbitAngle += orbitSpeed
  }
}

// when window is resized
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  screenMidx = window.innerWidth/2
  screenMidy = window.innerHeight/2
}
window.addEventListener('resize', onWindowResize)

// on click
function printMousePos(event) {
  if (event.clientY > 80) {
    spinShape(event)
  }
}
document.addEventListener("click", printMousePos);

// function to spin the shape on click by projecting a vector based on the camera angle and click position
function spinShape(event) {
  const torqueFactor = 120
  let xVec = (screenMidy - event.clientY) * Math.sin(orbitAngle)
  let yVec = screenMidx - event.clientX
  let zVec = (screenMidy - event.clientY) * Math.cos(orbitAngle)
  const mag = Math.sqrt(xVec*xVec + yVec*yVec + zVec*zVec)
  xVec /= mag
  yVec /= mag
  zVec/= mag

  const torque = new CANNON.Vec3(xVec*torqueFactor, yVec*torqueFactor, zVec*torqueFactor)
  icoBody.applyTorque(torque)
}

// on scroll
function scrollDown() {
  const x = document.body.getBoundingClientRect().top
  console.log(x)
  ambientLight.intensity =0.4 + x*0.001
}
document.body.onscroll = scrollDown;

// main animation loop
function animate() {
  requestAnimationFrame(animate)
  delta += clock.getDelta()

  if (delta > interval) {
    //animations go here
    orbitCamera()  
    
    //update controls
    orbitControls.update()

    //update physics
    world.fixedStep()
    // Copy coordinates from cannon.js to three.js
    ico.position.copy(icoBody.position)
    ico.quaternion.copy(icoBody.quaternion)


    renderer.render(scene, camera)
    delta = delta % interval
  } 
}

// call animation function
animate()
