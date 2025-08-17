# WebGPU Triangle Demo

A modern WebGPU application demonstrating how to render a simple red triangle using TypeScript and Vite.

## Features

- **Modern Build System**: Uses Vite for fast development and optimized builds
- **Separated Shaders**: WGSL shaders are stored in separate `.wgsl` files for better organization
- **TypeScript**: Full TypeScript support with proper type checking
- **Modular Architecture**: Clean separation of concerns with dedicated renderer class
- **Responsive Canvas**: Automatically handles window resizing

## Project Structure

```
template_webpage/
├── src/
│   ├── shaders/
│   │   └── triangle.wgsl          # Vertex and fragment shaders
│   ├── utils/
│   │   └── shader-loader.ts       # Utility for loading WGSL files
│   ├── renderer.ts                # WebGPU renderer class
│   ├── index.ts                   # Main rendering logic
│   └── app.ts                     # Application entry point
├── index.html                     # Main HTML file
├── vite.config.ts                 # Vite configuration
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- A WebGPU-compatible browser (Chrome Canary, Firefox Nightly, or Safari Technology Preview)

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:8000`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Code Organization

### 1. Shader Separation

Shaders are now stored in separate `.wgsl` files instead of being embedded in strings:

```wgsl
// src/shaders/triangle.wgsl
@vertex fn vs(@builtin(vertex_index) vertexIndex : u32) -> @builtin(position) vec4f {
  // Vertex shader code
}

@fragment fn fs() -> @location(0) vec4f {
  // Fragment shader code
}
```

### 2. Shader Loader Utility

The `shader-loader.ts` utility provides a clean way to load WGSL files:

```typescript
import { createShaderModule } from "./utils/shader-loader.js";

const module = await createShaderModule(
  device,
  "./src/shaders/triangle.wgsl",
  "label"
);
```

### 3. Renderer Class

The `WebGPURenderer` class encapsulates all rendering logic:

```typescript
const renderer = new WebGPURenderer(device, canvas);
await renderer.initialize();
renderer.setupResizeObserver();
renderer.render();
```

## Benefits of This Organization

1. **Maintainability**: Shader code is separated and can be edited with proper syntax highlighting
2. **Reusability**: The renderer class can be extended for different scenes
3. **Type Safety**: Full TypeScript support with proper type checking
4. **Scalability**: Easy to add more shaders, materials, and rendering features
5. **Development Experience**: Hot reload with Vite for faster development

## Browser Compatibility

This application requires WebGPU support. Currently available in:

- Chrome Canary (with flags enabled)
- Firefox Nightly (with flags enabled)
- Safari Technology Preview

## Troubleshooting

If you see a "WebGPU not supported" error:

1. Make sure you're using a compatible browser
2. Enable WebGPU flags in your browser settings
3. Check that your graphics drivers are up to date

## Next Steps

This project provides a solid foundation for WebGPU development. You can extend it by:

- Adding more complex shaders
- Implementing 3D transformations
- Adding texture support
- Creating interactive controls
- Implementing animation loops
