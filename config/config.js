var config = {};

config.tensorflow = {
	modelPath: './model',
	epochs: '20',
	batchSize: '128',
	imageHeight: 28,
	imageWidth: 28,
	imageHeaderSize: 16,
	MNISTHost: 'https://storage.googleapis.com/cvdf-datasets/mnist/'

}

config.tensorflow.model = {
	layers: [
		{
			type: 'conv2d',
			inputShape: [28, 28, 1],
			filters: 32,
			kernelSize: 3,
			activation: 'relu'
		},
		{
			type: 'conv2d',
			filters: 32,
			kernelSize: 3,
			activation: 'relu'
		},
		{
			type: 'maxPooling2d',
			poolSize: [2, 2]
		},
		{
			type: 'conv2d',
			filters: 64,
			kernelSize: 3,
			activation: 'relu'
		},
		{
			type: 'conv2d',
			filters: 64,
			kernelSize: 3,
			activation: 'relu'
		},
		{
			type: 'maxPooling2d',
			poolSize: [2, 2]
		},
		{
			type: 'flatten',
			dropout: 0.25
		},
		{
			type: 'dense',
			units: 512,
			activation: 'relu',
			dropout: 0.5
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
}

module.exports = config;