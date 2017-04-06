precision highp float;

attribute vec2 vPosition;
attribute vec2 vTexCoord;
varying vec2 fragTexCoord;

void main() {
	fragTexCoord = vTexCoord;
	gl_Position = vec4(vPosition, 0.0, 1.0);
}
