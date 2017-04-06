
#define M_PI 3.1415926535897932384626433832795

precision highp float;

varying vec2 fragTexCoord;
uniform vec2 viewportDimensions;
uniform float yMin;
uniform float yMax;
uniform float xMin;
uniform float xMax;
uniform sampler2D uSampler;

void renderPlot() {
	vec2 c = vec2(
		gl_FragCoord.x * (xMax - xMin) / viewportDimensions.x + xMin,
		gl_FragCoord.y * (yMax - yMin) / viewportDimensions.y + yMin
	);
	gl_FragColor = vec4(M_PI * sin(c[0]) * sin(c[0]), 0.0, 0.0, 1.0);
}

void renderImg() {
	gl_FragColor = texture2D(uSampler, fragTexCoord);
}

void renderImg2() {
	vec2 c = vec2(
		gl_FragCoord.x * (xMax - xMin) / viewportDimensions.x + xMin,
		gl_FragCoord.y * (yMax - yMin) / viewportDimensions.y + yMin
	);

	gl_FragColor = texture2D(uSampler, c);
}

void main() {
	renderPlot();
	//renderImg();
}
