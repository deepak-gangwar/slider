precision highp float;
precision highp int;

attribute vec2 uv;
attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

// added later on
uniform sampler2D maskTexture;
uniform float speed;
uniform float scale;
uniform vec2 maskPosition;
varying vec2 maskUv;

varying vec2 vUv;
varying vec3 vNormal;

varying vec3 newPosition;
varying vec4 maskColor;

void main() {
    // vNormal = normalize(normalMatrix * normal);
    
    vUv = uv;
    
    newPosition = vec3(position.x , position.y , position.z);

    maskUv = uv + maskPosition;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}