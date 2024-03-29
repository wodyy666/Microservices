const runner = require('../helpers/runner');

function handleTrainModel(req, res) {
	if (runner.training()) {	// is already training
		res.sendStatus(503);
	} else {
		runner.trainModel();
		res.sendStatus(200);
	}
}

function handlePredict(req, res) {
	let image = req.body.image;

	// run prediction and send result as answer
	runner.runModel(image, result => {
		res.send(result);
	});
}

module.exports = {
	handleTrainModel,
	handlePredict,
};