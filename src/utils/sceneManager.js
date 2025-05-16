import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ModelLoader } from './modelLoader.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';



// 空函数，保留结构
function createInfoObjects(scene) {
    return new Map();
}


export async function createScene(canvas) {
    // 初始化场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // 定义相机
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);

    // 创建渲染器 - 增强抗锯齿配置
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: "high-performance",
        precision: "highp"
    });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // 创建效果合成器和高亮效果
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const outlinePass = new OutlinePass(new THREE.Vector2(canvas.clientWidth, canvas.clientHeight), scene, camera);
    composer.addPass(outlinePass);

    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 50;


    // 添加环境光和方向光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // 减弱环境光
    scene.add(ambientLight);
    
    // 添加顶部平面方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // 增强方向光
    directionalLight.position.set(0, 15, 0);
    directionalLight.castShadow = false;
    scene.add(directionalLight);
    
    // 添加辅助光源
    const helperLight = new THREE.DirectionalLight(0xffffff, 0.5);
    helperLight.position.set(5, 5, 5);
    scene.add(helperLight);

    // 添加半球光增强整体亮度
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    hemisphereLight.position.set(0, 20, 0);
    scene.add(hemisphereLight);
    
    // 创建房屋和家具
    // 加载房屋gltf模型
    try {
        const houseModel = await new ModelLoader().loadModel('house');
        _ChangeMaterialEmissive(houseModel);
        houseModel.scale.set(1.5, 1.5, 1.5); // 放大模型1.5倍
        scene.add(houseModel);
        
        // 调整相机位置适应放大后的模型
        camera.position.set(0, 15, 30);

    // 修改模型材质增加自发光
    function _ChangeMaterialEmissive(parent) {
        parent.traverse(function (obj) {
            if(obj instanceof THREE.Mesh){
                obj.material.emissive = new THREE.Color(1,1,1);
                obj.material.emissiveIntensity = 0.3; // 适度自发光强度
                if(obj.material.map) {
                    obj.material.emissiveMap = obj.material.map;
                }
            }
        });
    }
    } catch (error) {
        console.error('加载房屋模型失败:', error);
        console.log('请将house.glb模型文件放入public/models目录');
    }
    // 不再创建家具

    // 创建统一信息对象映射表
    const infoMap = createInfoObjects(scene);
    
    // 创建空传感器组(仅保留分组功能)
    const sensorGroup = new THREE.Group();
    scene.add(sensorGroup);

    // 创建信息面板(Card样式)
    const infoPanel = document.createElement('div');
    infoPanel.style.position = 'fixed';
    infoPanel.style.backgroundColor = 'white';
    infoPanel.style.borderRadius = '8px';
    infoPanel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    infoPanel.style.padding = '12px 16px';
    infoPanel.style.maxWidth = '300px';
    infoPanel.style.fontFamily = 'Arial, sans-serif';
    infoPanel.style.fontSize = '14px';
    infoPanel.style.color = '#333';
    infoPanel.style.lineHeight = '1.5';
    infoPanel.style.visibility = 'hidden';
    infoPanel.style.zIndex = '1000';
    infoPanel.style.transition = 'opacity 0.2s ease';
    document.body.appendChild(infoPanel);

    // 简化鼠标悬停事件处理
    function onDocumentMouseMove(event) {
        const rect = canvas.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        
        // 仅检测场景中的模型
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            const intersected = intersects[0].object;
            // 查找完整组名路径
            const groupPath = [];
            let parent = intersected.parent;
            while (parent) {
                if (parent.isGroup && parent.name) {
                    groupPath.unshift(parent.name); // 添加到数组开头
                }
                parent = parent.parent;
            }
            const fullGroupPath = groupPath.length > 0
                ? groupPath.join('/')
                : '无';
            
            console.log('检测到模型对象:', {
                name: intersected.name,
                type: intersected.type,
                position: intersected.position,
                groupPath: groupPath
            });
            
            // 仅显示最小模型组名称
            const minimalGroupName = groupPath.length > 0
                ? groupPath[groupPath.length - 1]
                : '无';
            infoPanel.innerHTML = `📍 ${minimalGroupName}`;
            infoPanel.style.visibility = 'visible';
            infoPanel.style.left = `${event.clientX + 10}px`;
            infoPanel.style.top = `${event.clientY - 20}px`;
        } else {
            hideObjectInfo();
        }
    }

    // 隐藏信息
    function hideObjectInfo() {
        infoPanel.style.visibility = 'hidden';
    }

    // 添加事件监听
    canvas.addEventListener('mousemove', onDocumentMouseMove, false);

    // 传感器脉动动画
    function animateSensors() {
        const time = Date.now() * 0.001;
        
        const sensorObjects = scene.children.filter(obj => obj.userData?.id);
        sensorObjects.forEach(obj => {
            const { pulseSpeed, originalScale } = obj.userData;
            const pulse = Math.sin(time * pulseSpeed * 15) * 0.15 + 1;
            const scale = originalScale * pulse;
            
            // 更新缩放
            obj.scale.set(scale, scale, scale);
        });
    }

    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        animateSensors();
        controls.update();
        composer.render();
    }

    // 响应式调整
    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        composer.setSize(canvas.clientWidth, canvas.clientHeight);
    });

    animate();

    // 清理函数
    function cleanup() {
        document.body.removeChild(infoPanel);
        canvas.removeEventListener('mousemove', onDocumentMouseMove);
    }

    return {
        scene,
        camera,
        renderer,
        controls,
        cleanup
    };
}
