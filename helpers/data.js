/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

const tf = require('@tensorflow/tfjs-node/dist/index');
const assert = require('assert');
const fs = require('fs');
const https = require('https');
const util = require('util');
const zlib = require('zlib');

const { data } = require('../config/tensorflow.js');

const readFile = util.promisify(fs.readFile);

// Downloads a test file only once and returns the buffer for the file.
async function fetchOnceAndSaveToDiskWithBuffer(filename) {
	return new Promise(resolve => {
		const url = `${data.MNISTHost}${filename}.gz`;
		if (fs.existsSync(filename)) {
			resolve(readFile(filename));
			return;
		}
		const file = fs.createWriteStream(filename);
		console.log(`  * Downloading from: ${url}`);
		https.get(url, (response) => {
			const unzip = zlib.createGunzip();
			response.pipe(unzip).pipe(file);
			unzip.on('end', () => {
				resolve(readFile(filename));
			});
		});
	});
}

function loadHeaderValues(buffer, headerLength) {
	const headerValues = [];
	for (let i = 0; i < headerLength / 4; i++) {
		// Header data is stored in-order (aka big-endian)
		headerValues[i] = buffer.readUInt32BE(i * 4);
	}
	return headerValues;
}

async function loadImages(filename) {
	const buffer = await fetchOnceAndSaveToDiskWithBuffer(filename);

	const headerBytes = data.imageHeaderSize;
	const recordBytes = data.imageHeight * data.imageWidth;

	const headerValues = loadHeaderValues(buffer, headerBytes);
	assert.equal(headerValues[2], data.imageHeight);
	assert.equal(headerValues[3], data.imageWidth);

	const images = [];
	let index = headerBytes;
	while (index < buffer.byteLength) {
		const array = new Float32Array(recordBytes);
		for (let i = 0; i < recordBytes; i++) {
			// Normalize the pixel values into the 0-1 interval, from
			// the original 0-255 interval.
			array[i] = buffer.readUInt8(index++) / 255;
		}
		images.push(array);
	}

	assert.equal(images.length, headerValues[1]);
	return images;
}

async function loadLabels(filename) {
	const buffer = await fetchOnceAndSaveToDiskWithBuffer(filename);

	const headerBytes = data.labelHeaderSize;
	const recordBytes = data.labelSize;

	const headerValues = loadHeaderValues(buffer, headerBytes);

	const labels = [];
	let index = headerBytes;
	while (index < buffer.byteLength) {
		const array = new Int32Array(recordBytes);
		for (let i = 0; i < recordBytes; i++) {
			array[i] = buffer.readUInt8(index++);
		}
		labels.push(array);
	}

	assert.equal(labels.length, headerValues[1]);
	return labels;
}

/** Helper class to handle loading training and test data. */
class MnistDataset {
	constructor() {
		this.dataset = null;
		this.trainSize = 0;
		this.testSize = 0;
		this.trainBatchIndex = 0;
		this.testBatchIndex = 0;
	}

	/** Loads training and test data. */
	async loadData() {
		this.dataset = await Promise.all([
			loadImages(data.trainImages), loadLabels(data.trainLabels),
			loadImages(data.testImages), loadLabels(data.testLabels)
		]);
		this.trainSize = this.dataset[0].length;
		this.testSize = this.dataset[2].length;
	}

	getTrainData() {
		return this.getData_(true);
	}

	getTestData() {
		return this.getData_(false);
	}

	getData_(isTrainingData) {
		let imagesIndex;
		let labelsIndex;
		if (isTrainingData) {
			imagesIndex = 0;
			labelsIndex = 1;
		} else {
			imagesIndex = 2;
			labelsIndex = 3;
		}
		const size = this.dataset[imagesIndex].length;
		tf.util.assert(
			this.dataset[labelsIndex].length === size,
			`Mismatch in the number of images (${size}) and ` +
			`the number of labels (${this.dataset[labelsIndex].length})`);

		// Only create one big array to hold batch of images.
		const imagesShape = [size, data.imageHeight, data.imageWidth, 1];
		const images = new Float32Array(tf.util.sizeFromShape(imagesShape));
		const labels = new Int32Array(tf.util.sizeFromShape([size, 1]));

		let imageOffset = 0;
		let labelOffset = 0;
		for (let i = 0; i < size; ++i) {
			images.set(this.dataset[imagesIndex][i], imageOffset);
			labels.set(this.dataset[labelsIndex][i], labelOffset);
			imageOffset += data.imagePixelCount;
			labelOffset += 1;
		}

		return {
			images: tf.tensor4d(images, imagesShape),
			labels: tf.oneHot(tf.tensor1d(labels, 'int32'), data.labelCount).toFloat()
		};
	}
}

module.exports = new MnistDataset();
