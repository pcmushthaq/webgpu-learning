import { WebGPUComputeEngine } from "./compute.js";
import { WebGPURenderer } from "./renderer.js";

export async function main(device: GPUDevice) {
  // Get the canvas element from the DOM
  const canvas = document.querySelector("canvas");
  if (!canvas) {
    throw new Error("Failed to get canvas");
  }

  // Create renderer
  const renderer = new WebGPURenderer(device, canvas);

  // Initialize the renderer (loads shaders and creates pipeline)
  await renderer.initialize();

  // Setup resize observer
  renderer.setupResizeObserver();

  // Initial render
  renderer.render();
  console.log("rendered");

  const computeEngine = new WebGPUComputeEngine(device);
  await computeEngine.initialize();
  await computeEngine.compute();
  console.log("computed");
}
