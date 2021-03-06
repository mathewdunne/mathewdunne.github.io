import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js' //'./three-module.js'
import * as CANNON from 'https://cdn.skypack.dev/cannon-es@0.19.0' //'./cannon-es.js'
import {OrbitControls} from  'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js'//'./OrbitControls.js'

window.onload = initMode(), scrollDown();
function initMode() {globalThis.mode = ""}
const fov = 75

let clock = new THREE.Clock()
let delta = 0
let fps = 30
let interval = 1/fps

initSpaceWorld()
initBouncingBalls()

function initSpaceWorld() {
  globalThis.spaceScene = new THREE.Scene()
  globalThis.spaceCamera = new THREE.PerspectiveCamera(fov, window.innerWidth/window.innerHeight, 0.1, 1000)
  
  globalThis.orbitRadius = 70
  globalThis.orbitAngle = 0  
  globalThis.orbitSpeed = 0.002
  spaceCamera.position.setX(-1*orbitRadius)

  globalThis.spaceRenderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#mainCanvas")
  })
  spaceRenderer.setPixelRatio(window.devicePixelRatio)
  spaceRenderer.setSize(window.innerWidth, window.innerHeight)
  spaceRenderer.render(spaceScene, spaceCamera)
  
  const backgroundTexture = new THREE.TextureLoader().load('../assets/img/space.jpg')
  spaceScene.background = backgroundTexture

  globalThis.spaceWorld = new CANNON.World()

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
  spaceScene.add(ico)
  spaceWorld.addBody(icoBody)

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
    spaceScene.add(pointLightArray[i])
  }

  // // point light helpers
  // const lightHelperArray = Array()
  // for (let i = 0; i < pointLightArray.length; i++) {
  //   lightHelperArray.push(new THREE.PointLightHelper(pointLightArray[i]))
  //   spaceScene.add(lightHelperArray[i])
  // }

  // //grid helper
  // const gridHelper = new THREE.GridHelper(200, 50)
  // spaceScene.add(gridHelper)

  // ambient light
  globalThis.ambientLight = new THREE.AmbientLight(0xfffff, 0.4)
  spaceScene.add(ambientLight)

  // orbit controls
  globalThis.orbitControls = new OrbitControls(spaceCamera, spaceRenderer.domElement)
  orbitControls.enableZoom = false;

  const starGeometry = new THREE.SphereGeometry(0.25, 24, 24)
  const starMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF})

  for (let i=0; i<200; i++) {
    addStar(starGeometry, starMaterial)
  }
}

function initBouncingBalls() {
  globalThis.ballSize = 3
  globalThis.canvWidth = document.getElementById("ballCanvas").clientWidth;
  globalThis.canvHeight = document.getElementById("ballCanvas").clientHeight;

  globalThis.ballScene = new THREE.Scene()
  globalThis.ballCamera = new THREE.PerspectiveCamera(fov, canvWidth/canvHeight, 0.1, 1000)
  ballCamera.position.setX(-40)
  ballCamera.lookAt(1, 0, 0)


  globalThis.ballRenderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#ballCanvas")
  })
  ballRenderer.setPixelRatio(window.devicePixelRatio*10)
  ballRenderer.render(ballScene, ballCamera)

  globalThis.ballWorld = new CANNON.World()

  // set up bounding box
  globalThis.boxHeight = (-1*ballCamera.position.x) / Math.tan(Math.PI/180 * fov/2)*1.16
  globalThis.boxWidth = boxHeight * canvWidth/canvHeight

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
  ballScene.add(leftWall)
  ballWorld.addBody(leftWallBody)
  leftWall.position.copy(leftWallBody.position)

  // right wall
  globalThis.rightWall = new THREE.Mesh(wallGeometry, wallMaterial)
  globalThis.rightWallBody = new CANNON.Body({type: CANNON.Body.KINEMATIC})
  rightWallBody.addShape(wallBodyShape)
  rightWallBody.position = new CANNON.Vec3(0, 0, boxWidth/2)
  ballScene.add(rightWall)
  ballWorld.addBody(rightWallBody)
  rightWall.position.copy(rightWallBody.position)

  // roof
  globalThis.roof = new THREE.Mesh(roofGeometry, wallMaterial)
  globalThis.roofBody = new CANNON.Body({type: CANNON.Body.KINEMATIC})
  roofBody.addShape(roofBodyShape)
  roofBody.position = new CANNON.Vec3(0, boxHeight/2, 0)
  ballScene.add(roof)
  ballWorld.addBody(roofBody)
  roof.position.copy(roofBody.position)

  // floor
  globalThis.floor = new THREE.Mesh(roofGeometry, wallMaterial)
  globalThis.floorBody = new CANNON.Body({type: CANNON.Body.KINEMATIC})
  floorBody.addShape(roofBodyShape)
  floorBody.position = new CANNON.Vec3(0, boxHeight/-2, 0)
  ballScene.add(floor)
  ballWorld.addBody(floorBody)
  floor.position.copy(floorBody.position)

  // ambient light
  const ambientLight = new THREE.AmbientLight(0xfffff, 1)
  ballScene.add(ambientLight)

  // set up point lighting
  const pointLightArray = Array()
  var positionFactor = 20
  var intensity = 4

  for (let i = 0; i < 4; i++) {
    pointLightArray.push(new THREE.PointLight(0xffffff, intensity))

    var xval = (-10)*positionFactor
    var yval = (i%4 > 1 == 0 ? 1 : -1)*positionFactor
    var zval = (i%2 > 0 == 0 ? 1 : -1)*positionFactor

    pointLightArray[i].position.set(xval, yval, zval)
    ballScene.add(pointLightArray[i])
  }

    // // point light helpers
    // const lightHelperArray = Array()
    // for (let i = 0; i < pointLightArray.length; i++) {
    //   lightHelperArray.push(new THREE.PointLightHelper(pointLightArray[i]))
    //   ballScene.add(lightHelperArray[i])
    // }

  // orbit controls
  globalThis.orbitControls = new OrbitControls(spaceCamera, spaceRenderer.domElement)
  orbitControls.enableZoom = false;

  const ballGeometry = new THREE.SphereGeometry(ballSize, 48, 48)
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
  spaceScene.add(star)
}

