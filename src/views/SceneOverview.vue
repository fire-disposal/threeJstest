<template>
  <v-container>
    <!-- 上部场景卡片 -->
    <v-card class="mb-4">
      <v-card-title>
        场景概览
        <v-btn @click="regenerateRoom" class="ml-4" size="small">
          重新生成房间
        </v-btn>
      </v-card-title>
      <v-card-text class="pa-0">
        <canvas ref="sceneCanvas" class="scene-canvas"></canvas>
      </v-card-text>
    </v-card>

    <!-- 下部左右布局 -->
    <v-row>
      <!-- 左侧房间配置 -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>房间配置</v-card-title>
          <v-card-text>
            <v-table>
              <tbody>
                <tr v-for="(row, y) in roomMatrix" :key="y">
                  <td v-for="(cell, x) in row" :key="x">
                    <v-checkbox
                      v-model="roomMatrix[y][x]"
                      :label="`(${x},${y})`"
                      true-value="1"
                      false-value="0"
                      hide-details
                    ></v-checkbox>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 右侧日志目录 -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>日志目录</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="(log, index) in logs"
                :key="index"
                :title="log.title"
                :subtitle="log.date"
              ></v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createScene } from '../utils/sceneManager'

const sceneCanvas = ref(null)
const sceneInstance = ref(null)
const roomMatrix = ref([
  ['1', '1', '1', '1', '1'],
  ['1', '0', '0', '0', '1'],
  ['1', '0', '0', '0', '1'],
  ['1', '0', '0', '0', '1'],
  ['1', '1', '1', '1', '1']
])
const logs = ref([
  { title: '系统启动', date: new Date().toLocaleString() },
  { title: '场景初始化', date: new Date().toLocaleString() },
  { title: '房间模型加载', date: new Date().toLocaleString() }
])

const regenerateRoom = () => {
  if (sceneInstance.value) {
    // 清除旧场景
    while(sceneInstance.value.scene.children.length > 0) {
      sceneInstance.value.scene.remove(sceneInstance.value.scene.children[0])
    }
    
    // 重新生成房间
    sceneInstance.value.createWall(roomMatrix.value.map(row => row.map(cell => parseInt(cell))))
    sceneInstance.value.createFloor(roomMatrix.value.map(row => row.map(cell => parseInt(cell))))
    
    logs.value.push({
      title: '房间重新生成',
      date: new Date().toLocaleString()
    })
  }
}

onMounted(() => {
  if (sceneCanvas.value) {
    sceneInstance.value = createScene(sceneCanvas.value)
  }
})
</script>

<style scoped>
.scene-canvas {
  width: 100%;
  height: 400px;
  display: block;
}
</style>