var canvas, ctx, flag = false,
	prevX = 0,
	currX = 0,
	prevY = 0,
	currY = 0,
	dot_flag = false,
	color = 'black',
	lineWidth = 5,
	autoUpdate = false;

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
		if (autoUpdate) {
			predict();
		}
	}, false);
	canvas.addEventListener('mouseout', function(e) {
		findxy('out', e);
	}, false);

	autoUpdate = document.getElementById('checkbox').checked;
}

function setAutoUpdate(checkbox) {
	autoUpdate = checkbox.checked;
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
}

async function prepareImageArray() {
	return await new Promise(async resolve => {
		var array = new Float32Array(28 * 28);
		for (var y = 0; y < 140; y += 5) {
			for (var x = 0; x < 140; x += 5) {
				var tempArray = ctx.getImageData(x, y, 5, 5).
					data.
					toString().
					split(',');
				var sum = await new Promise(resolve => {
					var sum = 0;
					for (var i = 0; i < 25; i++) {
						sum += parseInt(tempArray[3 + (i * 4)]);
					}
					resolve(sum);
				});

				array[((y / 5) * 28) + (x / 5)] = sum / 25;
			}
		}

		resolve(array);
	});
}

async function predict() {
	let array = await prepareImageArray();
	sendImage(array);

	document.getElementById('resultDiv').style.display = 'block';
}

function sendImage(array) {
	let xhr = new XMLHttpRequest();

	let json = `{"image": [${array.toString()}]}`;
	let body = json;
	console.log(body);

	xhr.addEventListener('readystatechange', function() {
		if (this.readyState === 4) {
			var array = JSON.parse(this.responseText);
			setLabels(array);
		}
	});

	xhr.open('POST', '/predict');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(body);
}

function setLabels(array) {
	array.forEach((item, index) => {
		var percent = (item * 100).toFixed(2);
		document.getElementById('result' + index).value = percent;
		document.getElementById('result' + index + 'lbl').innerHTML = percent +
			'%';
	});
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