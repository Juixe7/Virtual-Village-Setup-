import * as THREE from 'three';

export class Structures {
    static createElectricTower(x, z) {
        const tower = new THREE.Group();

        // Base legs
        const legGeometry = new THREE.CylinderGeometry(0.2, 0.3, 15, 8);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        
        const legPositions = [
            [-2, 7.5, -2], [2, 7.5, -2], 
            [-2, 7.5, 2], [2, 7.5, 2]
        ];
        
        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(pos[0], pos[1], pos[2]);
            tower.add(leg);
        });

        // Cross beams
        const beamGeometry = new THREE.BoxGeometry(4, 0.1, 0.1);
        const beamMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
        
        for (let i = 0; i < 4; i++) {
            const beam = new THREE.Mesh(beamGeometry, beamMaterial);
            beam.position.y = 5 + i * 2;
            tower.add(beam);
        }

        // Power lines attachment points
        const attachmentGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const attachmentMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
        const attachment = new THREE.Mesh(attachmentGeometry, attachmentMaterial);
        attachment.position.y = 13;
        tower.add(attachment);

        tower.position.set(x, 0, z);
        tower.castShadow = true;
        return tower;
    }

    static createWell(x, z) {
        const well = new THREE.Group();

        // Well base
        const wellGeometry = new THREE.CylinderGeometry(2, 2.2, 1, 16);
        const wellMaterial = new THREE.MeshLambertMaterial({ color: 0x8B7355 });
        const wellBase = new THREE.Mesh(wellGeometry, wellMaterial);
        wellBase.position.y = 0.5;
        well.add(wellBase);

        // Well roof
        const roofGeometry = new THREE.ConeGeometry(2.5, 2, 8);
        const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 2.5;
        well.add(roof);

        // Bucket mechanism
        const mechanismGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
        const mechanismMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const mechanism = new THREE.Mesh(mechanismGeometry, mechanismMaterial);
        mechanism.position.set(1.5, 1.5, 0);
        mechanism.rotation.z = Math.PI / 2;
        well.add(mechanism);

        // Bucket
        const bucketGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.4);
        const bucketMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const bucket = new THREE.Mesh(bucketGeometry, bucketMaterial);
        bucket.position.set(2, 0.3, 0);
        well.add(bucket);

        well.position.set(x, 0, z);
        well.castShadow = true;
        return well;
    }

    static createWindmill(x, z) {
        const windmill = new THREE.Group();

        // Tower
        const towerGeometry = new THREE.CylinderGeometry(1, 1.5, 12, 8);
        const towerMaterial = new THREE.MeshLambertMaterial({ color: 0xD2B48C });
        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        tower.position.y = 6;
        windmill.add(tower);

        // Blades
        const blades = new THREE.Group();
        const bladeGeometry = new THREE.BoxGeometry(6, 0.5, 0.1);
        const bladeMaterial = new THREE.MeshLambertMaterial({ color: 0x8B7355 });
        
        for (let i = 0; i < 4; i++) {
            const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
            blade.rotation.z = (i * Math.PI) / 2;
            blades.add(blade);
        }

        blades.position.y = 11.5;
        windmill.add(blades);

        // Windmill house
        const houseGeometry = new THREE.BoxGeometry(3, 3, 3);
        const houseMaterial = new THREE.MeshLambertMaterial({ color: 0xC19A6B });
        const house = new THREE.Mesh(houseGeometry, houseMaterial);
        house.position.y = 9;
        windmill.add(house);

        windmill.position.set(x, 0, z);
        windmill.castShadow = true;
        
        // Store blades for animation
        windmill.userData.blades = blades;
        return windmill;
    }

    static createCattleFarm(x, z, width = 20, height = 15) {
        const farm = new THREE.Group();

        // Fence around the farm
        const fenceGroup = new THREE.Group();
        const fencePostGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
        const fencePostMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        
        const fenceRailGeometry = new THREE.BoxGeometry(width, 0.1, 0.1);
        const fenceRailMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });

        // Create fence posts and rails
        for (let i = -width/2; i <= width/2; i += 2) {
            for (let j = -height/2; j <= height/2; j += 2) {
                if (i === -width/2 || i === width/2 || j === -height/2 || j === height/2) {
                    const post = new THREE.Mesh(fencePostGeometry, fencePostMaterial);
                    post.position.set(i, 0.75, j);
                    fenceGroup.add(post);
                }
            }
        }

        // Horizontal rails
        for (let y = 0.3; y <= 1.2; y += 0.4) {
            const topRail = new THREE.Mesh(fenceRailGeometry, fenceRailMaterial);
            topRail.position.set(0, y, -height/2);
            fenceGroup.add(topRail);

            const bottomRail = new THREE.Mesh(fenceRailGeometry, fenceRailMaterial);
            bottomRail.position.set(0, y, height/2);
            fenceGroup.add(bottomRail);

            const leftRail = new THREE.Mesh(fenceRailGeometry, fenceRailMaterial);
            leftRail.rotation.y = Math.PI / 2;
            leftRail.position.set(-width/2, y, 0);
            fenceGroup.add(leftRail);

            const rightRail = new THREE.Mesh(fenceRailGeometry, fenceRailMaterial);
            rightRail.rotation.y = Math.PI / 2;
            rightRail.position.set(width/2, y, 0);
            fenceGroup.add(rightRail);
        }

        // Farm shed
        const shedGeometry = new THREE.BoxGeometry(8, 4, 6);
        const shedMaterial = new THREE.MeshLambertMaterial({ color: 0xCD853F });
        const shed = new THREE.Mesh(shedGeometry, shedMaterial);
        shed.position.set(-3, 2, 0);
        fenceGroup.add(shed);

        // Hay bales
        const hayGeometry = new THREE.BoxGeometry(2, 1.5, 1.5);
        const hayMaterial = new THREE.MeshLambertMaterial({ color: 0xDAA520 });
        
        for (let i = 0; i < 4; i++) {
            const hay = new THREE.Mesh(hayGeometry, hayMaterial);
            hay.position.set(5 + i * 1.5, 0.75, 3);
            hay.rotation.y = Math.random() * Math.PI;
            fenceGroup.add(hay);
        }

        // Feeding trough
        const troughGeometry = new THREE.BoxGeometry(6, 0.5, 1);
        const troughMaterial = new THREE.MeshLambertMaterial({ color: 0x8B7355 });
        const trough = new THREE.Mesh(troughGeometry, troughMaterial);
        trough.position.set(0, 0.25, -4);
        fenceGroup.add(trough);

        farm.add(fenceGroup);
        farm.position.set(x, 0, z);
        farm.castShadow = true;
        
        return farm;
    }

    static createMarketStall(x, z) {
        const stall = new THREE.Group();

        // Stall base
        const baseGeometry = new THREE.BoxGeometry(4, 3, 3);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: 0xD2B48C });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 1.5;
        stall.add(base);

        // Stall roof
        const roofGeometry = new THREE.ConeGeometry(3, 2, 4);
        const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 3.5;
        roof.rotation.y = Math.PI / 4;
        stall.add(roof);

        // Counter
        const counterGeometry = new THREE.BoxGeometry(3, 1, 0.5);
        const counterMaterial = new THREE.MeshLambertMaterial({ color: 0x8B7355 });
        const counter = new THREE.Mesh(counterGeometry, counterMaterial);
        counter.position.set(0, 0.5, 1.5);
        stall.add(counter);

        // Goods on counter (simple representation)
        const goodsGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const goodsMaterial = new THREE.MeshLambertMaterial({ color: 0xFF6347 });
        
        for (let i = -1; i <= 1; i += 1) {
            const good = new THREE.Mesh(goodsGeometry, goodsMaterial);
            good.position.set(i * 0.5, 1.2, 1.5);
            stall.add(good);
        }

        stall.position.set(x, 0, z);
        stall.castShadow = true;
        return stall;
    }
}