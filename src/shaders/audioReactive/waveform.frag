varying vec2 vUv;
varying vec3 vPosition;
varying float vAudioStrength;

uniform float u_time;
uniform float u_audioData[8];
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform vec3 u_colorA;
uniform vec3 u_colorB;
uniform vec3 u_colorC;
uniform float u_brightness;
uniform float u_contrast;

// HSV to RGB conversion
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  // Create dynamic color based on audio frequencies
  float hue = u_bass * 0.2 + u_time * 0.05;
  float saturation = 0.6 + u_mid * 0.4;
  float brightness = 0.5 + u_treble * 0.5;
  
  vec3 hsvColor = vec3(hue, saturation, brightness);
  vec3 baseColor = hsv2rgb(hsvColor);
  
  // Create gradient based on UV coordinates and audio
  vec3 gradientColor = mix(u_colorA, u_colorB, vUv.y + u_bass * 0.2);
  gradientColor = mix(gradientColor, u_colorC, vUv.x + u_mid * 0.2);
  
  // Blend between dynamic and gradient colors
  vec3 color = mix(baseColor, gradientColor, 0.5);
  
  // Add frequency band visualization as overlay
  float bandInfluence = 0.0;
  for (int i = 0; i < 8; i++) {
    float band = u_audioData[i];
    float wave = sin(vUv.x * 20.0 + float(i) * 2.0 + u_time * 3.0);
    bandInfluence += band * wave * 0.05;
  }
  
  // Apply band influence to color
  color += vec3(bandInfluence);
  
  // Add glow effect based on audio strength
  float glow = pow(vAudioStrength, 2.0) * 0.5;
  color += vec3(glow * 0.5, glow * 0.3, glow * 0.7);
  
  // Apply brightness and contrast
  color = color * u_brightness;
  color = (color - 0.5) * u_contrast + 0.5;
  
  // Ensure color values are in valid range
  color = clamp(color, 0.0, 1.0);
  
  gl_FragColor = vec4(color, 1.0);
}