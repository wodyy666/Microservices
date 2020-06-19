const tf = require('@tensorflow/tfjs-node');
const argparse = require('argparse');
const fs = require('fs');
const path = require('path');

const data = require('./data');
//const model = require('./model');
const model = tf.loadLayersModel('file://C:/Users/limbamar/OneDrive - diconium GmbH/Desktop/Microservices/model/model.json').then(model => {
	fs.readFile(path.join(__dirname, 'index.js'), async function(error, data) {
		if(error) throw error;

		var index = 16 // offset because of header;
		const recordBytes = 28 * 28;

		const array = new Float32Array(recordBytes);
		for (let i = 0; i < recordBytes; i++) {
			// Normalize the pixel values into the 0-1 interval, from
			// the original 0-255 interval.
			array[i] = data.readUInt8(index++) / 255;
		}

		const imagesShape = [1, 28, 28, 1];
		var test = model.predict(tf.tensor4d(array, imagesShape));
		var ar = await test.array();
		console.log(ar);
		throw null;
	});
});



async function run(epochs, batchSize, modelSavePath) {
	await data.loadData();

	const {images: trainImages, labels: trainLabels} = data.getTrainData();
	model.summary();

	let epochBeginTime;
	let millisPerStep;
	const validationSplit = 0.15;
	const numTrainExamplesPerEpoch =
		trainImages.shape[0] * (1 - validationSplit);
	const numTrainBatchesPerEpoch =
		Math.ceil(numTrainExamplesPerEpoch / batchSize);
	await model.fit(trainImages, trainLabels, {
		epochs,
		batchSize,
		validationSplit
	});

	const {images: testImages, labels: testLabels} = data.getTestData();
	const evalOutput = model.evaluate(testImages, testLabels);


	console.log(
		`\nEvaluation result:\n` +
		`  Loss = ${evalOutput[0].dataSync()[0].toFixed(3)}; `+
		`Accuracy = ${evalOutput[1].dataSync()[0].toFixed(3)}`);

	if (modelSavePath != null) {
		await model.save(`file://${modelSavePath}`);
		console.log(`Saved model to path: ${modelSavePath}`);
	}
}

const parser = new argparse.ArgumentParser({
	description: 'TensorFlow.js-Node MNIST Example.',
	addHelp: true
});
parser.addArgument('--epochs', {
	type: 'int',
	defaultValue: 20,
	help: 'Number of epochs to train the model for.'
});
parser.addArgument('--batch_size', {
	type: 'int',
	defaultValue: 128,
	help: 'Batch size to be used during model training.'
})
parser.addArgument('--model_save_path', {
	type: 'string',
	help: 'Path to which the model will be saved after training.'
});
const args = parser.parseArgs();

run(args.epochs, args.batch_size, args.model_save_path);