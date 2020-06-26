const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config/config');
const routes = require('./controllers');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(routes);


app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(config.port);
console.log(`App is listening on port ${config.port}`);