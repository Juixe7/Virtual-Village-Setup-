import * as THREE from 'three';

export class Animal {
    constructor(type) {
        this.type = type;
        this.mesh = new THREE.Group();
        this.createAnimal();
        this.setupBehavior();
    }

    createAnimal() {
        switch (this.type) {
            case 'sheep':
                this.createSheep();
                break;
            case 'rabbit':
                this.createRabbit();
                break;
            case 'deer':
                this.createDeer();
                break;
            case 'bird':
                this.createBird();
                break;
            default:
                this.createSheep();
        }
    }

    createSheep() {
        // Fluffy body
        const bodyGeometry = new THREE.SphereGeometry(1.2, 16, 16);
        const bodyMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xFFFFFF,
            flatShading: true
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1;
        this.mesh.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.6, 16, 16);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(1.3, 1.2, 0);
        this.mesh.add(head);

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1, 8);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        
        const legPositions = [[-0.8, 0.5, -0.8], [0.8, 0.5, -0.8], [-0.8, 0.5, 0.8], [0.8, 0.5, 0.8]];
        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(pos[0], pos[1], pos[2]);
            this.mesh.add(leg);
        });

        this.movementSpeed = 0.3;
    }

    createRabbit() {
        // Body
        const bodyGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        this.mesh.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0.6, 0.5, 0);
        this.mesh.add(head);

        // Ears
        const earGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8);
        const earMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        
        const leftEar = new THREE.Mesh(earGeometry, earMaterial);
        leftEar.position.set(0.5, 1.0, -0.1);
        leftEar.rotation.z = Math.PI / 6;
        this.mesh.add(leftEar);
        
        const rightEar = new THREE.Mesh(earGeometry, earMaterial);
        rightEar.position.set(0.5, 1.0, 0.1);
        rightEar.rotation.z = -Math.PI / 6;
        this.mesh.add(rightEar);

        this.movementSpeed = 0.8;
    }

    createDeer() {
        // Body
        const bodyGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.8;
        this.mesh.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(1.0, 0.9, 0);
        this.mesh.add(head);

        // Antlers (simplified)
        const antlerGeometry = new THREE.ConeGeometry(0.05, 0.4, 4);
        const antlerMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        
        const leftAntler = new THREE.Mesh(antlerGeometry, antlerMaterial);
        leftAntler.position.set(1.0, 1.3, -0.2);
        leftAntler.rotation.z = Math.PI / 6;
        this.mesh.add(leftAntler);
        
        const rightAntler = new THREE.Mesh(antlerGeometry, antlerMaterial);
        rightAntler.position.set(1.0, 1.3, 0.2);
        rightAntler.rotation.z = -Math.PI / 6;
        this.mesh.add(rightAntler);

        this.movementSpeed = 0.5;
    }

    createBird() {
        // Body
        const bodyGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x2196F3 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1;
        this.mesh.add(body);

        // Wings
        const wingGeometry = new THREE.SphereGeometry(0.2, 8, 4);
        const wingMaterial = new THREE.MeshLambertMaterial({ color: 0x1976D2 });
        
        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.position.set(-0.4, 1, 0);
        leftWing.scale.set(1.5, 0.3, 0.8);
        this.mesh.add(leftWing);
        
        const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        rightWing.position.set(0.4, 1, 0);
        rightWing.scale.set(1.5, 0.3, 0.8);
        this.mesh.add(rightWing);

        this.movementSpeed = 1.0;
        this.isFlying = true;
    }

   setupBehavior() {
    this.animationTime = Math.random() * Math.PI * 2;
    // Remove all movement behavior - animals stay in place
    this.isMoving = false;
    this.movementSpeed = 0; // No movement
    this.wanderDistance = 0; // Don't wander
}

update(deltaTime) {
    this.animationTime += deltaTime;

    // Only very subtle idle animations, no movement
    if (this.isFlying) {
        // Birds can have gentle floating motion but stay in area
        this.mesh.position.y = 2 + Math.sin(this.animationTime * 2) * 0.2;
        
        // Very slow wing flapping for birds
        this.mesh.children.forEach(child => {
            if (child.scale.x > 1) { // This is a wing
                child.rotation.x = Math.sin(this.animationTime * 3) * 0.1;
            }
        });
    } else {
        // Ground animals - just very subtle bobbing
        this.mesh.position.y = Math.sin(this.animationTime * 1) * 0.05;
    }

    // No position changes - animals stay where they are placed
}
}