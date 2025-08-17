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