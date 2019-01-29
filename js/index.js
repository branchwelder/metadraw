window.onload = function() {
	//Draw the first line

	// var canvas = document.getElementById('myCanvas');
	// paper.setup(canvas);

	// var path = new paper.Path();
	// path.strokeColor = 'black';

	// var start = new paper.Point(100, 100);
	// path.moveTo(start);
	// path.lineTo(start.add([ 200, -50 ]));

	// paper.view.draw();


// Adapted from the following Processing example:
// http://processing.org/learning/topics/follow3.html

var canvas = document.getElementById('myCanvas');
paper.setup(canvas);

// The amount of points in the path:
var points = 25;

// The distance between the points:
var length = 35;

var path = new paper.Path({
	strokeColor: '#E4141B',
	strokeWidth: 20,
	strokeCap: 'round'
});

var start = paper.view.center / [10, 1];
for (var i = 0; i < points; i++)
	path.add(start + new paper.Point(i * length, 0));

function onMouseMove(event) {
	path.firstSegment.point = event.point;
	for (var i = 0; i < points - 1; i++) {
		var segment = path.segments[i];
		var nextSegment = segment.next;
		var vector = segment.point - nextSegment.point;
		vector.length = length;
		nextSegment.point = segment.point - vector;
	}
	path.smooth({ type: 'continuous' });
}

function onMouseDown(event) {
	path.fullySelected = true;
	path.strokeColor = '#e08285';
}

function onMouseUp(event) {
	path.fullySelected = false;
	path.strokeColor = '#e4141b';
}



}

// getGcode = function() {
// 	console.log("yoloswag");
// }
