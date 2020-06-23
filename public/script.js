var canvas, ctx, flag = false,
	prevX = 0,
	currX = 0,
	prevY = 0,
	currY = 0,
	dot_flag = false;

var color = 'black',
	lineWidth = 2;

function init() {
	canvas = document.getElementById('can');
	ctx = canvas.getContext('2d');
	w = canvas.width;
	h = canvas.height;

	canvas.addEventListener('mousemove', function(e) {
		findxy('move', e);
	}, false);
	canvas.addEventListener('mousedown', function(e) {
		findxy('down', e);
	}, false);
	canvas.addEventListener('mouseup', function(e) {
		findxy('up', e);
	}, false);
	canvas.addEventListener('mouseout', function(e) {
		findxy('out', e);
	}, false);
}

function draw() {
	ctx.beginPath();
	ctx.moveTo(prevX, prevY);
	ctx.lineTo(currX, currY);
	ctx.strokeStyle = color;
	ctx.lineWidth = lineWidth;
	ctx.stroke();
	ctx.closePath();
}

function erase() {
	ctx.clearRect(0, 0, w, h);
	document.getElementById('canvasimg').style.display = 'none';
}

function prepareImageArray() {
	return new Promise(resolve => {
		var array = new Float32Array(28 * 28);
		for (var y = 0; y < 28; y++) {

			for (var x = 0; x < 28; x++) {
				if (ctx.getImageData(x, y, 1, 1).
					data.
					toString().
					split(',')[3] != 255) {
					array[(y * 28) + x] = 0;
				} else {
					array[(y * 28) + x] = 1;
				}
			}
		}
		resolve(array);
	});
}

async function predict() {
	document.getElementById('canvasimg').style.border = '2px solid';
	let array = await prepareImageArray();
	sendImage(array);
	console.log(array);
}

function sendImage(array) {
	let xhr = new XMLHttpRequest();

	let json = `{"image": [${array.toString()}]}`;
	let body = json;
	console.log(body);

	xhr.addEventListener("readystatechange", function() {
		if(this.readyState === 4) {
			console.log(this.responseText);
		}
	});

	xhr.open("POST", "/predict");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(body);
}

function findxy(res, e) {
	if (res == 'down') {
		prevX = currX;
		prevY = currY;
		currX = e.clientX - canvas.offsetLeft;
		currY = e.clientY - canvas.offsetTop;

		flag = true;
		dot_flag = true;
		if (dot_flag) {
			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.fillRect(currX, currY, 2, 2);
			ctx.closePath();
			dot_flag = false;
		}
	}
	if (res == 'up' || res == 'out') {
		flag = false;
	}
	if (res == 'move') {
		if (flag) {
			prevX = currX;
			prevY = currY;
			currX = e.clientX - canvas.offsetLeft;
			currY = e.clientY - canvas.offsetTop;
			draw();
		}
	}
}