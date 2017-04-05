
var Program = function(gl, callback) {
	this.gl = gl;
	this.callback = callback;

	this.loadShaders();
}

Program.prototype = {
	constructor: Program,
	
	loadShaders: function() {
		async.map({
			vsText: '/plot.vs.glsl',
			fsText: '/plot.fs.glsl'
		}, Loader.loadShaderAsync, this.initProgram.bind(this));
	},

	initProgram: function(loadErrors, loadedShaders) {
		this.program = this.createProgram(loadedShaders);
		this.setupShaders(this.program);
		this.uniforms = this.setupUniforms(this.program);
		this.callback();
	},

	createProgram: function(loadedShaders) {
		var gl = this.gl;
		var vs = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vs, loadedShaders[0]);
		gl.compileShader(vs);
		if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
			console.log('Error: Unable to compile vertex shader', gl.getShaderInfoLog(vs));
		}

		var fs = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fs, loadedShaders[1]);
		gl.compileShader(fs);
		if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
			console.log('Error: Unable to compile fragment shader', gl.getShaderInfoLog(fs));
		}

		var program = gl.createProgram();
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.log('Error: Shader Program Link Error', gl.getProgramInfoLog(program));
		}
		gl.validateProgram(program);
		if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
			console.log('Error: Shader Program Validate Error', gl.getProgramInfoLog(program));
		}
		gl.useProgram(program);

		return program;
	},

	setupShaders: function(program) { 
		var gl = this.gl;

		// Create buffers
		var vertexBuffer = gl.createBuffer();
		var vertices = [ -1, 1, -1, -1, 1, -1, -1, 1, 1, 1, 1, -1 ];
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		var vPosAttrib = gl.getAttribLocation(program, 'vPos');
		gl.vertexAttribPointer(vPosAttrib,2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
		gl.enableVertexAttribArray(vPosAttrib);
	},

	setupUniforms: function(program) { 
		var gl = this.gl;
		
		// Get uniform locations
		var uniforms = {
			viewportDimensions: gl.getUniformLocation(program, 'viewportDimensions'),
			yMin: gl.getUniformLocation(program, 'yMin'),
			yMax: gl.getUniformLocation(program, 'yMax'),
			xMin: gl.getUniformLocation(program, 'xMin'),
			xMax: gl.getUniformLocation(program, 'xMax')
		}

		return uniforms;
	}
}