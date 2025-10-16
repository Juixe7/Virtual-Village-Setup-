import * as THREE from 'three';

export class Environment {
    constructor(scene) {
        this.scene = scene;
        this.createSky();
        this.createAtmosphere();
    }

    createSky() {
    // More realistic sky gradient using a larger sphere
    const skyGeometry = new THREE.SphereGeometry(800, 32, 32);
    
    // Create gradient texture for sky
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    // Create sky gradient - light blue at horizon, darker blue at top
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');    // Light blue at bottom
    gradient.addColorStop(0.5, '#6AB0DE');  // Medium blue
    gradient.addColorStop(1, '#4A90C6');    // Darker blue at top
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const skyTexture = new THREE.CanvasTexture(canvas);
    const skyMaterial = new THREE.MeshBasicMaterial({
        map: skyTexture,
        side: THREE.BackSide
    });
    
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    this.scene.add(sky);

    // Sun - brighter and more prominent
    const sunGeometry = new THREE.SphereGeometry(12, 16, 16);
    const sunMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFFFF00,
        emissive: 0xFFFF00
    });
    this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
    this.sun.position.set(200, 150, -200);
    this.scene.add(this.sun);

    // Clouds
    this.createClouds();
}
    createClouds() {
        this.cloudGroup = new THREE.Group();
        
        for (let i = 0; i < 20; i++) {
            const cloud = this.createCloud();
            cloud.position.set(
                (Math.random() - 0.5) * 400,
                80 + Math.random() * 40,
                (Math.random() - 0.5) * 400
            );
            cloud.scale.setScalar(10 + Math.random() * 20);
            this.cloudGroup.add(cloud);
        }
        
        this.scene.add(this.cloudGroup);
    }

    createCloud() {
        const cloud = new THREE.Group();
        
        const cloudPartGeometry = new THREE.SphereGeometry(1, 8, 8);
        const cloudMaterial = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.8
        });

        // Create fluffy cloud from multiple spheres
        for (let i = 0; i < 5; i++) {
            const part = new THREE.Mesh(cloudPartGeometry, cloudMaterial);
            part.position.set(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 1,
                (Math.random() - 0.5) * 2
            );
            part.scale.setScalar(0.8 + Math.random() * 0.5);
            cloud.add(part);
        }

        return cloud;
    }

    createAtmosphere() {
        // Add subtle fog for depth
        this.scene.fog = new THREE.Fog(0x87CEEB, 200, 500);
    }

    update(deltaTime) {
        // Slowly move clouds
        this.cloudGroup.rotation.y += deltaTime * 0.01;
        
        // Gentle sun movement
        this.sun.position.x = 150 + Math.sin(Date.now() * 0.0001) * 50;
        this.sun.position.z = -150 + Math.cos(Date.now() * 0.0001) * 50;
    }
}