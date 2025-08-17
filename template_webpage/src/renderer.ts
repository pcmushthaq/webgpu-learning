import { createShaderModule } from './utils/shader-loader.js';

export class WebGPURenderer {
  private device: GPUDevice;
  private context: GPUCanvasContext;
  private pipeline!: GPURenderPipeline;
  
  private canvas: HTMLCanvasElement;

  constructor(device: GPUDevice, canvas: HTMLCanvasElement) {
    this.device = device;
    this.canvas = canvas;
    this.context = this.setupCanvas();
  
  }

  private setupCanvas(): GPUCanvasContext {
    const context = this.canvas.getContext('webgpu');
    if (!context) {
      throw new Error("Failed to get WebGPU context");
    }

    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
      device: this.device,
      format: presentationFormat,
    });

    return context;
  }

  private getRenderPassDescriptor(context: GPUCanvasContext): GPURenderPassDescriptor {
    return {
      label: 'our basic canvas renderPass',
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          clearValue: [0.3, 0.3, 0.3, 1],
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    };
  }

  async initialize(): Promise<void> {
    // Load shader from external file
    const module = await createShaderModule(
      this.device, 
      './src/shaders/triangle.wgsl',
      'our hardcoded red triangle shaders'
    );

    // Create render pipeline
    this.pipeline = this.device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module,
        entryPoint: 'vs',
      },
      fragment: {
        module,
        entryPoint: 'fs',
        targets: [{
          format: navigator.gpu.getPreferredCanvasFormat(),
        }]
      }
    });
  }

  render(): void {
    // Get current texture view from canvas
    const renderPassDescriptor = this.getRenderPassDescriptor(this.context);
    // Create command encoder and render pass
    const encoder = this.device.createCommandEncoder({ label: 'our encoder' });
    const pass = encoder.beginRenderPass(renderPassDescriptor);
    
    pass.setPipeline(this.pipeline);
    pass.draw(3);
    pass.end();

    // Submit commands to GPU
    const commandBuffer = encoder.finish();
    this.device.queue.submit([commandBuffer]);
  }

  setupResizeObserver(): void {
    const observer = new ResizeObserver(() => {
      const width = this.canvas.clientWidth;
      const height = this.canvas.clientHeight;
      this.canvas.width = Math.max(1, Math.min(width, this.device.limits.maxTextureDimension2D));
      this.canvas.height = Math.max(1, Math.min(height, this.device.limits.maxTextureDimension2D));
      
      // Re-render
      this.render();
    });
    observer.observe(this.canvas);
  }
} 