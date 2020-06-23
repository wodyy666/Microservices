const tf = require('@tensorflow/tfjs-node/dist/index');
const fs = require('fs');
const path = require('path');

const { data } = require('../config/tensorflow.js');

async function loadImages(filename) {
	return new Promise(resolve => {
		var filePath = path.join(__dirname, data.datasetLocation, filename);

		fs.readFile(filePath, (error, buffer) => {
			if (error) throw error;

			const pixelCount = data.imagePixelCount;
			const images = [];
			let index = data.imageHeaderSize;

			while (index < buffer.byteLength) {
				const array = new Float32Array(pixelCount);
				for (let i = 0; i < pixelCount; i++) {
					// Normalize the pixel values into the 0-1 interval, from
					// the original 0-255 interval.
					array[i] = buffer.readUInt8(index++) / 255;
				}
				images.push(array);
			}

			resolve(images);
		});
	});
}

async function loadLabels(filename) {
	return new Promise(resolve => {
		var filePath = path.join(__dirname, data.datasetLocation, filename);

		fs.readFile(filePath, (error, buffer) => {
			if (error) throw error;

			const recordBytes = data.labelSize;
			const labels = [];
			let index = data.labelHeaderSize;

			while (index < buffer.byteLength) {
				const array = new Int32Array(recordBytes);
				for (let i = 0; i < recordBytes; i++) {
					array[i] = buffer.readUInt8(index++);
				}
				labels.push(array);
			}

			resolve(labels);
		});
	});
}

async function loadData() {
	return await Promise.all([
		loadImages(data.trainImages), loadLabels(data.trainLabels),
		loadImages(data.testImages), loadLabels(data.testLabels)
	]);
}

function getTrainData(dataset) {
	return getData_(true, dataset);
}

function getTestData(dataset) {
	return getData_(false, dataset);
}

function getData_(isTrainingData, dataset) {
	let imagesIndex;
	let labelsIndex;
	if (isTrainingData) {
		imagesIndex = 0;
		labelsIndex = 1;
	} else {
		imagesIndex = 2;
		labelsIndex = 3;
	}
	const size = dataset[imagesIndex].length;
	tf.util.assert(
		dataset[labelsIndex].length === size,
		`Mismatch in the number of images (${size}) and ` +
		`the number of labels (${dataset[labelsIndex].length})`);

	// Only create one big array to hold batch of images.
	const imagesShape = [size, data.imageHeight, data.imageWidth, 1];
	const images = new Float32Array(tf.util.sizeFromShape(imagesShape));
	const labels = new Int32Array(tf.util.sizeFromShape([size, 1]));

	let imageOffset = 0;
	let labelOffset = 0;
	for (let i = 0; i < size; ++i) {
		images.set(dataset[imagesIndex][i], imageOffset);
		labels.set(dataset[labelsIndex][i], labelOffset);
		imageOffset += data.imagePixelCount;
		labelOffset += 1;
	}

	return {
		images: tf.tensor4d(images, imagesShape),
		labels: tf.oneHot(tf.tensor1d(labels, 'int32'), data.labelCount).toFloat()
	};
}

module.exports = {
	loadData,
	getTrainData,
	getTestData,
};
