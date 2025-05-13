<template>
  <v-container>
    <v-card>
      <v-card-title>数字孪生居家老年人监护系统</v-card-title>
      <v-card-text class="pa-0">
        <canvas
          ref="sceneCanvas"
          class="scene-canvas"
          :style="{ border: loading ? '2px solid orange' : 'none' }"
        ></canvas>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <div v-if="loading" class="loading-message">
          场景加载中...
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { createScene } from '../utils/sceneManager'

const sceneCanvas = ref(null)
const sceneInstance = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(() => {
  nextTick(() => {
    if (!sceneCanvas.value) {
      error.value = '错误：未找到Canvas元素'
      loading.value = false
      return
    }

    console.log('Canvas尺寸:',
      sceneCanvas.value.clientWidth,
      sceneCanvas.value.clientHeight
    )

    try {
      sceneInstance.value = createScene(sceneCanvas.value)
      console.log('3D场景初始化成功')
      error.value = null
    } catch (err) {
      console.error('场景初始化失败:', err)
      error.value = `错误：${err.message}`
    } finally {
      loading.value = false
    }
  })
})
</script>

<style scoped>
.scene-canvas {
  width: 100%;
  height: 600px;
  display: block;
  background: #f0f0f0;
}

.error-message {
  color: red;
  padding: 1rem;
  text-align: center;
  font-weight: bold;
}

.loading-message {
  color: orange;
  padding: 1rem;
  text-align: center;
}
</style>