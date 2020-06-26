const runner = require('../helpers/runner');

function handleTrainModel(req, res) {
	if(runner.isTraining) {	// is already training
		res.sendStatus(503);
	}
	else {
		runner.trainModel();
		res.sendStatus(200);
	}
}

function handlePredict(req, res) {
	let image = req.body.image;
	runner.runModel(image, result => {
		res.send(result);
	});
}

module.exports = {
	handleTrainModel,
	handlePredict
}