<template>
  <v-card>
    <v-card-title>数据图表</v-card-title>
    <div ref="chart" class="chart-container"></div>
  </v-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const chart = ref(null)
let myChart

function initChart() {
  myChart = echarts.init(chart.value, 'dark')
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['销量', '增长率']
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: [
      {
        type: 'value',
        name: '销量'
      },
      {
        type: 'value', 
        name: '增长率'
      }
    ],
    series: [
      {
        name: '销量',
        type: 'line',
        smooth: true,
        data: [150, 230, 224, 218, 135, 147]
      },
      {
        name: '增长率',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7]
      }
    ]
  }

  myChart.setOption(option)
}

function handleResize() {
  myChart?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  myChart?.dispose()
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 500px;
}
</style>