// add balls
function addBalls(geometry, material, number) {
  for (let i=0; i<number; i++) {
    const ballMesh = new THREE.Mesh(geometry, material)

    const yRange = boxHeight
    const zRange = boxWidth
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
    
    ballScene.add(ballMesh)
    ballMeshes.push(ballMesh)
    ballWorld.addBody(ballBody)
    ballBodies.push(ballBody)
  }
}

// spaceCamera orbit stuff
function orbitCamera() {
  let multiplier = orbitRadius*orbitSpeed
  spaceCamera.position.x += multiplier*Math.sin(orbitAngle)
  spaceCamera.position.z += multiplier*Math.cos(orbitAngle)
  spaceCamera.lookAt([0, 0, 0])

  if (orbitAngle==2*Math.PI) {
    orbitAngle= 0
  } else {
    orbitAngle += orbitSpeed
  }
}

// when window is resized
function onWindowResize() {
  spaceCamera.aspect = window.innerWidth / window.innerHeight
  spaceCamera.updateProjectionMatrix()
  spaceRenderer.setSize(window.innerWidth, window.innerHeight)
  screenMidx = window.innerWidth/2
  screenMidy = window.innerHeight/2

  globalThis.canvWidth = document.getElementById("ballCanvas").clientWidth;
  globalThis.canvHeight = document.getElementById("ballCanvas").clientHeight;
  ballCamera.updateProjectionMatrix()
}
window.addEventListener('resize', onWindowResize)

function findElementPos(obj){
  var curLeft = 0;
  var curTop = 0;

  if (obj.offsetParent) {
     do {
        curLeft += obj.offsetLeft;
        curTop += obj.offsetTop;
     } while (obj = obj.offsetParent);

     return {X:curLeft,Y:curTop};
  }
}

// on click
function onMouseClick(event) {
  let inDeadZone = false
  let buttonPos = findElementPos(document.getElementById("aboutButton"))

  if (event.clientY < 80) {inDeadZone = true}
  else if (event.clientX > buttonPos["X"] && event.clientX < buttonPos["X"]+133 && event.clientY > buttonPos["Y"] && event.clientY < buttonPos["Y"]+38) {inDeadZone = true}
  
  if (!inDeadZone) {
    
    switch (mode) {
      case "SPACE": spinShape(event); break;
      case "BALLS": ballForce(event); break;
    }
    
  }
}
document.addEventListener("click", onMouseClick);

// function to spin the shape on click by projecting a vector based on the spaceCamera angle and click position
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
  const canvPos = findElementPos(document.getElementById("ballCanvas"))
  canvPos['Y'] -= window.innerHeight // because height is absolute from the top of the main page
  const canvMidY = (canvPos['Y']) + canvHeight/2
  const canvMidZ = canvPos['X'] + canvWidth/2

  const yClick = -1 * ((event.clientY-canvMidY)*boxHeight/canvHeight)
  const zClick = (event.clientX-canvMidZ)*boxWidth/canvWidth

  // if click is in box
  if (Math.abs(yClick) < boxHeight/2 && Math.abs(zClick) < boxWidth/2) {
    for (let i=0; i<numOfBalls; i++) {
  
      const yBall = ballBodies[i].position.y
      
      const zBall = ballBodies[i].position.z
      // console.log("Z Ball: "+zBall)
  
      let forceFactor = 200
      let length = Math.sqrt(Math.pow(yBall-yClick, 2) + Math.pow(zBall-zClick, 2))
      if (length<5) length = 5
      forceFactor /= length
  
      const forceVector = new CANNON.Vec3(0, forceFactor/(yBall-yClick), forceFactor/(zBall-zClick))
  
      ballBodies[i].applyImpulse(forceVector)
    }
  }
  
}

// on scroll
function scrollDown() {
  let scrollPosition = document.body.getBoundingClientRect().top

  var alphaFactor = (Math.max(1 - ((scrollPosition * 100 / window.innerHeight) / 100), 0) - 1)*1.2;
  var ballCanvasOpacity = Math.max(-1*scrollPosition - window.innerHeight/1.3, 0)
  ballCanvasOpacity /= (window.innerHeight*(1-1/1.3))

  const root = document.documentElement
  root.style.setProperty('--alpha1', 0.6 + alphaFactor)
  root.style.setProperty('--alpha2', 0.1 + alphaFactor)
  root.style.setProperty('--alpha3', 1 + alphaFactor)
  root.style.setProperty('--ballCanvasOpacity', ballCanvasOpacity)

  if (scrollPosition > window.innerHeight/-1.3) {
    mode = "SPACE"
  } else {
    mode = "BALLS"
  }
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
    console.log(mode)
     
    
    //update controls
    orbitControls.update()

    //update physics
    spaceWorld.fixedStep()
    ballWorld.fixedStep()

    // Copy coordinates from cannon.js to three.js
    if (mode == "SPACE") {
      ico.position.copy(icoBody.position)
      ico.quaternion.copy(icoBody.quaternion)
    } else {
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
    

    if (mode == "SPACE") {
      spaceRenderer.render(spaceScene, spaceCamera)
    }
    else {
      ballRenderer.render(ballScene, ballCamera)
    }
    
    delta = delta % interval
  } 
}

// call animation function
animate()
