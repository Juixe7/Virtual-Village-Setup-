import { GLTFLoader as ThreeGLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Create and export a GLTFLoader instance
class GLTFLoaderWrapper {
    constructor() {
        this.loader = new ThreeGLTFLoader();
    }

    load(url, onLoad, onProgress, onError) {
        return this.loader.load(url, onLoad, onProgress, onError);
    }

    setPath(path) {
        this.loader.setPath(path);
        return this;
    }

    setResourcePath(path) {
        this.loader.setResourcePath(path);
        return this;
    }

    setCrossOrigin(crossOrigin) {
        this.loader.setCrossOrigin(crossOrigin);
        return this;
    }

    parse(data, path, onLoad, onError) {
        return this.loader.parse(data, path, onLoad, onError);
    }
}

// Export both the class and a default instance
export { GLTFLoaderWrapper as GLTFLoader };
export default new GLTFLoaderWrapper();