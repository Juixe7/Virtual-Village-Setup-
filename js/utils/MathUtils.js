import * as THREE from 'three';

export class MathUtils {
    // Linear interpolation
    static lerp(a, b, t) {
        return a + (b - a) * t;
    }

    // Clamp value between min and max
    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    // Map value from one range to another
    static map(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    // Smooth step interpolation
    static smoothStep(edge0, edge1, x) {
        const t = this.clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
        return t * t * (3.0 - 2.0 * t);
    }

    // Random float between min and max
    static randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Random integer between min and max (inclusive)
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Random point on circle
    static randomPointOnCircle(radius) {
        const angle = Math.random() * Math.PI * 2;
        return new THREE.Vector2(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius
        );
    }

    // Random point in circle
    static randomPointInCircle(radius) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * radius;
        return new THREE.Vector2(
            Math.cos(angle) * r,
            Math.sin(angle) * r
        );
    }

    // Random point on sphere
    static randomPointOnSphere(radius) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        
        return new THREE.Vector3(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
    }

    // Distance between two 2D points
    static distance2D(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Convert degrees to radians
    static degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Convert radians to degrees
    static radToDeg(radians) {
        return radians * (180 / Math.PI);
    }

    // Check if point is in circle
    static pointInCircle(pointX, pointY, circleX, circleY, radius) {
        const distance = this.distance2D(pointX, pointY, circleX, circleY);
        return distance <= radius;
    }

    // Check if point is in rectangle
    static pointInRect(pointX, pointY, rectX, rectY, rectWidth, rectHeight) {
        return pointX >= rectX && 
               pointX <= rectX + rectWidth && 
               pointY >= rectY && 
               pointY <= rectY + rectHeight;
    }

    // Generate Perlin-like noise (simplified)
    static simpleNoise(x, y) {
        return Math.sin(x * 12.9898 + y * 78.233) * 43758.5453 % 1;
    }

    // Easing functions
    static easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    static easeOutCubic(t) {
        return (--t) * t * t + 1;
    }

    static easeInBack(t) {
        const s = 1.70158;
        return t * t * ((s + 1) * t - s);
    }

    // Vector utilities
    static vectorLerp(v1, v2, t) {
        return new THREE.Vector3(
            this.lerp(v1.x, v2.x, t),
            this.lerp(v1.y, v2.y, t),
            this.lerp(v1.z, v2.z, t)
        );
    }

    // Check if two spheres intersect
    static spheresIntersect(sphere1, sphere2) {
        const distance = sphere1.position.distanceTo(sphere2.position);
        return distance < (sphere1.radius + sphere2.radius);
    }

    // Generate random color
    static randomColor() {
        return new THREE.Color(Math.random(), Math.random(), Math.random());
    }

    // Generate random pastel color
    static randomPastelColor() {
        return new THREE.Color(
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.5 + 0.5
        );
    }

    // Calculate normal from three points
    static calculateNormal(pointA, pointB, pointC) {
        const vectorAB = new THREE.Vector3().subVectors(pointB, pointA);
        const vectorAC = new THREE.Vector3().subVectors(pointC, pointA);
        const normal = new THREE.Vector3().crossVectors(vectorAB, vectorAC);
        return normal.normalize();
    }
}

// You can also export individual functions if needed
export const lerp = MathUtils.lerp;
export const clamp = MathUtils.clamp;
export const map = MathUtils.map;
export const randomFloat = MathUtils.randomFloat;
export const randomInt = MathUtils.randomInt;