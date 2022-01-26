import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js'
import * as CANNON from '../node_modules/cannon/cannon-es.js'
import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.setX(-65)

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
const icoBodyShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1))
var icoBody = new CANNON.Body({
  mass: 1,
})
icoBody.addShape(icoBodyShape)
// icoBody.angularVelocity.set(10, 10, 10)
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

function orbitCamera() {
  camera.position.x += 0.07*Math.sin(a)
  camera.position.z += 0.07*Math.cos(a)
  camera.lookAt([0, 0, 0])
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
  console.log("clientX: " + event.clientX + " - clientY: " + event.clientY)
  const torqueFactor = 120
  let yVec = screenMidx - event.clientX
  let zVec = screenMidy - event.clientY
  const mag = Math.sqrt(yVec*yVec + zVec*zVec)
  yVec /= mag
  zVec/= mag

  const torque = new CANNON.Vec3(0, yVec*torqueFactor, zVec*torqueFactor)
  icoBody.applyTorque(torque)
}

document.addEventListener("click", printMousePos);

// main animation loop
var a = 0
function animate() {
  requestAnimationFrame(animate)

  //animations go here
  orbitCamera()

  if (a==360) {
    a = 0
  } else {
    a += 0.001
  }
  
  
  //update controls
  orbitControls.update()

  //update physics
  world.fixedStep()
  // Copy coordinates from cannon.js to three.js
  ico.position.copy(icoBody.position)
  ico.quaternion.copy(icoBody.quaternion)


  renderer.render(scene, camera)
}

// call animation function
animate()
