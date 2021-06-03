const tf = require("@tensorflow/tfjs");
const tfn = require("@tensorflow/tfjs-node");
const express = require("express");
const bodyParser = require('body-parser');
const path = require("path");
const fs = require("fs");

const client_path = path.join(__dirname, "client");
const app = express();

// Load model
let model;
let handler = tfn.io.fileSystem("./v1-js/model.json");
tf.loadLayersModel(handler).then(x => {
	model = x;
});

// Set regex definitions
const special = /[\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|]/g

// Load tokens
let tokens;
fs.readFile('v1_tokens.json',(err, data) => {
	if (!err){
		tokens = JSON.parse(data);
	}
});

// Set emoji definitions
const emoji = {
	1: '😕',
	2: '😀',
	3: '😥',
	4: '😠',
	5: '😧',
	6: '😘',
	7: '😮',
}

// Middleware
app.use(bodyParser.json())
app.use(express.static(client_path));

// Api
app.post('/api/emoji', (req, res) => {
	let data = req.body.input;
	data = data.toLowerCase();
	data = data.replace(special, '');
	data = data.split(' ');
	data = data.map(x => tokens[x] || 1)
	
	if (data.length > 32) {
		data = data.slice(0, 31);
	}
	else if (data.length < 32) {
		data = data.concat(Array(32 - data.length).fill(0))
	}

	let tensor = tf.tensor2d([data])
	console.log(tensor);

	let max = 1;
	let prediction = model.predict(tensor);

	prediction.data().then(x => {
		max = x.indexOf(Math.max(...x));
		res.send(emoji[max]);
	}).catch(() => {
		res.send(emoji[1]);
	});
})

// Host
app.listen(process.env.port || 3000);