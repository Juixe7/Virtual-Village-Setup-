import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TerrainManager } from './TerrainManager.js';
import { AssetLoader } from './AssetLoader.js';
import { Character } from '../entities/Character.js';
import { House } from '../entities/House.js';
import { Animal } from '../entities/Animal.js';
import { Environment } from '../entities/Environment.js';
import { Structures } from '../entities/Structures.js';

export class InfiniteLandscape {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        this.playerPosition = new THREE.Vector3(0, 0, 0);
        this.moveState = { forward: false, backward: false, left: false, right: false };
        this.entities = [];
        this.animals = []; // Critical: Initialize animals array
        
        this.init();
    }

    async init() {
        this.setupRenderer();
        this.setupCamera();
        this.setupLighting();
        this.setupControls();
        this.setupEventListeners();
        
        // Initialize managers
        this.terrainManager = new TerrainManager(this.scene);
        this.assetLoader = new AssetLoader();
        
        // Load assets and create environment
        await this.createEnvironment();
        
        this.hideLoadingScreen();
        this.animate();
    }

    setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x6AB0DE); // Change from 0x87CEEB to slightly darker blue
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);
}

    setupCamera() {
        this.camera.position.set(0, 15, 25);
        this.camera.lookAt(0, 0, 0);
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Directional light
        this.directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        this.directionalLight.position.set(100, 80, -100);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 500;
        this.directionalLight.shadow.camera.left = -100;
        this.directionalLight.shadow.camera.right = 100;
        this.directionalLight.shadow.camera.top = 100;
        this.directionalLight.shadow.camera.bottom = -100;
        this.scene.add(this.directionalLight);

        // Hemisphere light
        const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x3a7d34, 0.6);
        this.scene.add(hemisphereLight);
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 200;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        
        document.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'KeyW': this.moveState.forward = true; break;
                case 'KeyS': this.moveState.backward = true; break;
                case 'KeyA': this.moveState.left = true; break;
                case 'KeyD': this.moveState.right = true; break;
            }
        });

        document.addEventListener('keyup', (event) => {
            switch (event.code) {
                case 'KeyW': this.moveState.forward = false; break;
                case 'KeyS': this.moveState.backward = false; break;
                case 'KeyA': this.moveState.left = false; break;
                case 'KeyD': this.moveState.right = false; break;
            }
        });
    }

    async createEnvironment() {
        // Create sky and environment
        this.environment = new Environment(this.scene);
        
        // Create animals FIRST (important for cattle farm positioning)
        this.createAnimals();
        
        // Create village with multiple houses and structures
        this.createVillage();
        
        // Create characters
        this.createCharacters();
    }

    createVillage() {
        // Create dense residential area
        this.createResidentialArea(-40, -30, 25, 20, 15);
        
        // Create sparse residential area
        this.createResidentialArea(30, 40, 12, 15, 8);
        
        // Create rich neighborhood
        this.createRichNeighborhood(-60, 50, 8);
        
        // Create cattle farm (all animals will be here)
        this.createCattleFarmArea(80, -60);
        
        // Create village center with structures
        this.createVillageCenter(0, 0);
        
        // Create scattered farm houses
        this.createScatteredFarms();
    }

    createResidentialArea(centerX, centerZ, width, height, houseCount) {
        const houseTypes = ['small', 'medium', 'small', 'small', 'medium'];
        
        for (let i = 0; i < houseCount; i++) {
            const type = houseTypes[Math.floor(Math.random() * houseTypes.length)];
            const house = new House(type);
            
            const x = centerX + (Math.random() - 0.5) * width;
            const z = centerZ + (Math.random() - 0.5) * height;
            
            house.mesh.position.set(x, 0, z);
            house.mesh.rotation.y = Math.random() * Math.PI;
            this.scene.add(house.mesh);
            this.entities.push(house);
        }
    }

    createRichNeighborhood(centerX, centerZ, houseCount) {
        for (let i = 0; i < houseCount; i++) {
            const house = new House('rich');
            
            const angle = (i / houseCount) * Math.PI * 2;
            const radius = 15 + Math.random() * 10;
            const x = centerX + Math.cos(angle) * radius;
            const z = centerZ + Math.sin(angle) * radius;
            
            house.mesh.position.set(x, 0, z);
            house.mesh.rotation.y = angle + Math.PI;
            this.scene.add(house.mesh);
            this.entities.push(house);
        }
    }

    createCattleFarmArea(centerX, centerZ) {
    // Create cattle farm structure
    const cattleFarm = Structures.createCattleFarm(centerX, centerZ, 25, 20);
    this.scene.add(cattleFarm);
    this.entities.push({ mesh: cattleFarm });
    
    // Move all animals to the cattle farm area and keep them inside
    if (this.animals && this.animals.length > 0) {
        this.animals.forEach((animal, index) => {
            // Distribute animals evenly within the farm area
            const rows = 5;
            const cols = 5;
            const spacing = 3;
            
            const row = Math.floor(index / cols);
            const col = index % cols;
            
            const x = centerX + (col - 2) * spacing;
            const z = centerZ + (row - 2) * spacing;
            
            animal.mesh.position.set(x, 0, z);
            
            // Make sure animals don't move
            animal.setupBehavior(); // Re-initialize with no movement
            
            // Limit animal types in cattle farm
            if (animal.type !== 'sheep' && animal.type !== 'rabbit') {
                animal.type = 'sheep'; // Convert to farm animals
            }
        });
    }
}

    createVillageCenter(centerX, centerZ) {
        // Electric towers along a path
        for (let i = -3; i <= 3; i++) {
            const tower = Structures.createElectricTower(centerX + i * 30, centerZ - 40);
            this.scene.add(tower);
            this.entities.push({ mesh: tower });
        }
        
        // Wells
        const well1 = Structures.createWell(centerX - 20, centerZ + 15);
        const well2 = Structures.createWell(centerX + 25, centerZ - 10);
        this.scene.add(well1);
        this.scene.add(well2);
        this.entities.push({ mesh: well1 }, { mesh: well2 });
        
        // Windmill
        const windmill = Structures.createWindmill(centerX + 40, centerZ + 30);
        this.scene.add(windmill);
        this.entities.push({ 
            mesh: windmill, 
            update: (delta) => {
                if (windmill.userData.blades) {
                    windmill.userData.blades.rotation.y += delta * 0.5;
                }
            }
        });
        
        // Market stalls
        for (let i = -1; i <= 1; i++) {
            const stall = Structures.createMarketStall(centerX + i * 8, centerZ + 25);
            this.scene.add(stall);
            this.entities.push({ mesh: stall });
        }
    }

    createScatteredFarms() {
        const farmPositions = [
            [-80, -80], [90, -90], [-70, 70], [100, 60], [-90, 100]
        ];
        
        farmPositions.forEach(pos => {
            const farm = new House('farm');
            farm.mesh.position.set(pos[0], 0, pos[1]);
            farm.mesh.rotation.y = Math.random() * Math.PI;
            this.scene.add(farm.mesh);
            this.entities.push(farm);
        });
    }

    createCharacters() {
        const characterPositions = [
            [-12, -8], [8, -12], [-25, 15], [18, 20], [0, -20],
            [-35, -15], [25, 10], [-15, 25], [30, -25]
        ];

        characterPositions.forEach((pos, index) => {
            const character = new Character();
            character.mesh.position.set(pos[0], 0, pos[1]);
            character.mesh.rotation.y = Math.random() * Math.PI * 2;
            this.scene.add(character.mesh);
            this.entities.push(character);
        });
    }

    createAnimals() {
        this.animals = [];
        
        // Create only farm animals (sheep and rabbits)
        for (let i = 0; i < 25; i++) {
            const type = Math.random() > 0.3 ? 'sheep' : 'rabbit';
            const animal = new Animal(type);
            
            // Temporary position - will be moved to cattle farm
            animal.mesh.position.set(0, 0, 0);
            
            this.scene.add(animal.mesh);
            this.animals.push(animal);
            this.entities.push(animal);
        }
    }

    updateMovement(deltaTime) {
        const moveSpeed = 20 * deltaTime;
        const moveVector = new THREE.Vector3();

        if (this.moveState.forward) moveVector.z -= moveSpeed;
        if (this.moveState.backward) moveVector.z += moveSpeed;
        if (this.moveState.left) moveVector.x -= moveSpeed;
        if (this.moveState.right) moveVector.x += moveSpeed;

        this.camera.position.add(moveVector);
        this.playerPosition.add(moveVector);
        this.controls.target.add(moveVector);

        // Update terrain
        this.terrainManager.updateTerrain(this.playerPosition);
    }

    hideLoadingScreen() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = Math.min(0.1, this.clock ? this.clock.getDelta() : 0.1);
        if (!this.clock) this.clock = new THREE.Clock();
        
        this.updateMovement(deltaTime);
        this.controls.update();
        
        // Update environment (clouds, sun, etc.)
        if (this.environment && this.environment.update) {
            this.environment.update(deltaTime);
        }
        
        // Update entities
        this.entities.forEach(entity => {
            if (entity.update) entity.update(deltaTime);
        });

        this.renderer.render(this.scene, this.camera);
    }
}