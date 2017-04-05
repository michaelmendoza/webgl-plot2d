
#define M_PI 3.1415926535897932384626433832795

precision highp float;

uniform vec2 viewportDimensions;
uniform float yMin;
uniform float yMax;
uniform float xMin;
uniform float xMax;

void main() {

	vec2 c = vec2(
		gl_FragCoord.x * (xMax - xMin) / viewportDimensions.x + xMin,
		gl_FragCoord.y * (yMax - yMin) / viewportDimensions.y + yMin
	);

	gl_FragColor = vec4(M_PI * sin(c[0]) * sin(c[0]), 0.0, 0.0, 1.0);
}