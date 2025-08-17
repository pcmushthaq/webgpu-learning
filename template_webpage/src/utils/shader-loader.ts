/**
 * Utility for loading WGSL shader files
 */
export async function loadShader(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load shader: ${response.statusText}`);
  }
  return await response.text();
}

/**
 * Load and create a shader module from a WGSL file
 */
export async function createShaderModule(
  device: GPUDevice, 
  shaderPath: string, 
  label?: string
): Promise<GPUShaderModule> {
  const shaderCode = await loadShader(shaderPath);
  return device.createShaderModule({
    label,
    code: shaderCode,
  });
} 