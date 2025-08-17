/// <reference types="@webgpu/types" />

/**
 * Main WebGPU application function
 * Sets up GPU device, canvas context, shaders, and renders a red triangle
 */

import { main } from './index.js';

async function start() {
    if (!navigator.gpu) {
      console.error('this browser does not support WebGPU');
      return;
    }
  
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      console.error('this browser supports webgpu but it appears disabled');
      return;
    }
  
    const device = await adapter.requestDevice();
    device.lost.then((info) => {
      console.error(`WebGPU device was lost: ${info.message}`);
  
      // 'reason' will be 'destroyed' if we intentionally destroy the device.
      if (info.reason !== 'destroyed') {
        // try again
        start();
      }
    });
    
    main(device);
  }


  start();
  
  