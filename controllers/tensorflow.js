const runner = require('../helpers/runner');

function handleTrainModel(req, res) {
	res.sendStatus(200);
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