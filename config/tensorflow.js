var config = {};

config.data = {
	MNISTHost: 'https://storage.googleapis.com/cvdf-datasets/mnist/',
	trainImages: 'train-images-idx3-ubyte',
	trainLabels: 'train-labels-idx1-ubyte',
	testImages: 't10k-images-idx3-ubyte',
	testLabels: 't10k-labels-idx1-ubyte',
	imageHeight: 28,
	imageWidth: 28,
	imagePixelCount: 28 * 28,
	imageHeaderSize: 16,
	labelHeaderSize: 8,
	labelSize: 1,
	labelCount: 10
};

module.exports = config;