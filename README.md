# Three.js Village Landscape 🏞️

A comprehensive 3D infinite village landscape built with Three.js featuring advanced computer graphics techniques including procedural terrain generation, realistic lighting, and interactive environment.

![Village Landscape](https://img.shields.io/badge/Three.js-3D%20Graphics-orange) ![WebGL](https://img.shields.io/badge/WebGL-Interactive-green) ![Procedural Generation](https://img.shields.io/badge/Procedural-Generation-blue)

## 🌟 Features

- **Infinite Terrain Generation** with chunk-based loading
- **Procedural Village** with different house types and structures
- **Dynamic Environment** with day-night cycle and weather effects
- **Interactive Characters** and animals with behaviors
- **Realistic Lighting** with shadows and ambient occlusion
- **Optimized Performance** with level-of-detail rendering

## 🏗️ Project Structure
threejs-village-landscape/
├── js/
│   ├── main.js             # Application entry point
│   ├── core/
│   │   ├── InfiniteLandscape.js # Main application class
│   │   ├── TerrainManager.js    # Terrain generation system
│   │   └── AssetLoader.js       # Resource management
│   ├── entities/
│   │   ├── Character.js    # Human character system
│   │   ├── Animal.js       # Animal behaviors and types
│   │   ├── House.js        # Building generation
│   │   └── Structures.js   # Environmental structures
│   ├── Environment.js      # Sky, clouds, atmosphere
│   └── utils/
│       ├── MathUtils.js    # Mathematical utilities
│       └── Noise.js        # Procedural noise functions
├── libs/
│   ├── GLTFLoader.js       # 3D model loader
│   └── OrbitControls.js    # Camera controls
├── index.html              # Main HTML file
└── package.json            # Project dependencies

## 🎮 Controls

- **Mouse**: Look around
- **WASD**: Move around the world
- **Mouse Wheel**: Zoom in/out

## 🖥️ Computer Graphics Techniques Used

### 1. **Procedural Terrain Generation**
   - **Perlin Noise** for natural height variations
   - **Chunk-based LOD** for infinite world rendering
   - **Vertex Shading** for terrain color variation
   - **Geometry Instancing** for optimized rendering

### 2. **Advanced Lighting System**
   - **Directional Lighting** (Sun simulation)
   - **Ambient Lighting** for global illumination
   - **Hemisphere Lighting** for sky/ground color bleeding
   - **Shadow Mapping** with PCF soft shadows
   - **Emissive Materials** for glowing effects

### 3. **3D Modeling & Rendering**
   - **Mesh Construction** programmatically generated buildings
   - **Hierarchical Transformations** for complex objects
   - **Material Systems** with Lambert and Basic materials
   - **Backface Culling** and depth testing optimization

### 4. **Animation Systems**
   - **RequestAnimationFrame** for smooth 60fps rendering
   - **Delta Time Calculation** for frame-rate independent movement
   - **Procedural Animation** for character and animal movements
   - **Transform Hierarchy** for complex object animations

### 5. **Scene Management**
   - **Object Culling** for performance optimization
   - **Frustum Culling** to avoid rendering off-screen objects
   - **Level of Detail (LOD)** for distant objects
   - **Memory Management** with proper disposal

### 6. **Camera Systems**
   - **Orbit Controls** for intuitive camera movement
   - **Perspective Projection** for 3D depth perception
   - **Camera Frustum** management for optimal rendering

### 7. **Resource Management**
   - **Async Asset Loading** for textures and models
   - **Memory Pooling** for frequently used objects
   - **Garbage Collection** prevention through object reuse

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Juixe7/Virtual-Village-Setup-.git
   cd threejs-village-landscape

2. **Install dependencies**
   ```bash
   npm install
3. Run the development server
  ```bash
  npm run dev
