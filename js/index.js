var scale = 3,
    max_stroke = 2.5,
    max_feed_rate = 20000,
    min_feed_rate = 200,
    width_px = 200,
    z_limit = 35,
    gcode = "";

// Load default raster, Picard
var raster = new Raster('picard');
raster.visible = false;
raster.on('load', drawPaths);

function drawPaths() {
    gcode = "T0\nG0 X0 Y0 U0 F10000\nG0 U" + String(z_limit) + " F20000\n";

    raster.size = new Size(width_px, raster.height/ (raster.width/width_px));

    project.activeLayer.removeChildren();

    for (var y = 0; y < raster.height; y++) {
        for (var x = 0; x < raster.width - 1; x++) {
            var color = raster.getPixel(x, y);
            var path = new Path();
            path.strokeColor = 'black';

            path.add(new Point(width_px - scale * x, scale * y));
            path.add(new Point(width_px - scale * x + scale, scale * y))

            // Set the stroke width of the line to match grayness
            path.strokeWidth = max_stroke * (1 - color.gray);

            var feed_rate = max_feed_rate * color.gray;

            feed_rate = (feed_rate > 500) ? feed_rate : 500;

            gcode = gcode.concat("G0 X" + (x + 1) + " Y" + y + " F" + feed_rate + "\n");
        }
        gcode = gcode.concat("G0 U0 F20000\n");
        gcode = gcode.concat("G0 X0 Y" + y + " F10000\n");
        gcode = gcode.concat("G0 U" + String(z_limit) + " F20000\n");
    }
    gcode = gcode.concat("G0 U0 F20000\n");
    project.activeLayer.position = view.center;
}

document.getElementById('update-button').onclick = function() {
    width_px = document.getElementById('x-pixels').value;
    z_limit = document.getElementById('z-limit').value;
    drawPaths();
}

document.getElementById('gcode-button').onclick = function() {
    var url = window.URL.createObjectURL(new Blob([gcode], {type: "application/zip"}));
	var a = document.createElement('a');
	a.style.display = 'none';
	a.href = url;
	a.download = document.getElementById('filename').value + '.gcode';
	document.body.appendChild(a);
	a.click();
	window.URL.revokeObjectURL(url);
}

function onDocumentDrag(event) {
    event.preventDefault();
}

function onDocumentDrop(event) {
    event.preventDefault();

    var file = event.dataTransfer.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
        var image = document.createElement('img');
        image.onload = function() {
            raster = new Raster(image);
            raster.visible = false;
            gcode = "G0 X0 Y0 U0 F10000\nG0 U40 F 20000\n";
            drawPaths();
        };
        image.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

document.addEventListener('drop', onDocumentDrop, false);
document.addEventListener('dragover', onDocumentDrag, false);
document.addEventListener('dragleave', onDocumentDrag, false);