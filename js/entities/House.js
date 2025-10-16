import * as THREE from 'three';
import { MathUtils } from '../utils/MathUtils.js'; // This should work now

export class House {
    constructor(type = 'small') {
        this.type = type;
        this.mesh = new THREE.Group();
        this.createHouse(type);
    }

    createHouse(type) {
        switch (type) {
            case 'small':
                this.createSmallHouse();
                break;
            case 'medium':
                this.createMediumHouse();
                break;
            case 'large':
                this.createLargeHouse();
                break;
            case 'rich':
                this.createRichHouse();
                break;
            case 'farm':
                this.createFarmHouse();
                break;
            default:
                this.createSmallHouse();
        }
    }

    createSmallHouse() {
        // Base
        const baseGeometry = new THREE.BoxGeometry(6, 4, 5);
        const baseMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xC19A6B,
            flatShading: true
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 2;
        this.mesh.add(base);

        // Roof
        const roofGeometry = new THREE.ConeGeometry(4, 3, 4);
        const roofMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x8B4513
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 5.5;
        roof.rotation.y = Math.PI / 4;
        this.mesh.add(roof);

        this.addWindowsAndDoor(3, 2.5, 2.6);
    }

    createMediumHouse() {
        // Base
        const baseGeometry = new THREE.BoxGeometry(8, 5, 7);
        const baseMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xD2B48C
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 2.5;
        this.mesh.add(base);

        // Roof
        const roofGeometry = new THREE.ConeGeometry(5, 4, 4);
        const roofMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xA0522D
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 6;
        roof.rotation.y = Math.PI / 4;
        this.mesh.add(roof);

        // Second floor
        const secondFloorGeometry = new THREE.BoxGeometry(7, 3, 6);
        const secondFloor = new THREE.Mesh(secondFloorGeometry, baseMaterial);
        secondFloor.position.y = 5.5;
        this.mesh.add(secondFloor);

        this.addWindowsAndDoor(4, 3, 3.6);
        this.addChimney();
    }

    createLargeHouse() {
        // Main base
        const baseGeometry = new THREE.BoxGeometry(12, 6, 8);
        const baseMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xDEB887
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 3;
        this.mesh.add(base);

        // Complex roof
        const roofGroup = new THREE.Group();
        
        const mainRoofGeometry = new THREE.ConeGeometry(6, 4, 4);
        const mainRoof = new THREE.Mesh(mainRoofGeometry, new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
        mainRoof.position.y = 2;
        roofGroup.add(mainRoof);

        const sideRoofGeometry = new THREE.ConeGeometry(4, 3, 4);
        const sideRoof = new THREE.Mesh(sideRoofGeometry, new THREE.MeshLambertMaterial({ color: 0xA0522D }));
        sideRoof.position.set(3, 1.5, 0);
        sideRoof.rotation.y = Math.PI / 2;
        roofGroup.add(sideRoof);

        roofGroup.position.y = 6;
        this.mesh.add(roofGroup);

        this.addWindowsAndDoor(6, 4, 4.1);
        this.addChimney();
        this.addPorch();
    }

    createRichHouse() {
        // Grand base
        const baseGeometry = new THREE.BoxGeometry(15, 8, 10);
        const baseMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xF5DEB3
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 4;
        this.mesh.add(base);

        // Elaborate roof
        const roofGeometry = new THREE.ConeGeometry(8, 5, 6);
        const roofMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x654321
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 8.5;
        this.mesh.add(roof);

        // Columns
        const columnGeometry = new THREE.CylinderGeometry(0.3, 0.3, 6, 8);
        const columnMaterial = new THREE.MeshLambertMaterial({ color: 0x8B7355 });
        
        for (let i = -1; i <= 1; i += 2) {
            for (let j = -1; j <= 1; j += 2) {
                const column = new THREE.Mesh(columnGeometry, columnMaterial);
                column.position.set(i * 6, 3, j * 4);
                this.mesh.add(column);
            }
        }

        this.addWindowsAndDoor(7.5, 5, 5.1);
        this.addChimney();
        this.addPorch();
        this.addBalcony();
    }

    createFarmHouse() {
        // Main house
        const baseGeometry = new THREE.BoxGeometry(10, 5, 8);
        const baseMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xCD853F
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 2.5;
        this.mesh.add(base);

        // Barn attachment
        const barnGeometry = new THREE.BoxGeometry(8, 4, 6);
        const barn = new THREE.Mesh(barnGeometry, baseMaterial);
        barn.position.set(9, 2, 0);
        this.mesh.add(barn);

        // Barn roof
        const barnRoofGeometry = new THREE.ConeGeometry(5, 3, 4);
        const barnRoof = new THREE.Mesh(barnRoofGeometry, new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
        barnRoof.position.set(9, 5.5, 0);
        barnRoof.rotation.y = Math.PI / 4;
        this.mesh.add(barnRoof);

        // Silo
        const siloGeometry = new THREE.CylinderGeometry(1.5, 1.5, 8, 8);
        const siloMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
        const silo = new THREE.Mesh(siloGeometry, siloMaterial);
        silo.position.set(-6, 4, 0);
        this.mesh.add(silo);

        this.addWindowsAndDoor(5, 3, 4.1);
        this.addChimney();
    }

    addWindowsAndDoor(houseWidth, windowHeight, doorHeight) {
        // Door
        const doorGeometry = new THREE.BoxGeometry(1.8, 3, 0.2);
        const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 1.5, doorHeight);
        this.mesh.add(door);

        // Windows
        const windowGeometry = new THREE.PlaneGeometry(1.2, 1.2);
        const windowMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x87CEEB,
            emissive: 0x222222
        });

        const windowPositions = [
            [-houseWidth/3, windowHeight, doorHeight], 
            [houseWidth/3, windowHeight, doorHeight],
            [-houseWidth/3, windowHeight, -doorHeight], 
            [houseWidth/3, windowHeight, -doorHeight]
        ];
        
        windowPositions.forEach(pos => {
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.set(pos[0], pos[1], pos[2]);
            this.mesh.add(window);
        });
    }

    addChimney() {
        const chimneyGeometry = new THREE.BoxGeometry(0.8, 4, 0.8);
        const chimneyMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
        chimney.position.set(3, 6, -2);
        this.mesh.add(chimney);
    }

    addPorch() {
        const porchGeometry = new THREE.BoxGeometry(4, 0.5, 3);
        const porchMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const porch = new THREE.Mesh(porchGeometry, porchMaterial);
        porch.position.set(0, 0.25, 4);
        this.mesh.add(porch);
    }

    addBalcony() {
        const balconyGeometry = new THREE.BoxGeometry(6, 0.3, 2);
        const balconyMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const balcony = new THREE.Mesh(balconyGeometry, balconyMaterial);
        balcony.position.set(0, 6, 4);
        this.mesh.add(balcony);

        // Balcony railing
        const railingGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
        const railingMaterial = new THREE.MeshLambertMaterial({ color: 0x8B7355 });
        
        for (let i = -2.5; i <= 2.5; i += 1) {
            const railing = new THREE.Mesh(railingGeometry, railingMaterial);
            railing.position.set(i, 6.5, 4.5);
            this.mesh.add(railing);
        }
    }

    update(deltaTime) {
        // House doesn't need updates
    }
}