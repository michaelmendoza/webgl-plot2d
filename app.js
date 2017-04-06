			
function Init() {

	var canvas = document.getElementById('webgl-viewer');
	var renderer = new Renderer(canvas);

	var image = Loader.loadImage('assets/simpleMask.png', function(img) {
		renderer.props.texture = renderer.program.setupTexture(img);
	});
	
}