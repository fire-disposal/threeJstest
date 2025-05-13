import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

// 模型配置
const modelConfig = {
  devices: {
    elderly: {
      modelPath: '/models/elderly.glb',
      scale: 0.8,
      animations: {
        walk: 'walkAnimation',
        sit: 'sitAnimation'
      }
    },
    sensor_motion: {
      modelPath: '/models/sensor_motion.glb',
      scale: 0.5
    },
    sensor_fall: {
      modelPath: '/models/sensor_fall.glb', 
      scale: 0.7
    }
  }
}

// 模型缓存
const modelCache = new Map()

export class ModelLoader {
  constructor() {
    this.loader = new GLTFLoader()
    
    // 设置DRACO解码器
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
    this.loader.setDRACOLoader(dracoLoader)
  }

  // 加载模型
  async loadModel(deviceType) {
    const config = modelConfig.devices[deviceType]
    if (!config) {
      throw new Error(`Unknown device type: ${deviceType}`)
    }

    // 检查缓存
    if (modelCache.has(deviceType)) {
      return modelCache.get(deviceType).clone()
    }

    // 加载新模型
    return new Promise((resolve, reject) => {
      this.loader.load(
        config.modelPath,
        (gltf) => {
          const model = this.processModel(gltf, config)
          modelCache.set(deviceType, model)
          resolve(model.clone())
        },
        undefined,
        (error) => reject(error)
      )
    })
  }

  // 处理加载的模型
  processModel(gltf, config) {
    const model = gltf.scene
    model.scale.set(config.scale, config.scale, config.scale)
    
    // 处理动画
    if (config.animations && gltf.animations.length > 0) {
      model.userData.animations = {}
      const mixer = new THREE.AnimationMixer(model)
      
      for (const [name, clipName] of Object.entries(config.animations)) {
        const clip = THREE.AnimationClip.findByName(gltf.animations, clipName)
        if (clip) {
          model.userData.animations[name] = mixer.clipAction(clip)
        }
      }
      
      model.userData.mixer = mixer
    }
    
    return model
  }

  // 预加载所有模型
  preloadModels() {
    return Promise.all(
      Object.keys(modelConfig.devices).map(type => this.loadModel(type)))}
}