const runner = require('../helpers/runner');

function handleTrainModel(req, res) {
	res.sendStatus(200);
}

function handlePredict(req, res) {
	let image = req.body.image;
	console.log(image);
	runner.runModel(image);
	res.sendStatus(200);
}

module.exports = {
	handleTrainModel,
	handlePredict
}