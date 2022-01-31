import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js' //'./three-module.js'
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.19.0' //'./cannon-es.js'
import {OrbitControls} from  'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js'//'./OrbitControls.js'

let mode = "SPACE"
const scene = new THREE.Scene()
const fov = 75
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth/window.innerHeight, 0.1, 1000)
const orbitRadius = 70
let orbitAngle = 0
const orbitSpeed = 0.002
camera.position.setX(-1*orbitRadius)

let clock = new THREE.Clock()
let delta = 0
let fps = 30
let interval = 1/fps



// window.onload = function() {
//   console.log("loaded")
//   var canvas = document.getElementById("myCanvas");
//   var ctx = canvas.getContext("2d");
//   ctx.font = "30px Comic Sans MS";
//   ctx.fillStyle = "red";
//   ctx.textAlign = "center";
//   ctx.fillText("Hello World", canvas.width/2, canvas.height/2);
// };





















const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#mainCanvas")
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)

switch (mode) {
  case "SPACE": initSpaceWorld(); break;
  case "BALLS": initBouncingBalls(); break;
}

function initSpaceWorld() {
  const backgroundTexture = new THREE.TextureLoader().load('../assets/img/space.jpg')
  scene.background = backgroundTexture

  globalThis.world = new CANNON.World()

  globalThis.screenMidx = window.innerWidth/2
  globalThis.screenMidy = window.innerHeight/2

  // set up shape
  const icoGeometry = new THREE.IcosahedronGeometry(20, 0)
  const icoMaterial = new THREE.MeshStandardMaterial({color: 0x46d4a2})
  globalThis.ico = new THREE.Mesh(icoGeometry, icoMaterial)
  const icoBodyShape = new CANNON.Sphere(1)
  globalThis.icoBody = new CANNON.Body({
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
  globalThis.ambientLight = new THREE.AmbientLight(0xfffff, 0.4)
  scene.add(ambientLight)

  // orbit controls
  globalThis.orbitControls = new OrbitControls(camera, renderer.domElement)
  orbitControls.enableZoom = false;

  const starGeometry = new THREE.SphereGeometry(0.25, 24, 24)
  const starMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF})

  for (let i=0; i<200; i++) {
    addStar(starGeometry, starMaterial)
  }
}

function initBouncingBalls() {
  const backgroundTexture = new THREE.TextureLoader().load('')
  scene.background = backgroundTexture
  camera.position.x = -40
  globalThis.ballSize = 2

  globalThis.world = new CANNON.World()

  globalThis.screenMidx = window.innerWidth/2
  globalThis.screenMidy = window.innerHeight/2

  // set up bounding box
  globalThis.boxHeight = (-1*camera.position.x) / Math.tan(Math.PI/180 * fov/2)*1.1
  globalThis.boxWidth = boxHeight * window.innerWidth / window.innerHeight

  const wallGeometry = new THREE.BoxGeometry(1, boxHeight, 1)
  const wallMaterial = new THREE.MeshStandardMaterial({color: 0xffffff})
  const wallBodyShape = new CANNON.Box(new CANNON.Vec3(1, boxHeight, 1))

  const roofGeometry = new THREE.BoxGeometry(1, 1, boxWidth)
  const roofBodyShape = new CANNON.Box(new CANNON.Vec3(1, 1, boxWidth))
  
  // left wall
  globalThis.leftWall = new THREE.Mesh(wallGeometry, wallMaterial)
  globalThis.leftWallBody = new CANNON.Body({type: CANNON.Body.KINEMATIC})
  leftWallBody.addShape(wallBodyShape)
  leftWallBody.position = new CANNON.Vec3(0, 0, boxWidth/-2)
  scene.add(leftWall)
  world.addBody(leftWallBody)
  leftWall.position.copy(leftWallBody.position)

  // right wall
  globalThis.rightWall = new THREE.Mesh(wallGeometry, wallMaterial)
  globalThis.rightWallBody = new CANNON.Body({type: CANNON.Body.KINEMATIC})
  rightWallBody.addShape(wallBodyShape)
  rightWallBody.position = new CANNON.Vec3(0, 0, boxWidth/2)
  scene.add(rightWall)
  world.addBody(rightWallBody)
  rightWall.position.copy(rightWallBody.position)

  // roof
  globalThis.roof = new THREE.Mesh(roofGeometry, wallMaterial)
  globalThis.roofBody = new CANNON.Body({type: CANNON.Body.KINEMATIC})
  roofBody.addShape(roofBodyShape)
  roofBody.position = new CANNON.Vec3(0, boxHeight/2, 0)
  scene.add(roof)
  world.addBody(roofBody)
  roof.position.copy(roofBody.position)

  // floor
  globalThis.floor = new THREE.Mesh(roofGeometry, wallMaterial)
  globalThis.floorBody = new CANNON.Body({type: CANNON.Body.KINEMATIC})
  floorBody.addShape(roofBodyShape)
  floorBody.position = new CANNON.Vec3(0, boxHeight/-2, 0)
  scene.add(floor)
  world.addBody(floorBody)
  floor.position.copy(floorBody.position)

  // ambient light
  const ambientLight = new THREE.AmbientLight(0xfffff, 100)
  scene.add(ambientLight)

  // set up point lighting
  const pointLightArray = Array()
  var positionFactor = 30
  var intensity = 1

  // for (let i = 0; i < 8; i++) {
  //   pointLightArray.push(new THREE.PointLight(0xfffff, intensity))

  //   var xval = (i%8 > 3 ? 1 : -1)*positionFactor
  //   var yval = (i%4 > 1 == 0 ? 1 : -1)*positionFactor
  //   var zval = (i%2 > 0 == 0 ? 1 : -1)*positionFactor

  //   pointLightArray[i].position.set(xval, yval, zval)
  //   scene.add(pointLightArray[i])
  // }

    // // point light helpers
    // const lightHelperArray = Array()
    // for (let i = 0; i < pointLightArray.length; i++) {
    //   lightHelperArray.push(new THREE.PointLightHelper(pointLightArray[i]))
    //   scene.add(lightHelperArray[i])
    // }

  // orbit controls
  globalThis.orbitControls = new OrbitControls(camera, renderer.domElement)
  orbitControls.enableZoom = false;

  const ballGeometry = new THREE.SphereGeometry(ballSize, 24, 24)
  const ballMaterial = new THREE.MeshStandardMaterial({color: 0xff0000})

  globalThis.numOfBalls = 50
  globalThis.ballMeshes = []
  globalThis.ballBodies = []
  addBalls(ballGeometry, ballMaterial, numOfBalls);
}

