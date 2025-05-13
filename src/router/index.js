import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChartView from '../views/ChartView.vue'
import SceneOverview from '../views/SceneOverview.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: '首页',
      icon: 'mdi-home',
      showInMenu: true
    }
  },
  {
    path: '/overview',
    name: 'overview',
    component: SceneOverview,
    meta: {
      title: '场景概览',
      icon: 'mdi-view-dashboard',
      showInMenu: true
    }
  },
  {
    path: '/chart',
    name: 'chart',
    component: ChartView,
    meta: {
      title: '图表',
      icon: 'mdi-chart-line',
      showInMenu: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '404',
      showInMenu: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'ThreeJS Vue App'
  next()
})

export default router