/// <reference types="@webgpu/types" />

/**
 * Main WebGPU application function
 * Sets up GPU device, canvas context, shaders, and renders a red triangle
 */
async function main() {
    // Step 1: Get GPU adapter and device
    // The adapter represents a physical GPU, device is the logical interface
    const adapter = await navigator?.gpu?.requestAdapter();
    const device = await adapter?.requestDevice();
    if(!device) {
        throw new Error("Failed to get GPU device");
    }

    // Step 2: Set up canvas and WebGPU context
    // Get the canvas element from the DOM
    const canvas = document.querySelector('canvas');
    if(!canvas) {
        throw new Error("Failed to get canvas");
    }
    
    // Get WebGPU context from the canvas
    const context = canvas.getContext('webgpu');
    if(!context) {
        throw new Error("Failed to get WebGPU context");
    }
    
    // Configure the context with the device and preferred format
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
      device,
      format: presentationFormat,
    });

    // Step 3: Create shader module
    // Define vertex and fragment shaders in WGSL (WebGPU Shading Language)
    const module = device.createShaderModule({
        label: 'our hardcoded red triangle shaders',
    code: `
      // Vertex shader: transforms vertices and passes data to fragment shader
      @vertex fn vs(
        @builtin(vertex_index) vertexIndex : u32  // Built-in vertex index (0, 1, 2)
      ) -> @builtin(position) vec4f {             // Returns clip-space position
        // Define triangle vertices in normalized device coordinates (NDC)
        let pos = array(
          vec2f( 0.0,  0.5),  // top center
          vec2f(-0.5, -0.5),  // bottom left
          vec2f( 0.5, -0.5)   // bottom right
        );
 
        // Return position as vec4f (x, y, z, w) where z=0, w=1 for 2D
        return vec4f(pos[vertexIndex], 0.0, 1.0);
      }
 
      // Fragment shader: determines color of each pixel
      @fragment fn fs() -> @location(0) vec4f {
        // Return solid red color (R=1.0, G=0.0, B=0.0, A=1.0)
        return vec4f(1.0, 0.0, 0.0, 1.0);
      }
    `,
    })

    // Step 4: Create render pipeline
    // Pipeline defines how vertices are processed and how fragments are colored
    const pipeline = device.createRenderPipeline({
        layout: 'auto',  // Automatic pipeline layout
        vertex: {
            module,           // Vertex shader module
            entryPoint: 'vs', // Entry point function name
        },
        fragment: {
            module,           // Fragment shader module
            entryPoint: 'fs', // Entry point function name
            targets: [{       // Output format for color attachment
                format: presentationFormat,
            }]
        }
    })

    // Step 5: Create render pass descriptor
    // Describes how to render to the canvas
    let renderPassDescriptor: GPURenderPassDescriptor = {
        label: 'our basic canvas renderPass',
        colorAttachments: [
          {
            // view: <- to be filled out when we render
            view: null as unknown as GPUTextureView,  // Will be set during render
            clearValue: [0.3, 0.3, 0.3, 1],          // Gray background color
            loadOp: 'clear',                          // Clear the attachment before drawing
            storeOp: 'store',                         // Store the result
          },
        ],
      }; 
      
      /**
       * Render function: executes the rendering pipeline
       * This function is called each frame to draw the triangle
       */
      function render() {
        if(!context || !device) {
            throw new Error("Failed to get WebGPU context");
        }
        
        // Step 6: Get current texture view from canvas
        // Get the current texture from the canvas context and
        // set it as the texture to render to.
        (renderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[])[0].view =
            context.getCurrentTexture().createView();
     
        // Step 7: Create command encoder and render pass
        // make a command encoder to start encoding commands
        const encoder = device.createCommandEncoder({ label: 'our encoder' });
     
        // make a render pass encoder to encode render specific commands
        const pass = encoder.beginRenderPass(renderPassDescriptor);
        pass.setPipeline(pipeline);  // Set the rendering pipeline
        pass.draw(3);                // Draw 3 vertices (triangle)
        pass.end();                  // End the render pass
     
        // Step 8: Submit commands to GPU
        const commandBuffer = encoder.finish();
        device.queue.submit([commandBuffer]);  // Submit to GPU for execution
      }

      // Execute the render function once
      render();
      console.log("rendered");
    
}

// Error handling for the main function
try {
    main();
} catch (error) {
    console.error(error);
}