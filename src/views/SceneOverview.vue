<template>
  <v-container>
    <v-row>
      <v-col cols="8">
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
            <div v-if="loading" class="loading-message">场景加载中...</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-row>
          <v-col cols="12">
            <v-card class="monitor-card">
              <v-card-title class="d-flex align-center">
                <v-icon left>mdi-devices</v-icon>
                设备状态监控
              </v-card-title>
              <v-card-text style="overflow-y: auto; max-height: 300px;">
                <v-list density="compact">
                  <v-list-item v-for="device in devices" :key="device.id">
                    <template v-slot:prepend>
                      <v-icon :color="device.online ? 'green' : 'red'" size="small">
                        mdi-circle
                      </v-icon>
                    </template>
                    <v-list-item-title>{{ device.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ device.online ? "在线" : "离线" }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card class="monitor-card">
              <v-card-title class="d-flex align-center">
                <v-icon left>mdi-chart-pie</v-icon>
                活动状态分析
              </v-card-title>
              <v-card-text>
                <div ref="pieChart" style="width: 100%; height: 300px;"></div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { createScene } from '../utils/sceneManager'
import * as echarts from 'echarts'

const devices = ref([
  { id: 1, name: '卧室温湿度传感器', online: true },
  { id: 2, name: '客厅人体传感器', online: true },
  { id: 3, name: '厨房烟雾报警器', online: false },
  { id: 4, name: '卫生间跌倒检测', online: true },
  { id: 5, name: '智能床垫传感器', online: true },
  { id: 6, name: '门窗磁传感器', online: true },
  { id: 7, name: '燃气泄漏报警器', online: true },
  { id: 8, name: '水浸传感器', online: false },
  { id: 9, name: '紧急按钮', online: true },
  { id: 10, name: '智能插座', online: true },
  { id: 11, name: '智能灯泡', online: false },
])

const sceneCanvas = ref(null)
const sceneInstance = ref(null)
const loading = ref(true)
const error = ref(null)
const timelineChart = ref(null)
const pieChart = ref(null)
let timelineChartInstance
let pieChartInstance

function initCharts() {
  nextTick(() => {
    // 初始化饼图
    if (pieChart.value) {
      pieChartInstance = echarts.init(pieChart.value)
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '活动状态',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 35, name: '站立' },
              { value: 30, name: '久坐' },
              { value: 25, name: '睡眠' },
              { value: 10, name: '活动' }
            ]
          }
        ]
      }
      pieChartInstance.setOption(option)
    }
  })
}


function handleResize() {
  timelineChartInstance?.resize()
}

onMounted(async () => {
  await nextTick()

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
    console.log('开始初始化3D场景...')
    sceneInstance.value = await Promise.resolve(createScene(sceneCanvas.value))
    console.log('3D场景初始化成功')
    error.value = null
  } catch (err) {
    console.error('场景初始化失败:', err)
    error.value = `错误：${err.message}`
    // 确保错误时也更新loading状态
    loading.value = false
    return
  }

  // 成功时更新loading状态
  loading.value = false
  console.log('场景加载完成，loading状态已更新')

  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (sceneInstance.value?.cleanup) {
    sceneInstance.value.cleanup()
    console.log('3D场景资源已清理')
  }
  window.removeEventListener('resize', handleResize)
  timelineChartInstance?.dispose()
  pieChartInstance?.dispose()
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

.monitor-card {
  background: white;
  transition: transform 0.3s;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.monitor-card:hover {
  transform: translateY(-5px);
}
</style>
