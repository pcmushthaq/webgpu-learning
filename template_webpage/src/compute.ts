import { createShaderModule } from "./utils/shader-loader";

export class WebGPUComputeEngine {
  private device: GPUDevice;
  private pipeline!: GPUComputePipeline;

  constructor(device: GPUDevice) {
    this.device = device;
  }

  async initialize(): Promise<void> {
    const module = await createShaderModule(
      this.device,
      "./src/shaders/multiply.wgsl",
      "basic compute shader"
    );
    this.pipeline = this.device.createComputePipeline({
      layout: "auto",
      label: "simple compute pipeline",
      compute: {
        module,
        entryPoint: "computeSomething",
      },
    });
  }

  async compute(): Promise<void> {
    console.time("compute");
    const input = new Float32Array(
      Array.from({ length: 100000 }, (_, i) => i + 1)
    );
    // create a buffer on the GPU to hold our computation
    // input and output
    const workBuffer = this.device.createBuffer({
      label: "work buffer",
      size: input.byteLength,
      usage:
        GPUBufferUsage.STORAGE |
        GPUBufferUsage.COPY_SRC |
        GPUBufferUsage.COPY_DST,
    });
    // Copy our input data to that buffer
    this.device.queue.writeBuffer(workBuffer, 0, input);

    // create a buffer on the GPU to get a copy of the results
    const resultBuffer = this.device.createBuffer({
      label: "result buffer",
      size: input.byteLength,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    });

    // Setup a bindGroup to tell the shader which
    // buffer to use for the computation
    const bindGroup = this.device.createBindGroup({
      label: "bindGroup for work buffer",
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: workBuffer } }],
    });

    const encoder = this.device.createCommandEncoder({
      label: "doubling encoder",
    });
    const pass = encoder.beginComputePass({
      label: "compute pass",
    });
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(input.length);
    pass.end();
    encoder.copyBufferToBuffer(
      workBuffer,
      0,
      resultBuffer,
      0,
      resultBuffer.size
    );
    const commandBuffer = encoder.finish();
    this.device.queue.submit([commandBuffer]);

    await resultBuffer.mapAsync(GPUMapMode.READ);
    const result = new Float32Array(resultBuffer.getMappedRange());

    console.log("input", input);
    console.log("result", result);

    resultBuffer.unmap();
    console.timeEnd("compute");
  }
}
