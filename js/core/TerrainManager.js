import * as THREE from 'three';
import { ImprovedNoise } from '../utils/Noise.js';

export class TerrainManager {
    constructor(scene) {
        this.scene = scene;
        this.chunkSize = 100;
        this.chunkLoadDistance = 200;
        this.loadedChunks = new Set();
        this.noise = new ImprovedNoise();
        this.terrainGroup = new THREE.Group();
        this.scene.add(this.terrainGroup);
    }

    getChunkKey(x, z) {
        return `${Math.floor(x / this.chunkSize)},${Math.floor(z / this.chunkSize)}`;
    }

    updateTerrain(playerPosition) {
        const playerChunkX = Math.floor(playerPosition.x / this.chunkSize) * this.chunkSize;
        const playerChunkZ = Math.floor(playerPosition.z / this.chunkSize) * this.chunkSize;

        const loadRadius = Math.ceil(this.chunkLoadDistance / this.chunkSize);
        
        for (let x = -loadRadius; x <= loadRadius; x++) {
            for (let z = -loadRadius; z <= loadRadius; z++) {
                const chunkX = playerChunkX + x * this.chunkSize;
                const chunkZ = playerChunkZ + z * this.chunkSize;
                
                if (this.shouldLoadChunk(chunkX, chunkZ, playerPosition)) {
                    this.createChunk(chunkX, chunkZ);
                }
            }
        }
    }

    shouldLoadChunk(chunkX, chunkZ, playerPosition) {
        return Math.abs(chunkX - playerPosition.x) <= this.chunkLoadDistance && 
               Math.abs(chunkZ - playerPosition.z) <= this.chunkLoadDistance;
    }

    createChunk(chunkX, chunkZ) {
        const chunkKey = this.getChunkKey(chunkX, chunkZ);
        if (this.loadedChunks.has(chunkKey)) return;

        this.loadedChunks.add(chunkKey);
        const chunkGroup = new THREE.Group();

        this.createTerrainMesh(chunkGroup, chunkX, chunkZ);
        this.addChunkDetails(chunkGroup, chunkX, chunkZ);
        
        this.terrainGroup.add(chunkGroup);
    }

