const express = require('express');
const path = require('path');
const tensorflow = require('./tensorflow');

const router = express.Router();

// tensorflow routes
router.get('/train', tensorflow.handleTrainModel);
router.post('/predict', tensorflow.handlePredict);

// serving the website
router.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

module.exports = router;
