<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="7">
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
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="monitor-card">
          <v-card-title class="text-h6">
            <v-icon left>mdi-heart-pulse</v-icon>
            心率监测
          </v-card-title>
          <div ref="heartChart" class="chart-container"></div>
        </v-card>

        <v-card class="monitor-card mt-4">
          <v-card-title class="text-h6">
            <v-icon left>mdi-run</v-icon>
            活动轨迹
          </v-card-title>
          <div ref="activityChart" class="chart-container"></div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { createScene } from '../utils/sceneManager'
import * as echarts from 'echarts'

const sceneCanvas = ref(null)
const sceneInstance = ref(null)
const loading = ref(true)
const error = ref(null)
const heartChart = ref(null)
const activityChart = ref(null)
let heartChartInstance, activityChartInstance

function initCharts() {
  // 心率图表
  heartChartInstance = echarts.init(heartChart.value)
  heartChartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#eee',
      textStyle: { color: '#333' }
    },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      axisLine: { lineStyle: { color: '#666' } },
      axisLabel: { color: '#666' }
    },
    yAxis: {
      type: 'value',
      name: '心率(bpm)',
      axisLine: { lineStyle: { color: '#666' } },
      axisLabel: { color: '#666' }
    },
    series: [{
      name: '心率',
      type: 'line',
      smooth: true,
      data: [72, 68, 75, 80, 78, 76],
      lineStyle: { color: '#2196F3', width: 3 },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(33, 150, 243, 0.3)' },
        { offset: 1, color: 'rgba(33, 150, 243, 0.1)' }
      ])}
    }]
  })

  // 活动图表
  activityChartInstance = echarts.init(activityChart.value)
  activityChartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#eee',
      textStyle: { color: '#333' }
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { lineStyle: { color: '#666' } },
      axisLabel: { color: '#666' }
    },
    yAxis: {
      type: 'value',
      name: '步数',
      axisLine: { lineStyle: { color: '#666' } },
      axisLabel: { color: '#666' }
    },
    series: [{
      name: '步数',
      type: 'bar',
      data: [3200, 2800, 4500, 3800, 4200, 5200, 4800],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#4CAF50' },
          { offset: 1, color: '#8BC34A' }
        ]),
        borderRadius: [4, 4, 0, 0]
      }
    }]
  })
}

function handleResize() {
  heartChartInstance?.resize()
  activityChartInstance?.resize()
}

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

  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (sceneInstance.value?.cleanup) {
    sceneInstance.value.cleanup()
    console.log('3D场景资源已清理')
  }
  window.removeEventListener('resize', handleResize)
  heartChartInstance?.dispose()
  activityChartInstance?.dispose()
})
</script>

<style scoped>
.scene-canvas {
  width: 100%;
  height: 600px;
  display: block;
  background: #1e1e1e;
}

.error-message {
  color: #ff5252;
  padding: 1rem;
  text-align: center;
  font-weight: bold;
}

.loading-message {
  color: #ffc107;
  padding: 1rem;
  text-align: center;
}

.chart-container {
  width: 100%;
  height: 280px;
  padding: 8px;
}

.monitor-card {
  background: white;
  transition: transform 0.3s;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.monitor-card:hover {
  transform: translateY(-5px);
}
</style>