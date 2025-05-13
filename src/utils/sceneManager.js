import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 房间配置
const ROOM_CONFIG = {
  wallHeight: 2.5,
  wallThickness: 0.2,
  floorThickness: 0.1,
  wallColor: 0x4a7dff, // 蓝色墙体
  floorColor: 0x8b4513, // 棕色地板
  gridSize: 1.0 // 每个网格单位大小
}

// 根据矩阵创建墙体
function createWall(matrix, scene) {
  const group = new THREE.Group()
  
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === 1) { // 1表示墙体
        const wallGeometry = new THREE.BoxGeometry(
          ROOM_CONFIG.wallThickness,
          ROOM_CONFIG.wallHeight,
          ROOM_CONFIG.gridSize
        )
        const wallMaterial = new THREE.MeshStandardMaterial({
          color: ROOM_CONFIG.wallColor,
          roughness: 0.7
        })
        const wall = new THREE.Mesh(wallGeometry, wallMaterial)
        wall.position.set(
          (x - matrix[y].length/2) * ROOM_CONFIG.gridSize,
          ROOM_CONFIG.wallHeight/2,
          (y - matrix.length/2) * ROOM_CONFIG.gridSize
        )
        group.add(wall)
      }
    }
  }
  
  scene.add(group)
  return group
}

// 创建地板
function createFloor(matrix, scene) {
  const floorGeometry = new THREE.BoxGeometry(
    matrix[0].length * ROOM_CONFIG.gridSize,
    ROOM_CONFIG.floorThickness,
    matrix.length * ROOM_CONFIG.gridSize
  )
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: ROOM_CONFIG.floorColor,
    roughness: 0.9
  })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.position.set(
    0,
    -ROOM_CONFIG.floorThickness/2,
    0
  )
  scene.add(floor)
  return floor
}

export function createScene(canvas) {
  // 创建场景
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)

  // 创建相机
  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  )
  camera.position.set(5, 5, 5)
  camera.lookAt(0, 0, 0)

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  })
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)

  // 添加控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 10, 7)
  scene.add(directionalLight)

  // 示例房间矩阵 (1表示墙体，0表示空间)
  const roomMatrix = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1]
  ]

  // 创建房间
  createWall(roomMatrix, scene)
  createFloor(roomMatrix, scene)

  // 动画循环
  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // 响应式调整
  window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  })

  return {
    scene,
    camera,
    renderer,
    controls,
    createWall,
    createFloor
  }
}