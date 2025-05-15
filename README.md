# Three.js Vue 3D场景应用

基于Vue 3和Three.js构建的3D场景展示应用，包含模型加载、场景管理等功能。

## 项目特点

- 🏠 支持GLB格式3D模型加载
- 🎨 场景管理与渲染控制
- 🚀 基于Vite的快速开发体验
- 📊 集成数据可视化视图

## 技术栈

- Vue 3
- Three.js
- Vite
- GLTFLoader

## 项目结构

```
src/
├── App.vue          # 主应用组件
├── main.js          # 应用入口
├── router/          # 路由配置
│   └── index.js
├── utils/           # 工具函数
│   ├── modelLoader.js # 模型加载器
│   └── sceneManager.js # 场景管理器
└── views/           # 页面视图
    ├── ChartView.vue  # 数据图表视图
    ├── HomeView.vue   # 首页
    ├── NotFound.vue   # 404页面
    └── SceneOverview.vue # 3D场景视图
```

## 快速开始

1. 克隆仓库
```bash
git clone https://github.com/fire-disposal/threeJstest.git
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## 模型资源

模型文件存放在 `public/models/` 目录下，当前包含：
- house.glb

## 许可证

MIT License
