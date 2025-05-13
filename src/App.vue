<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
      :width="rail ? 56 : 240"
    >
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-menu"
          :title="rail ? '' : '菜单'"
          value="menu"
          @click.stop="rail = !rail"
        ></v-list-item>
        
        <v-divider></v-divider>

        <v-list-item
          v-for="route in menuRoutes"
          :key="route.name"
          :prepend-icon="route.meta.icon"
          :title="rail ? '' : route.meta.title"
          :value="route.name"
          :to="{ name: route.name }"
          active-class="text-primary"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="main-container">
        <router-view v-slot="{ Component, route }">
          <v-progress-linear
            v-if="route.meta.loading"
            indeterminate
            color="primary"
            class="mb-4"
          ></v-progress-linear>
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import '@mdi/font/css/materialdesignicons.css'

const router = useRouter()
const drawer = ref(true)
const rail = ref(window.innerWidth < 960)

const menuRoutes = computed(() => {
  return router.getRoutes().filter(route => route.meta.showInMenu)
})

watch(
  () => router.currentRoute.value,
  (to) => {
    if (window.innerWidth < 960) {
      rail.value = true
    }
  }
)

window.addEventListener('resize', () => {
  rail.value = window.innerWidth < 960
})
</script>

<style scoped>
.v-navigation-drawer {
  position: fixed;
  z-index: 100;
  transition: all 0.3s ease;
}

.v-main {
  min-height: 100vh;
  transition: padding-left 0.3s ease;
}

.main-container {
  padding: 16px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.text-primary {
  color: rgb(var(--v-theme-primary)) !important;
}

@media (max-width: 960px) {
  .v-navigation-drawer {
    width: 56px !important;
  }
  .v-main {
    padding-left: 56px !important;
  }
}
</style>