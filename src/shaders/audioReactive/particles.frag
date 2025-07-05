varying vec3 vColor;
varying float vAlpha;

uniform float u_time;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform vec3 u_particleColorA;
uniform vec3 u_particleColorB;
uniform vec3 u_particleColorC;

void main() {
  // Create circular particle shape
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  
  // Discard pixels outside circle
  if (dist > 0.5) {
    discard;
  }
  
  // Soft edges
  float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
  alpha *= vAlpha;
  
  // Dynamic color mixing based on audio frequencies
  vec3 color = u_particleColorA * u_bass;
  color += u_particleColorB * u_mid;
  color += u_particleColorC * u_treble;
  
  // Add base color variation
  color += vColor * 0.3;
  
  // Pulse effect
  float pulse = sin(u_time * 10.0) * 0.5 + 0.5;
  color *= 0.8 + pulse * 0.2 * u_bass;
  
  // Add glow effect to center
  float glow = 1.0 - dist * 2.0;
  color += vec3(glow * 0.5);
  
  // Ensure color values are normalized
  color = clamp(color, 0.0, 1.0);
  
  gl_FragColor = vec4(color, alpha);
}