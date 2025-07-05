varying vec2 vUv;
varying vec3 vPosition;
varying float vAudioStrength;

uniform float u_time;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform float u_audioData[8];
uniform float u_waveAmplitude;
uniform float u_waveFrequency;

void main() {
  vUv = uv;
  vPosition = position;
  
  // Calculate audio-reactive displacement
  vec3 pos = position;
  
  // Create wave based on position and audio
  float audioSum = 0.0;
  for (int i = 0; i < 8; i++) {
    audioSum += u_audioData[i];
  }
  audioSum /= 8.0;
  
  // Horizontal waves influenced by bass
  float waveX = sin(pos.x * u_waveFrequency + u_time * 2.0) * u_bass * u_waveAmplitude;
  float waveY = cos(pos.x * u_waveFrequency * 0.5 + u_time * 1.5) * u_mid * u_waveAmplitude * 0.5;
  
  // Vertical displacement based on audio intensity
  pos.z += waveX + waveY;
  pos.y += sin(pos.x * 5.0 + u_time) * u_treble * u_waveAmplitude * 0.3;
  
  // Add ripple effect from center
  float distanceFromCenter = length(pos.xy);
  float ripple = sin(distanceFromCenter * 10.0 - u_time * 3.0) * audioSum * u_waveAmplitude * 0.2;
  pos.z += ripple;
  
  // Pass audio strength to fragment shader
  vAudioStrength = audioSum;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}