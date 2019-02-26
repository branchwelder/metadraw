var scale = 3;
var max_stroke = 2.5;

// Load default raster, Picard
var raster = new Raster('picard');
raster.visible = false;
raster.on('load', drawPaths);

function drawPaths() {
	raster.size = new Size(200, 290);

	project.activeLayer.removeChildren();

	for (var y = 0; y < raster.height; y++) {
		for(var x = 0; x < raster.width - 1; x++) {
			var color = raster.getPixel(x, y);
			var path = new Path();
			path.strokeColor = 'black';

			path.add(new Point(scale*x, scale*y));
			path.add(new Point(scale*x + scale, scale*y))

			// Set the stroke width of the line to match grayness
			path.strokeWidth = max_stroke * (1-color.gray);

			// TODO: this is just the visual representation. As this
			// is being created, also create a string of gcode with
			// these same features: vector length and speed. Faster
			// for lighter areas and slower for darker ones.
		}
	}
	// Center the magnificent artwork
	project.activeLayer.position = view.center;
}

function getGcode() {
	// TODO: this function will allow the user to download a .txt
	// file with the gcode in it, maybe? or is there some other
	// format that is better?
	console.log("YOLO SWAG");
}

function onDocumentDrag(event) {
	event.preventDefault();
}

function onDocumentDrop(event) {
	event.preventDefault();

	var file = event.dataTransfer.files[0];
	var reader = new FileReader();

	reader.onload = function (event) {
		var image = document.createElement('img');
		image.onload = function () {
			raster = new Raster(image);
			raster.visible = false;
			drawPaths();
		};
		image.src = event.target.result;
	};
	reader.readAsDataURL(file);
}

document.addEventListener('drop', onDocumentDrop, false);
document.addEventListener('dragover', onDocumentDrag, false);
document.addEventListener('dragleave', onDocumentDrag, false);