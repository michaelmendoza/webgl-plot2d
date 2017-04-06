 
 var Loader = function() {
 	var loader = {};

 	loader.loadShaderAsync = function(shaderURL, callback) {
		var req = new XMLHttpRequest();
		req.open('GET', shaderURL, true);
		req.onload = function() {
			if (req.status < 200 || req.status >= 300)
				callback('Error: Could not load shader ' + shaderURL);
			else 
				callback(null, req.responseText);
		}
		req.send();
	}

	loader.loadImage = function(filename, callback) {
		var image = new Image();
		image.onload = function() {
			callback(image);
		}
		image.src = filename;
		return image;
	}

	return loader;
 }();