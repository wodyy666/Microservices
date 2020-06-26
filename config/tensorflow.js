var config = {};

config = {
	modelPath: './model',
	epochs: 5,
	batchSize: 128
};

config.data = {
	MNISTHost: 'https://storage.googleapis.com/cvdf-datasets/mnist/',
	datasetLocation: '../MNISTDataset',
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

config.model = {
	layers: [
		{
			type: 'conv2d',
			inputShape: [28, 28, 1],
			filters: 16,
			kernelSize: 3,
			activation: 'relu'
		},
		{
			type: 'conv2d',
			filters: 16,
			kernelSize: 3,
			activation: 'relu'
		},
		{
			type: 'maxPooling2d',
			poolSize: [2, 2]
		},
		{
			type: 'conv2d',
			filters: 8,
			kernelSize: 3,
			activation: 'relu'
		},
		{
			type: 'conv2d',
			filters: 8,
			kernelSize: 3,
			activation: 'relu'
		},
		{
			type: 'maxPooling2d',
			poolSize: [2, 2]
		},
		{
			type: 'flatten',
			dropout: 0.5
		},
		{
			type: 'dense',
			units: 64,
			activation: 'relu',
			dropout: 0.66
		},
		{
			type: 'result',
			units: 10,
			activation: 'softmax'
		}
	],
	compileOptions: {
		optimizer: 'rmsprop',
		loss: 'categoricalCrossentropy',
		metrics: ['accuracy']
	}
};

module.exports = config;