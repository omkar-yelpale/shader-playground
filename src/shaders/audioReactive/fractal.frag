varying vec2 vUv;
varying vec3 vPosition;

uniform float u_time;
uniform float u_audioData[8];
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;
uniform vec2 u_resolution;
uniform float u_complexity;
uniform float u_fractalIterations;
uniform vec3 u_fractalColorA;
uniform vec3 u_fractalColorB;
uniform vec3 u_fractalColorC;

// 2D noise function
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  
  vec2 u = f * f * (3.0 - 2.0 * f);
  
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Fractal brownian motion
float fbm(vec2 p, float audioLevel) {
  float value = 0.0;
  float amplitude = 0.5 + audioLevel * 0.5;
  float frequency = 1.0;
  
  for (int i = 0; i < 6; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  
  return value;
}

// Mandelbrot-like fractal influenced by audio
vec3 audioFractal(vec2 uv, float audioInfluence) {
  vec2 c = uv * u_complexity;
  vec2 z = c;
  
  float iterations = u_fractalIterations;
  float n = 0.0;
  
  for (float i = 0.0; i < 50.0; i++) {
    if (i >= iterations) break;
    
    // Modified mandelbrot with audio influence
    float x = z.x * z.x - z.y * z.y + c.x;
    float y = 2.0 * z.x * z.y + c.y;
    
    // Add audio distortion
    x += sin(u_time + audioInfluence) * u_bass * 0.1;
    y += cos(u_time * 0.7 + audioInfluence) * u_mid * 0.1;
    
    z = vec2(x, y);
    
    if (length(z) > 2.0) {
      n = i / iterations;
      break;
    }
  }
  
  return vec3(n);
}

void main() {
  vec2 uv = vUv - 0.5;
  uv *= 2.0;
  
  // Calculate audio influence
  float audioSum = 0.0;
  for (int i = 0; i < 8; i++) {
    audioSum += u_audioData[i];
  }
  audioSum /= 8.0;
  
  // Create moving fractal pattern
  vec2 fractalUV = uv;
  fractalUV += vec2(sin(u_time * 0.1) * 0.5, cos(u_time * 0.15) * 0.5);
  
  // Get fractal value
  vec3 fractal = audioFractal(fractalUV, audioSum);
  
  // Apply fractal brownian motion overlay
  float fbmValue = fbm(uv * 5.0 + u_time * 0.1, audioSum);
  fractal += vec3(fbmValue * 0.3);
  
  // Create color based on fractal and audio
  vec3 color = mix(u_fractalColorA, u_fractalColorB, fractal.x + u_bass * 0.3);
  color = mix(color, u_fractalColorC, fbmValue + u_treble * 0.3);
  
  // Add audio reactive color shifts
  float hueShift = u_time * 0.05 + audioSum * 0.2;
  color.r = color.r * cos(hueShift) - color.g * sin(hueShift);
  color.g = color.r * sin(hueShift) + color.g * cos(hueShift);
  
  // Add pulsing glow based on bass
  float glow = pow(u_bass, 2.0) * 0.5;
  color += vec3(glow * 0.8, glow * 0.5, glow * 1.0);
  
  // Kaleidoscope effect
  float angle = atan(uv.y, uv.x);
  float radius = length(uv);
  angle = mod(angle + u_time * 0.1, 3.14159 / 3.0) * 6.0;
  vec2 kaleidoUV = vec2(cos(angle), sin(angle)) * radius;
  
  // Mix with kaleidoscope pattern
  float kaleidoPattern = fbm(kaleidoUV * 3.0, u_mid);
  color = mix(color, vec3(kaleidoPattern), 0.3);
  
  // Ensure color values are in range
  color = clamp(color, 0.0, 1.0);
  
  gl_FragColor = vec4(color, 1.0);
}