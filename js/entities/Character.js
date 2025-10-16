import * as THREE from 'three';

export class Character {
    constructor() {
        this.mesh = new THREE.Group();
        this.createCharacter();
        this.setupAnimations();
    }

    createCharacter() {
        // Body with better proportions
        const bodyGeometry = new THREE.CapsuleGeometry(0.4, 1.2, 4, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2196F3,
            flatShading: true
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.1;
        this.mesh.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.35, 16, 16);
        const headMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xFFD700,
            flatShading: true
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.2;
        this.mesh.add(head);

        // Arms with better positioning
        const armGeometry = new THREE.CapsuleGeometry(0.12, 0.8, 4, 8);
        const armMaterial = new THREE.MeshLambertMaterial({ color: 0x2196F3 });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.5, 1.4, 0);
        leftArm.rotation.z = Math.PI / 6;
        this.mesh.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.5, 1.4, 0);
        rightArm.rotation.z = -Math.PI / 6;
        this.mesh.add(rightArm);

        // Legs
        const legGeometry = new THREE.CapsuleGeometry(0.15, 0.9, 4, 8);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0x1976D2 });
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.2, 0.45, 0);
        this.mesh.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.2, 0.45, 0);
        this.mesh.add(rightLeg);

        // Face features
        this.addFaceFeatures(head);

        this.mesh.castShadow = true;
        this.mesh.scale.set(0.8, 0.8, 0.8);
    }

    addFaceFeatures(head) {
        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(0.15, 0.1, 0.3);
        head.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(-0.15, 0.1, 0.3);
        head.add(rightEye);

        // Simple smile
        const mouthGeometry = new THREE.TorusGeometry(0.1, 0.02, 8, 8, Math.PI);
        const mouthMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(0, -0.1, 0.3);
        mouth.rotation.x = Math.PI / 6;
        head.add(mouth);
    }

    setupAnimations() {
        this.animationTime = 0;
        this.isWalking = Math.random() > 0.5;
        this.walkSpeed = 0.5 + Math.random() * 1;
    }

    update(deltaTime) {
        this.animationTime += deltaTime;
        
        if (this.isWalking) {
            // Gentle idle/walking animation
            this.mesh.position.x += Math.sin(this.animationTime * this.walkSpeed) * 0.01;
            this.mesh.position.z += Math.cos(this.animationTime * this.walkSpeed) * 0.01;
            
            // Subtle bouncing
            this.mesh.position.y = Math.sin(this.animationTime * 2) * 0.1;
            
            // Gentle rotation
            this.mesh.rotation.y = Math.sin(this.animationTime * 0.5) * 0.1;
        }
    }
}