    createTerrainMesh(chunkGroup, chunkX, chunkZ) {
    const segments = 20; // Reduced for performance
    const geometry = new THREE.PlaneGeometry(this.chunkSize, this.chunkSize, segments, segments);
    
    // Simple flat terrain for testing
    geometry.rotateX(-Math.PI / 2);

    // FORCE BROWN COLOR - no vertex colors
    const material = new THREE.MeshLambertMaterial({ 
        color: 0x8B7355, // Brown color
        side: THREE.DoubleSide 
    });
    
    const terrain = new THREE.Mesh(geometry, material);
    terrain.position.set(chunkX, 0, chunkZ);
    terrain.receiveShadow = true;
    
    chunkGroup.add(terrain);
    
    // Add visible patches
    this.addGroundVariation(chunkGroup, chunkX, chunkZ);
}

getTerrainColor(height, x, z) {
    const color = new THREE.Color();
    
    // Check if this is a road area
    const isRoad = this.isRoadArea(x, z);
    if (isRoad) {
        return color.setRGB(0.5, 0.4, 0.3); // Road color - brown
    }
    
    // Color based on height and noise
    const noiseVal = this.noise.noise(x * 0.1, z * 0.1);
    
    if (height > 3) {
        // Mountain/high areas - rocky brown
        return color.setRGB(0.6, 0.5, 0.3);
    } else if (height > 1) {
        // Hills - earthy brown
        return color.setRGB(0.7, 0.6, 0.2);
    } else if (noiseVal > 0.3) {
        // Dry areas - sandy yellow
        return color.setRGB(0.9, 0.8, 0.4);
    } else if (noiseVal > -0.2) {
        // Grasslands - dry grass color
        return color.setRGB(0.7, 0.7, 0.3);
    } else {
        // Fertile lowlands - yellowish green
        return color.setRGB(0.6, 0.7, 0.2);
    }
}

isRoadArea(x, z) {
    // Create a simple road network using noise and patterns
    
    // Main roads (grid-like)
    const mainRoadSpacing = 50;
    if (Math.abs(x % mainRoadSpacing) < 3 || Math.abs(z % mainRoadSpacing) < 3) {
        return true;
    }
    
    // Connecting roads (diagonal)
    const diagonalRoad = Math.abs((x + z) % 30) < 2 || Math.abs((x - z) % 30) < 2;
    if (diagonalRoad) {
        return true;
    }
    
    // Village access roads (lead to village center areas)
    const villageDist = Math.sqrt(x*x + z*z);
    if (villageDist < 100 && Math.abs((x + z * 2) % 20) < 1.5) {
        return true;
    }
    
    return false;
}

addChunkDetails(chunkGroup, chunkX, chunkZ) {
    this.addVegetation(chunkGroup, chunkX, chunkZ);
    this.addRocks(chunkGroup, chunkX, chunkZ);
    this.addFlowers(chunkGroup, chunkX, chunkZ);
    this.addRoadDetails(chunkGroup, chunkX, chunkZ); // Add road details
}

addRoadDetails(chunkGroup, chunkX, chunkZ) {
    // Add road markers or details occasionally
    if (Math.random() > 0.7) {
        const isMainRoad = Math.abs(chunkX % 50) < 10 || Math.abs(chunkZ % 50) < 10;
        if (isMainRoad) {
            this.addRoadMarkers(chunkGroup, chunkX, chunkZ);
        }
    }
}

addRoadMarkers(chunkGroup, chunkX, chunkZ) {
    // Simple road markers (stones along the road)
    const markerCount = 3 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < markerCount; i++) {
        const markerGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.3, 6);
        const markerMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        
        const x = chunkX + (Math.random() - 0.5) * this.chunkSize * 0.1;
        const z = chunkZ + (Math.random() - 0.5) * this.chunkSize * 0.1;
        
