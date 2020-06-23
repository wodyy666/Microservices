const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config');

const app = express();
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.sendStatus(200);
});

app.listen(config.port);
console.log(`App is listening on port ${config.port}`);