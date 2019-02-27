var scale = 3;
var max_stroke = 2.5;
var max_feed_rate = 10000;
var min_feed_rate = 200;
var gcode = "G0 X0 Y0 Z0 F10000\nG0 Z0.3\n";

// Load default raster, Picard
var raster = new Raster('picard');
raster.visible = false;
raster.on('load', drawPaths);

function drawPaths() {
	raster.size = new Size(100, 100);

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

			var feed_rate = max_feed_rate * color.gray;

			feed_rate = (feed_rate > 500) ? feed_rate : 500;

			gcode = gcode.concat("G0 X"+(x+1)+" Y"+y+" F"+feed_rate+"\n");
		}
		gcode = gcode.concat("G0 Z0\n");
		gcode = gcode.concat("G0 X0 Y"+y+" F10000\n");
		gcode = gcode.concat("G0 Z0.3\n");
	}
	// Center the magnificent artwork

	project.activeLayer.position = view.center;
	console.log(gcode);
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
			gcode = "G0 X0 Y0 Z0 F10000\nG0 Z0.3\n";
			drawPaths();
		};
		image.src = event.target.result;
	};
	reader.readAsDataURL(file);
}

document.addEventListener('drop', onDocumentDrop, false);
document.addEventListener('dragover', onDocumentDrag, false);
document.addEventListener('dragleave', onDocumentDrag, false);