varying vec2 vUv;
varying vec3 vPosition;

uniform float u_time;
uniform float u_bass;
uniform float u_mid;

void main() {
  vUv = uv;
  vPosition = position;
  
  vec3 pos = position;
  
  // Subtle vertex displacement for fractal plane
  // This creates a gentle warping effect
  float displacement = sin(pos.x * 3.0 + u_time) * u_bass * 0.1;
  displacement += cos(pos.y * 3.0 + u_time * 0.7) * u_mid * 0.1;
  pos.z += displacement;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}