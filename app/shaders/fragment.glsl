precision highp float;
precision highp int;
uniform sampler2D texture;
uniform sampler2D maskTexture;
uniform float speed;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 newPosition;
uniform vec2 maskPosition;
varying vec2 maskUv;

void main() {

    vec3 normal = normalize(vNormal);
    vec4 textureColor = texture2D(texture, vUv);
    // vec4 maskColor = texture2D(maskTexture, maskUv);

    // textureColor.a = maskColor.r;

    gl_FragColor.rgb = textureColor.rgb;

    float distord = 0.2;
    float intensity = - speed * 8.;
    float distordLeft = distord + ((vUv.y * 2.) * (-intensity * (maskPosition.y - 0.5)));
    float distordRight = distord + ((vUv.y * 2.) * (intensity * (maskPosition.y - 0.5)));

    // Cool bubbly/curvy effect
    // float distordLeft = distord + (sin((vUv.y + maskPosition.y - 0.5) * 3.14) * (intensity));
    // float distordRight = distord + (sin((vUv.y + maskPosition.y - 0.5) * 3.14) * (- intensity));

    float maskLeft = 1. - smoothstep(vUv.x - 0.001, vUv.x + 0.001, (maskPosition.x - distordLeft) < 1.0 - (distordLeft * 2.0) ? maskPosition.x - distordLeft : 1.0 - (distordLeft * 2.0));
    float maskRight = smoothstep(vUv.x - 0.001, vUv.x + 0.001, (maskPosition.x + distordRight) > (distordRight * 2.0) ? maskPosition.x + distordRight : distordRight * 2.0 );

    float mask = min(maskLeft, maskRight);

    gl_FragColor.a = max(mask,-.1);

    // FOR IOS LOOOOOL
    gl_FragColor.rgb *= gl_FragColor.a;

}

// SIMPLE FRAGMENT SHADER USING TEXTURE
// precision highp float;

// uniform sampler2D texture;

// varying vec2 vUv;
// varying vec3 vNormal;

// void main() {
//     vec3 normal = normalize(vNormal);
//     vec3 tex = texture2D(texture, vUv).rgb;
    
//     // vec3 light = normalize(vec3(0.5, 1.0, -0.3));
//     // float shading = dot(normal, light) * 0.15;
    
//     // gl_FragColor.rgb = tex + shading;
//     gl_FragColor.rgb = tex;
//     gl_FragColor.a = 1.0;
// }