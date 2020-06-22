const data = require('./data');
const definedModel = require('./model');

function runModel(fileName) {
	const model = tf.loadLayersModel('file://C:/Users/limbamar/OneDrive - diconium GmbH/Desktop/Microservices/model/model.json').then(model => {
		fs.readFile(path.join(__dirname, '..', fileName), async function(error, data) {
			if(error) throw error;

			var index = 54 // offset because of header;
			const recordBytes = 28 * 28;

			const array = new Float32Array(recordBytes);
			for (let i = 0; i < recordBytes; i++) {
				// Normalize the pixel values into the 0-1 interval, from
				// the original 0-255 interval.
				if(data.readUInt8(index++) != 255) console.log(data.readUInt8(index++));
				array[i] = (data.readUInt8(index++) / 255);
			}
			for(var test = 0; test < 28; test++) {
				var row = "";

				for(var test2 = 0; test2 < 28; test2++) {
					var index = test2 * test;
					if(array[index] != 0) {
						row += '-';
					}
					else {
						row += 'H';
					}
				}
				console.log(row)
			}

			const imagesShape = [1, 28, 28, 1];
			var test = model.predict(tf.tensor4d(array, imagesShape));
			var ar = await test.array();
			console.log(ar);
			throw null;
		});
	});
}