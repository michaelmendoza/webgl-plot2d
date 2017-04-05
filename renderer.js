
var Renderer = function(canvas) {	
	this.init(canvas);
}

Renderer.prototype = {
	constructor: Renderer,

	init: function(canvas) {
		this.canvas = canvas;

		this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		if(!this.gl) {
			console.log('Error: Webgl not supported');
			return;
		}

		this.props = { 
			// Set CPU-side variables for all our shader varibles
			vpDimensions:[canvas.width, canvas.height],
			yMin: -1.0,
			yMax: 1.0,
			xMin: -1.0,
			xMax: 1.0
		}

		window.addEventListener('resize', this.onResizeWindow.bind(this));
		window.addEventListener('wheel', this.onZoom.bind(this));
		window.addEventListener('mousemove', this.onMouseMove.bind(this));

		this.program = new Program(this.gl, this.startRender.bind(this));
	},

	render: function() {
		var gl = this.gl;

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

		var uniforms = this.program.uniforms;
		gl.uniform2fv(uniforms.viewportDimensions, this.props.vpDimensions);
		gl.uniform1f(uniforms.yMin, this.props.yMin);
		gl.uniform1f(uniforms.yMax, this.props.yMax);
		gl.uniform1f(uniforms.xMin, this.props.xMin);
		gl.uniform1f(uniforms.xMax, this.props.xMax);

		gl.drawArrays(gl.TRIANGLES, 0, 6);

		requestAnimationFrame(this.render.bind(this));
	},

	startRender: function() {
		requestAnimationFrame(this.render.bind(this));
		this.onResizeWindow()
	},

	onResizeWindow: function() {
		console.log('Window Resized');
		var canvas = this.canvas;
		if(!canvas)
			return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		vpDimensions = [canvas.width, canvas.height];

		var oldRealRange = this.props.xMax - this.props.xMin;
		this.props.xMax = (this.props.yMax - this.props.yMin) * (canvas.width / canvas.height) / 1.4 + this.props.xMin;
		var newRealRange = this.props.xMax - this.props.xMin;

		this.props.xMin -= (newRealRange - oldRealRange) / 2;
		this.props.xMax = (this.props.yMax - this.props.yMin) * (canvas.width / canvas.height) / 1.4 + this.props.xMin;

		this.gl.viewport(0, 0, canvas.width, canvas.height);
	},

	onZoom: function(e) {
		var imaginaryRange = this.props.yMax - this.props.yMin;
		var newRange;
		if(e.deltaY < 0) {
			newRange = imaginaryRange * 0.95;
		}
		else {
			newRange = imaginaryRange * 1.05;
		}

		var delta = newRange - imaginaryRange;
		this.props.yMin -= delta / 2;
		this.props.yMax = this.props.yMin + newRange;
		
		this.onResizeWindow();
	},

	onMouseMove: function(e) {
		if(e.buttons == 1) {
			var iRange = this.props.yMax - this.props.yMin;
			var rRange = this.props.xMax - this.props.xMin;

			var iDelta = (e.movementY / canvas.height) * iRange;
			var rDelta = (e.movementX / canvas.width) * rRange;

			this.props.yMin += iDelta;
			this.props.yMax += iDelta;
			this.props.xMin -= rDelta;
			this.props.xMax -= rDelta;
		}
	}	

}