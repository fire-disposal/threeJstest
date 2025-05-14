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

// 创建老人模型
function createElderlyPerson() {
    const group = new THREE.Group();
    
    // 头部
    const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.7;
    group.add(head);
    
    // 身体
    const bodyGeometry = new THREE.BoxGeometry(1, 1.5, 0.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4682B4 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;
    group.add(body);
    
    // 四肢
    const limbGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.3);
    const limbMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
    
    // 左臂
    const leftArm = new THREE.Mesh(limbGeometry, limbMaterial);
    leftArm.position.set(-0.8, 1.1, 0);
    leftArm.rotation.z = 0.3;
    group.add(leftArm);
    
    // 右臂
    const rightArm = new THREE.Mesh(limbGeometry, limbMaterial);
    rightArm.position.set(0.8, 1.1, 0);
    rightArm.rotation.z = -0.3;
    group.add(rightArm);
    
    // 左腿
    const leftLeg = new THREE.Mesh(limbGeometry, limbMaterial);
    leftLeg.position.set(-0.3, -0.4, 0);
    group.add(leftLeg);
    
    // 右腿
    const rightLeg = new THREE.Mesh(limbGeometry, limbMaterial);
    rightLeg.position.set(0.3, -0.4, 0);
    group.add(rightLeg);
    
    group.position.set(0, 0, 0);
    group.scale.set(0.8, 0.8, 0.8);
    
    return group;
}


export async function createScene(canvas) {
    // 初始化场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // 定义相机
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // 增强环境光
    scene.add(ambientLight);
    
    // 添加顶部平面方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // 增强方向光
    directionalLight.position.set(0, 15, 0); // 提高光源位置
    directionalLight.castShadow = true; // 关闭阴影
    directionalLight.shadow.mapSize.width = 2048; // 提高阴影质量
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // 添加辅助光源
    const helperLight = new THREE.DirectionalLight(0xffffff, 0.5);
    helperLight.position.set(5, 5, 5);
    scene.add(helperLight);
    
    // 创建房屋和家具
    // 加载房屋gltf模型
    try {
        const houseModel = await new ModelLoader().loadModel('house');
        scene.add(houseModel);
    } catch (error) {
        console.error('加载房屋模型失败:', error);
        console.log('请将house.glb模型文件放入public/models目录');
    }
    // 不再创建家具

    // 添加老人模型
    const elderlyPerson = createElderlyPerson();
    scene.add(elderlyPerson);

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

    // 老人随机移动
    function moveElderlyPerson() {
        const time = Date.now() * 0.001;
        elderlyPerson.position.x = Math.sin(time * 0.3) * 8;
        elderlyPerson.position.z = Math.cos(time * 0.2) * 6;
        
        // 面向移动方向
        elderlyPerson.rotation.y = Math.atan2(
            Math.sin(time * 0.3),
            Math.cos(time * 0.2)
        ) + Math.PI;

        // 模拟呼吸效果
        const breath = Math.sin(time * 3) * 0.02;
        elderlyPerson.scale.set(0.8 + breath, 0.8 + breath, 0.8 + breath);
    }

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
        moveElderlyPerson();
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
