const tf = require('@tensorflow/tfjs-node/dist/index');
const path = require('path');
const data = require('./data');
const definedModel = require('./model');
const tensorflowConfig = require('../config/tensorflow');

let isTraining = false;

async function runModel(array) {
	tf.loadLayersModel(
		'file://C:/Users/limbamar/OneDrive - diconium GmbH/Desktop/Microservices/model/model.json').
		then(async model => {

			// might be needed later for data preperation
			/*for (let i = 0; i < recordBytes; i++) {
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
			}*/
			var typedArray = await new Promise(resolve => {
				var tempArray = new Float32Array(784);
				tempArray.set(array.slice());

				resolve(tempArray);
			});

			const imagesShape = [1, 28, 28, 1];
			let resultTensor = model.predict(
				tf.tensor4d(typedArray, imagesShape));
			let resultArray = await resultTensor.array();

			for (let i = 0; i < 10; i++) {
				console.log(`${i} -> ${(resultArray[0][i] * 100).toFixed(2)}%`);
			}
		});
}

async function trainModel() {

	isTraining = true;	// flag to make sure only one model is trained

	const dataset = await data.loadData();
	const epochs = tensorflowConfig.epochs;
	const batchSize = tensorflowConfig.batchSize;

	const {images: trainImages, labels: trainLabels} = data.getTrainData(
		dataset);
	definedModel.summary();

	// Percentage of images to be used for validation, the rest is used for training
	const validationSplit = 0.15;

	// actually training the model
	await definedModel.fit(trainImages, trainLabels, {
		epochs,
		batchSize,
		validationSplit,
	});

	// validating the model
	const {images: testImages, labels: testLabels} = data.getTestData(dataset);
	const evalOutput = definedModel.evaluate(testImages, testLabels);

	// logging progress
	console.log(
		`  Loss = ${evalOutput[0].dataSync()[0].toFixed(3)}; ` +
		`Accuracy = ${evalOutput[1].dataSync()[0].toFixed(3)}`);

	if (tensorflowConfig.modelPath != null) {
		let filePath = path.join(__dirname, tensorflowConfig.modelPath);
		await definedModel.save(`file://${filePath}`);
		console.log(`Saved model to path: ${filePath}`);
	}

	isTraining = false;
}

module.exports = {
	runModel,
	trainModel,
};