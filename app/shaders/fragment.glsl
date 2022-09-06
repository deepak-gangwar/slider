precision highp float;
precision highp int;

uniform sampler2D texture;
uniform sampler2D maskTexture;
uniform float speed;
uniform vec2 meshSize;
uniform vec2 imageSize;
uniform vec2 maskPosition;

varying vec2 vUv;


// For setting image textures as background-size: cover in CSS
vec2 backgroundCoverUv(vec2 screenSize, vec2 imageSize, vec2 uv) {
    float screenRatio = screenSize.x / screenSize.y;
    float imageRatio = imageSize.x / imageSize.y;

    vec2 newSize = screenRatio < imageRatio
        ? vec2(imageSize.x * screenSize.y / imageSize.y, screenSize.y)
        : vec2(screenSize.x, imageSize.y * screenSize.x / imageSize.x);

    vec2 newOffset = (screenRatio < imageRatio
        ? vec2((newSize.x - screenSize.x) / 2.0, 0.0)
        : vec2(0.0, (newSize.y - screenSize.y) / 2.0)) / newSize;
        return uv * screenSize / newSize + newOffset;
}

void main() {
    vec2 uv = vec2(vUv.x, vUv.y);
    vec2 texUv = backgroundCoverUv(meshSize, imageSize, uv);

    vec4 textureColor = texture2D(texture, texUv);

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