// add "stars"
function addStar(geometry, material) {
  const star = new THREE.Mesh(geometry, material)

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))
  star.position.set(x, y, z)
  scene.add(star)
}

// add balls
function addBalls(geometry, material, number) {
  for (let i=0; i<number; i++) {
    const ballMesh = new THREE.Mesh(geometry, material)

    const yRange = (-1*camera.position.x) / Math.tan(Math.PI/180 * fov/2)
    const zRange = yRange * window.innerWidth / window.innerHeight
    const y = THREE.MathUtils.randFloatSpread(yRange)
    const z = THREE.MathUtils.randFloatSpread(zRange)
    
    const ballBodyShape = new CANNON.Sphere(ballSize)
    const ballBody = new CANNON.Body({mass: 1,})
    ballBody.addShape(ballBodyShape)
    ballBody.linarDamping = 0

    let yVelocity = Math.random() * 2 - 1 // between -1 and 1
    let zVelocity = Math.random() * 2 - 1 // between -1 and 1
    const mag = Math.sqrt(yVelocity*yVelocity + zVelocity*zVelocity)
    globalThis.speedFactor = 10
    yVelocity /= (mag/speedFactor)
    zVelocity /= (mag/speedFactor)
    
    ballBody.position = new CANNON.Vec3(0, y, z)
    ballBody.velocity = new CANNON.Vec3(0, yVelocity, zVelocity)
    
    scene.add(ballMesh)
    ballMeshes.push(ballMesh)
    world.addBody(ballBody)
    ballBodies.push(ballBody)
  }
}

// camera orbit stuff
function orbitCamera() {
  let multiplier = orbitRadius*orbitSpeed
  camera.position.x += multiplier*Math.sin(orbitAngle)
  camera.position.z += multiplier*Math.cos(orbitAngle)
  camera.lookAt([0, 0, 0])

  if (orbitAngle==2*Math.PI) {
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
function onMouseClick(event) {
  if (event.clientY > 80) {
    
    switch (mode) {
      case "SPACE": spinShape(event); break;
      case "BALLS": ballForce(event); break;
    }
    
  }
}
document.addEventListener("click", onMouseClick);

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

// apply "explosion outwards" force to balls
function ballForce(event) {
  console.log("Start")
  for (let i=0; i<numOfBalls; i++) {
    const yBall = ballBodies[i].position.y
    const yClick = -1 * (event.clientY*boxHeight/window.innerHeight - boxHeight/2)

    const zBall = ballBodies[i].position.z
    const zClick = event.clientX*boxWidth/window.innerWidth - boxWidth/2

    let forceFactor = 500
    let length = Math.sqrt(Math.pow(yBall-yClick, 2) + Math.pow(zBall-zClick, 2))
    if (length<1) length = 1
    forceFactor /= length

    const forceVector = new CANNON.Vec3(0, forceFactor/(yBall-yClick), forceFactor/(zBall-zClick))

    // let zVec = (ballBodies[i].position.z) - (event.clientX*boxWidth/window.innerWidth - boxWidth/2)
    console.log(forceVector)

    ballBodies[i].applyImpulse(forceVector)
  }
  
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
    if (mode == "SPACE") {
      orbitCamera();
    }
     
    
    //update controls
    orbitControls.update()

    //update physics
    world.fixedStep()

    // Copy coordinates from cannon.js to three.js
    if (mode == "SPACE") {
      ico.position.copy(icoBody.position)
      ico.quaternion.copy(icoBody.quaternion)
    } else if (mode == "BALLS") {
      for (let i=0; i<numOfBalls; i++) {
        let yV = ballBodies[i].velocity.y
        let zV = ballBodies[i].velocity.z
        const mag = Math.sqrt(yV*yV + zV*zV)

        if (mag < speedFactor) {
          ballBodies[i].velocity.y = yV/(mag/speedFactor)
          ballBodies[i].velocity.z = zV/(mag/speedFactor)
        }

        ballMeshes[i].position.copy(ballBodies[i].position)
        ballMeshes[i].quaternion.copy(ballBodies[i].quaternion)
      }
    }
    


    renderer.render(scene, camera)
    delta = delta % interval
  } 
}

// call animation function
animate()
