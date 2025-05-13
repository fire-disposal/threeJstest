import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

// 创建房屋结构
function createHouse(scene) {
    // 地板
    const floorGeometry = new THREE.PlaneGeometry(30, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // 墙壁材质
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xF5DEB3,
        side: THREE.DoubleSide
    });

    // 创建墙壁函数
    function createWall(width, height, depth, x, y, z, rotationY = 0) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const wall = new THREE.Mesh(geometry, wallMaterial);
        wall.position.set(x, y, z);
        wall.rotation.y = rotationY;
        return wall;
    }

    // 添加四面墙
    scene.add(createWall(30, 8, 0.2, 0, 4, -10)); // 后墙
    scene.add(createWall(30, 8, 0.2, 0, 4, 10));  // 前墙
    scene.add(createWall(20, 8, 0.2, -15, 4, 0, Math.PI / 2)); // 左墙
    scene.add(createWall(20, 8, 0.2, 15, 4, 0, Math.PI / 2));  // 右墙

    // 添加房间隔断
    scene.add(createWall(20, 8, 0.2, 0, 4, -5)); // 客厅卧室隔断
    scene.add(createWall(10, 8, 0.2, -7.5, 4, 5, Math.PI / 2)); // 厨房隔断

    // 添加门
    const doorGeometry = new THREE.BoxGeometry(2, 5, 0.2);
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 2.5, 10);
    scene.add(door);

    // 添加窗户
    const windowGeometry = new THREE.BoxGeometry(4, 3, 0.1);
    const windowMaterial = new THREE.MeshStandardMaterial({
        color: 0xADD8E6,
        transparent: true,
        opacity: 0.7
    });
    const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
    window1.position.set(-12, 5, 10);
    scene.add(window1);
    
    const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
    window2.position.set(12, 5, 10);
    scene.add(window2);
}

// 创建家具
function createFurniture(scene) {
    // 床
    const bedGeometry = new THREE.BoxGeometry(6, 1, 4);
    const bedMaterial = new THREE.MeshStandardMaterial({ color: 0x4169E1 });
    const bed = new THREE.Mesh(bedGeometry, bedMaterial);
    bed.position.set(-10, 0.5, -7);
    scene.add(bed);

    // 沙发
    const sofaGeometry = new THREE.BoxGeometry(5, 1, 2);
    const sofaMaterial = new THREE.MeshStandardMaterial({ color: 0xA0522D });
    const sofa = new THREE.Mesh(sofaGeometry, sofaMaterial);
    sofa.position.set(8, 0.5, -7);
    scene.add(sofa);

    // 餐桌
    const tableGeometry = new THREE.BoxGeometry(3, 1, 2);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(-5, 0.5, 7);
    scene.add(table);

    // 椅子
    const chairGeometry = new THREE.BoxGeometry(1, 1, 1);
    const chairMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    for (let i = 0; i < 4; i++) {
        const chair = new THREE.Mesh(chairGeometry, chairMaterial);
        chair.position.set(
            -5 + (i < 2 ? -1 : 1) * 1.5,
            0.5,
            7 + (i % 2 === 0 ? -1.5 : 1.5)
        );
        scene.add(chair);
    }
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

// 创建传感器模型
function createSensorModel(scene, sensorData) {
    // 🔁 传感器相关变量
    const sensorGroup = new THREE.Group();
    scene.add(sensorGroup);
    const sensorMap = new Map();

    for (const sensor of sensorData) {
        const marker = createSensorMarker(sensor.type);

        // 设置传感器位置
        marker.position.set(sensor.position.x, sensor.position.y, sensor.position.z);

        // 给每个 marker 添加透明交互 box，扩大点击范围
        const hitbox = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 0.5),
            new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0, transparent: true })
        );
        hitbox.userData = sensor;
        marker.add(hitbox);

        // 加入分组、建立映射
        sensorGroup.add(marker);
        sensorMap.set(hitbox, sensor); // 将 hitbox 与 sensor 数据关联
    }

    return { sensorGroup, sensorMap };
}

// ✅ 创建 marker 函数（不同类型可用不同颜色/图标）
function createSensorMarker(type) {
    const geometry = new THREE.SphereGeometry(0.2, 16, 16); // 增大传感器尺寸
    const colorMap = {
        smoke: 0xff0000,
        gas: 0xffff00,
        water: 0x0000ff
    };
    const material = new THREE.MeshBasicMaterial({ color: colorMap[type] || 0xffffff });
    return new THREE.Mesh(geometry, material);
}

export function createScene(canvas) {
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

    // 添加光源（不启用阴影）
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    // 创建房屋和家具
    createHouse(scene);
    createFurniture(scene);

    // 添加老人模型
    const elderlyPerson = createElderlyPerson();
    scene.add(elderlyPerson);

    // 传感器数据定义
    const sensorData = [
        {
            id: "sensor_01",
            name: "厨房烟雾传感器",
            position: { x: 1.2, y: 2.1, z: -0.5 },
            type: "smoke"
        },
        {
            id: "sensor_02",
            name: "卧室燃气传感器",
            position: { x: -8, y: 2, z: -5 },
            type: "gas"
        },
        {
            id: "sensor_03",
            name: "浴室水浸传感器",
            position: { x: 6, y: 1, z: 5 },
            type: "water"
        }
    ];

    // 创建传感器模型
    const { sensorGroup, sensorMap } = createSensorModel(scene, sensorData);

    // 创建信息面板
    const infoPanel = document.createElement('div');
    infoPanel.style.position = 'absolute';
    infoPanel.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    infoPanel.style.border = '1px solid black';
    infoPanel.style.padding = '5px';
    infoPanel.style.visibility = 'hidden';
    document.body.appendChild(infoPanel);

    // ✅ 鼠标悬停事件处理
    function onDocumentMouseMove(event) {
        const rect = canvas.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(sensorGroup.children, true); // 启用递归 true

        if (intersects.length > 0) {
            const intersected = intersects[0].object;

            // 查找 sensor 数据
            const sensor = sensorMap.get(intersected);
            if (sensor) {
                showSensorInfo(sensor, intersects[0].point);
            }
        } else {
            hideSensorInfo();
        }
    }

    // ✅ 展示传感器信息
    function showSensorInfo(sensor, position) {
        console.log("悬停在传感器：", sensor.name, "坐标：", position);

        infoPanel.innerHTML = `📍 ${sensor.name}<br>类型：${sensor.type}`;
        infoPanel.style.visibility = 'visible';
        infoPanel.style.left = `${event.clientX + 10}px`;
        infoPanel.style.top = `${event.clientY - 20}px`;
    }

    // ✅ 隐藏信息
    function hideSensorInfo() {
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

    return {
        scene,
        camera,
        renderer,
        controls
    };
}
