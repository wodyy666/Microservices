const tf = require('@tensorflow/tfjs-node/dist/index');
const path = require('path');
const data = require('./data');
const definedModel = require('./model');
const tensorflowConfig = require('../config/tensorflow');

let isTraining = false; // prevents two models training at the same time

// runs an image through the model
async function runModel(array, callback) {
	tf.loadLayersModel(
		`file://${path.join(__dirname, '..', tensorflowConfig.modelPath)}`).
		then(async model => {

			// create typed array containing image data
			var typedArray = await new Promise(resolve => {
				var tempArray = new Float32Array(784);
				tempArray.set(array.slice());

				resolve(tempArray);
			});

			// feed array into model
			const imagesShape = [1, 28, 28, 1];
			let resultTensor = model.predict(
				tf.tensor4d(typedArray, imagesShape));
			let resultArray = await resultTensor.array();

			// return result using callback
			callback(resultArray[0]);
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

	// saving the model
	if (tensorflowConfig.modelPath != null) {
		let filePath = path.join(__dirname, '..', tensorflowConfig.modelPath);
		await definedModel.save(`file://${filePath}`);
		console.log(`Saved model to path: ${filePath}`);
	}

	isTraining = false;
}

function training() {
	return isTraining;
}

module.exports = {
	runModel,
	trainModel,
	training,
};