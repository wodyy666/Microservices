const express = require('express');

const tensorflow = require('./tensorflow');

const router = express.Router();

// tensorflow routes
router.get('/train', tensorflow.handleTrainModel);
router.post('/predict', tensorflow.handlePredict);

module.exports = router;
