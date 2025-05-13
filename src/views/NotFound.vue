<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="text-h5">
            404 - 页面未找到
          </v-card-title>
          <v-card-text>
            您访问的页面不存在，请检查URL或返回首页
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" :to="{ name: 'home' }">
              返回首页
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>