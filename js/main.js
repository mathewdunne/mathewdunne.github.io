import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js'
//import * as CANNON from '../node_modules/cannon/cannon-es.js'
import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js'
import {DragControls} from '../node_modules/three/examples/jsm/controls/DragControls.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.setX(-65)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg")
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)


renderer.render(scene, camera)

const backgroundTexture = new THREE.TextureLoader().load('../assets/space.jpg')
scene.background = backgroundTexture

// set up shape
const icoGeometry = new THREE.IcosahedronGeometry(20, 0)
const icoMaterial = new THREE.MeshStandardMaterial({color: 0x46d4a2})
const ico = new THREE.Mesh(icoGeometry, icoMaterial)
scene.add(ico)

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
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = false;

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

// move camera down when scrolling
//document.body.onscroll = moveCamera

function moveCamera() {
  const t = document.body.getBoundingClientRect().top
  camera.position.z = 30 + t*-0.1
  //update shape and light positions
  ico.position.z = t*-0.1
  for (let i=0; i < pointLightArray.length; i++) {
    var offset = (i%2 > 0 == 0 ? positionFactor : -1*positionFactor)
    pointLightArray[i].position.z = offset + t*-0.1
  }
}




// main animation loop
var a = 0
function animate() {
  requestAnimationFrame(animate)

  //animations go here
  ico.rotation.x += 0.003
  ico.rotation.y += 0.001
  ico.rotation.z += 0.005

  camera.position.x += 0.07*Math.sin(a)
  camera.position.z += 0.07*Math.cos(a)
  camera.lookAt([0, 0, 0])

  if (a==360) {
    a = 0
  } else {
    a += 0.001
  }
  
  
  //update controls
  controls.update()


  renderer.render(scene, camera)
}

// call animation function
animate()
