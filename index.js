const express = require('express');

var app = express();
var port = process.env.PORT || 4000;


app.get('/', (req, res) => {
	res.send('Testing Server...');
	// res.sendFile(`${__dirname}/templates/index.html`);
});


app.listen(port, async () => {
	console.log('Server started on: ' + port);
	console.log('http://127.0.0.1:' + port + '/');
});