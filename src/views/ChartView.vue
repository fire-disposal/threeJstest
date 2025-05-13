<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="monitor-card">
          <v-card-title class="text-h6">
            <v-icon left>mdi-heart-pulse</v-icon>
            心率监测
          </v-card-title>
          <div ref="heartChart" class="chart-container"></div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="monitor-card">
          <v-card-title class="text-h6">
            <v-icon left>mdi-run</v-icon>
            活动轨迹
          </v-card-title>
          <div ref="activityChart" class="chart-container"></div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="monitor-card">
          <v-card-title class="text-h6">
            <v-icon left>mdi-bed</v-icon>
            睡眠质量
          </v-card-title>
          <div ref="sleepChart" class="chart-container"></div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="monitor-card">
          <v-card-title class="text-h6">
            <v-icon left>mdi-water-percent</v-icon>
            血压监测
          </v-card-title>
          <div ref="bloodPressureChart" class="chart-container"></div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="monitor-card">
          <v-card-title class="text-h6">
            <v-icon left>mdi-pill</v-icon>
            用药提醒
          </v-card-title>
          <div ref="medicationChart" class="chart-container"></div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="monitor-card">
          <v-card-title class="text-h6">
            <v-icon left>mdi-home-thermometer</v-icon>
            环境监测
          </v-card-title>
          <div ref="environmentChart" class="chart-container"></div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const heartChart = ref(null)
const activityChart = ref(null)
const sleepChart = ref(null)
const bloodPressureChart = ref(null)
const medicationChart = ref(null)
const environmentChart = ref(null)
let heartChartInstance, activityChartInstance, sleepChartInstance,
    bloodPressureChartInstance, medicationChartInstance, environmentChartInstance

function initCharts() {
  // 心率图表
  heartChartInstance = echarts.init(heartChart.value, 'dark')
  heartChartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
    },
    yAxis: { type: 'value', name: '心率(bpm)' },
    series: [{
      name: '心率',
      type: 'line',
      smooth: true,
      data: [72, 68, 75, 80, 78, 76],
      lineStyle: { color: '#00E5FF' },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(0, 229, 255, 0.5)' },
        { offset: 1, color: 'rgba(0, 229, 255, 0.1)' }
      ])}
    }]
  })

  // 活动图表
  activityChartInstance = echarts.init(activityChart.value, 'dark')
  activityChartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: { type: 'value', name: '步数' },
    series: [{
      name: '步数',
      type: 'bar',
      data: [3200, 2800, 4500, 3800, 4200, 5200, 4800],
      itemStyle: { color: '#4CAF50' }
    }]
  })

  // 睡眠图表
  sleepChartInstance = echarts.init(sleepChart.value, 'dark')
  sleepChartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    series: [{
      name: '睡眠质量',
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: 6, name: '深睡眠' },
        { value: 2, name: '浅睡眠' },
        { value: 1, name: '清醒' }
      ],
      itemStyle: {
        color: function(params) {
          const colorList = ['#2196F3', '#00BCD4', '#9C27B0']
          return colorList[params.dataIndex]
        }
      }
    }]
  })

  // 血压图表
  bloodPressureChartInstance = echarts.init(bloodPressureChart.value, 'dark')
  bloodPressureChartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { data: ['收缩压', '舒张压'] },
    xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五'] },
    yAxis: { type: 'value', name: '血压(mmHg)' },
    series: [
      {
        name: '收缩压',
        type: 'line',
        data: [125, 130, 128, 135, 132],
        lineStyle: { color: '#FF5252' }
      },
      {
        name: '舒张压',
        type: 'line',
        data: [80, 82, 78, 85, 83],
        lineStyle: { color: '#FF9800' }
      }
    ]
  })

  // 用药图表
  medicationChartInstance = echarts.init(medicationChart.value, 'dark')
  medicationChartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    series: [{
      name: '用药情况',
      type: 'gauge',
      detail: { formatter: '{value}%', color: '#4CAF50' },
      data: [{ value: 85, name: '按时服药率' }],
      axisLine: {
        lineStyle: {
          color: [
            [0.3, '#FF5252'],
            [0.7, '#FFC107'],
            [1, '#4CAF50']
          ],
          width: 10
        }
      }
    }]
  })

  // 环境图表
  environmentChartInstance = echarts.init(environmentChart.value, 'dark')
  environmentChartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { data: ['温度', '湿度'] },
    xAxis: { type: 'category', data: ['00:00', '06:00', '12:00', '18:00'] },
    yAxis: [
      { type: 'value', name: '温度(℃)', min: 15, max: 35 },
      { type: 'value', name: '湿度(%)', min: 30, max: 80 }
    ],
    series: [
      {
        name: '温度',
        type: 'line',
        data: [22, 24, 28, 26],
        lineStyle: { color: '#FF5722' }
      },
      {
        name: '湿度',
        type: 'line',
        yAxisIndex: 1,
        data: [45, 50, 60, 55],
        lineStyle: { color: '#03A9F4' }
      }
    ]
  })
}

function handleResize() {
  heartChartInstance?.resize()
  activityChartInstance?.resize()
  sleepChartInstance?.resize()
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  heartChartInstance?.dispose()
  activityChartInstance?.dispose()
  sleepChartInstance?.dispose()
  bloodPressureChartInstance?.dispose()
  medicationChartInstance?.dispose()
  environmentChartInstance?.dispose()
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
}

.monitor-card {
  height: 100%;
  transition: transform 0.3s;
}

.monitor-card:hover {
  transform: translateY(-5px);
}
</style>