        marker.position.set(x, 0.15, z);
        marker.rotation.x = Math.random() * 0.1;
        marker.rotation.z = Math.random() * 0.1;
        chunkGroup.add(marker);
    }
}

    addGroundVariation(chunkGroup, chunkX, chunkZ) {
    // Add patches of different ground types
    const patchCount = 5 + Math.floor(Math.random() * 5);
    
    for (let i = 0; i < patchCount; i++) {
        const patchGeometry = new THREE.CircleGeometry(2 + Math.random() * 3, 8);
        const patchMaterials = [
            new THREE.MeshLambertMaterial({ color: 0xE6D7B0 }), // Light sand
            new THREE.MeshLambertMaterial({ color: 0xD2B48C }), // Tan
            new THREE.MeshLambertMaterial({ color: 0xBC9A6B }), // Brown
            new THREE.MeshLambertMaterial({ color: 0xA67C52 })  // Dark brown
        ];
        
        const patchMaterial = patchMaterials[Math.floor(Math.random() * patchMaterials.length)];
        const patch = new THREE.Mesh(patchGeometry, patchMaterial);
        
        const x = chunkX + (Math.random() - 0.5) * this.chunkSize * 0.8;
        const z = chunkZ + (Math.random() - 0.5) * this.chunkSize * 0.8;
        
        patch.position.set(x, 0.01, z); // Slightly above ground
        patch.rotation.x = -Math.PI / 2;
        chunkGroup.add(patch);
    }
}


   addChunkDetails(chunkGroup, chunkX, chunkZ) {
    this.addVegetation(chunkGroup, chunkX, chunkZ);
    this.addRocks(chunkGroup, chunkX, chunkZ);
    this.addFlowers(chunkGroup, chunkX, chunkZ);
    this.addRoadDetails(chunkGroup, chunkX, chunkZ);
    this.addGroundVariation(chunkGroup, chunkX, chunkZ); // Add this line
}

    addVegetation(chunkGroup, chunkX, chunkZ) {
        const treeCount = Math.floor(Math.random() * 8) + 5;
        
        for (let i = 0; i < treeCount; i++) {
            const x = chunkX + (Math.random() - 0.5) * this.chunkSize * 0.9;
            const z = chunkZ + (Math.random() - 0.5) * this.chunkSize * 0.9;
            
            // Check noise value to place trees in appropriate areas
            const noiseVal = this.noise.noise(x * 0.02, z * 0.02);
            if (noiseVal > -0.2 && noiseVal < 0.3) {
                this.createTree(chunkGroup, x, z);
            }
        }
    }

   createTree(parent, x, z) {
    const tree = new THREE.Group();

    // Trunk - darker brown
    const trunkGeometry = new THREE.CylinderGeometry(0.4, 0.6, 3, 8);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x5D4037 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1.5;
    trunk.castShadow = true;
    tree.add(trunk);

    // Foliage - more natural green colors
    const foliageColors = [0x2E7D32, 0x388E3C, 0x43A047]; // Natural greens
    const sizes = [4, 3, 2];
    const heights = [4, 5.5, 6.5];
    
    for (let i = 0; i < 3; i++) {
        const foliageGeometry = new THREE.SphereGeometry(sizes[i], 8, 6);
        const foliageMaterial = new THREE.MeshLambertMaterial({ 
            color: foliageColors[i],
            flatShading: true
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = heights[i];
        foliage.castShadow = true;
        tree.add(foliage);
    }

    tree.position.set(x, 0, z);
    tree.scale.set(0.8 + Math.random() * 0.4, 0.8 + Math.random() * 0.4, 0.8 + Math.random() * 0.4);
    parent.add(tree);
}

    addRocks(chunkGroup, chunkX, chunkZ) {
        const rockCount = Math.floor(Math.random() * 3) + 1; // Reduced rock count
        
        for (let i = 0; i < rockCount; i++) {
            const x = chunkX + (Math.random() - 0.5) * this.chunkSize * 0.8;
            const z = chunkZ + (Math.random() - 0.5) * this.chunkSize * 0.8;
            
            const noiseVal = this.noise.noise(x * 0.03, z * 0.03);
            if (noiseVal > 0.4) { // Only place rocks in rocky areas
                this.createRock(chunkGroup, x, z);
            }
        }
    }

    createRock(parent, x, z) {
        const rockGroup = new THREE.Group();
        
        const rockGeometry = new THREE.DodecahedronGeometry(1 + Math.random() * 2, 1);
        const rockMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x666666,
            flatShading: true 
        });
        
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.y = 1;
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rock.castShadow = true;
        
        rockGroup.add(rock);
        rockGroup.position.set(x, 0, z);
        rockGroup.scale.set(0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5);
        parent.add(rockGroup);
    }

    addFlowers(chunkGroup, chunkX, chunkZ) {
        const flowerCount = Math.floor(Math.random() * 10) + 5;
        
        for (let i = 0; i < flowerCount; i++) {
            const x = chunkX + (Math.random() - 0.5) * this.chunkSize * 0.9;
            const z = chunkZ + (Math.random() - 0.5) * this.chunkSize * 0.9;
            
            this.createFlower(chunkGroup, x, z);
        }
    }

    createFlower(parent, x, z) {
        const flower = new THREE.Group();
        
        // Stem
        const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 4);
        const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x4CAF50 });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = 0.15;
        flower.add(stem);
        
        // Flower head
        const flowerColors = [0xFF5252, 0xFFEB3B, 0xE040FB, 0x2196F3];
        const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
        
        const flowerGeometry = new THREE.SphereGeometry(0.1, 6, 6);
        const flowerMaterial = new THREE.MeshLambertMaterial({ color: color });
        const flowerHead = new THREE.Mesh(flowerGeometry, flowerMaterial);
        flowerHead.position.y = 0.3;
        flower.add(flowerHead);
        
        flower.position.set(x, 0, z);
        parent.add(flower);
    }
}