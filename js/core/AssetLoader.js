import * as THREE from 'three';

export class AssetLoader {
    constructor() {
        this.textures = new Map();
        this.models = new Map();
        this.audio = new Map();
    }

    async loadTexture(url, name) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.TextureLoader();
            loader.load(
                url,
                (texture) => {
                    this.textures.set(name, texture);
                    resolve(texture);
                },
                undefined,
                (error) => {
                    console.error(`Error loading texture ${name}:`, error);
                    reject(error);
                }
            );
        });
    }

    async loadTextures(textureList) {
        const promises = textureList.map(({ url, name }) => 
            this.loadTexture(url, name)
        );
        return Promise.all(promises);
    }

    getTexture(name) {
        return this.textures.get(name);
    }

    // Method to create procedural textures
    createProceduralTexture(name, width = 256, height = 256) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');

        // Create a simple gradient texture
        const gradient = context.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#3a7d34');
        gradient.addColorStop(0.5, '#4CAF50');
        gradient.addColorStop(1, '#2E7D32');

        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);

        // Add some noise for texture variation
        const imageData = context.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 10;
            data[i] = Math.min(255, data[i] + noise);     // R
            data[i + 1] = Math.min(255, data[i + 1] + noise); // G
            data[i + 2] = Math.min(255, data[i + 2] + noise); // B
        }

        context.putImageData(imageData, 0, 0);

        const texture = new THREE.CanvasTexture(canvas);
        this.textures.set(name, texture);
        return texture;
    }

    // Clean up resources
    dispose() {
        this.textures.forEach(texture => texture.dispose());
        this.textures.clear();
        this.models.clear();
        this.audio.clear();
    }
}