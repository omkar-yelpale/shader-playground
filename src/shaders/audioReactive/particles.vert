attribute float aRandom;
attribute vec3 aColor;

varying vec3 vColor;
varying float vAlpha;

uniform float u_time;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_audioData[8];
uniform float u_pointSize;
uniform float u_particleSpeed;

void main() {
  vColor = aColor;
  
  vec3 pos = position;
  
  // Audio-reactive radial expansion
  float audioSum = 0.0;
  for (int i = 0; i < 8; i++) {
    audioSum += u_audioData[i];
  }
  audioSum /= 8.0;
  
  // Expand particles based on bass
  float radius = 1.0 + u_bass * 2.0;
  pos *= radius;
  
  // Orbital motion influenced by mid frequencies
  float angle = u_time * u_particleSpeed * (0.5 + aRandom * 0.5);
  float orbitRadius = 0.2 + u_mid * 0.3;
  pos.x += cos(angle + aRandom * 6.28) * orbitRadius;
  pos.y += sin(angle + aRandom * 6.28) * orbitRadius;
  
  // Vertical oscillation based on treble
  pos.z += sin(u_time * 2.0 + aRandom * 6.28) * u_treble * 0.5;
  
  // Particle turbulence
  float turbulence = aRandom * audioSum;
  pos.x += sin(u_time + aRandom * 100.0) * turbulence * 0.1;
  pos.y += cos(u_time * 1.5 + aRandom * 100.0) * turbulence * 0.1;
  pos.z += sin(u_time * 0.7 + aRandom * 100.0) * turbulence * 0.1;
  
  // Calculate alpha based on distance from origin and audio
  float distanceFromCenter = length(pos);
  vAlpha = 1.0 - smoothstep(0.0, 3.0, distanceFromCenter);
  vAlpha *= 0.5 + audioSum * 0.5;
  
  // Dynamic point size based on audio and random variation
  gl_PointSize = u_pointSize * (1.0 + u_bass * 3.0) * (0.5 + aRandom * 0.5);
  
  // Apply perspective for depth
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize *= (300.0 / -mvPosition.z);
  
  gl_Position = projectionMatrix * mvPosition;
}