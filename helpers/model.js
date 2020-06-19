const tf = require('@tensorflow/tfjs-node/dist/index');
const { tensorflow } = require('../config/config.js');

const model = tf.sequential();

// adds each layer specified in the config to the model
tensorflow.model.layers.forEach(layer => {
	switch (layer.type) {
		case "conv2d":
			model.add(tf.layers.conv2d(layer));
			break;
		case "maxPooling2d":
			model.add(tf.layers.maxPooling2d(layer));
			break;
		case "flatten":
			model.add(tf.layers.flatten());
			model.add(tf.layers.dropout(layer.dropout));
			break;
		case "dense":
			model.add(tf.layers.dense(layer));
			model.add(tf.layers.dropout(layer.dropout));
			break;
		case "result":
			model.add(tf.layers.dense(layer));
			break;
	}
});

// compile the model with all specified layers added
model.compile(tensorflow.model.compileOptions);

module.exports = model;
