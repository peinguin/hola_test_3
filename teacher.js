
const Perceptron = require('perceptron'),
	fs = require('fs'),
	helpers = require('./helpers'),
	filename = './words.txt',
	weights = {};

fs.readFile(filename, 'utf8', function(err, data) {
	if (err) throw err;
	
	const array = data.split('\n');
	array.pop();

	processFile(array);
});

function processFile(words) {
	words.forEach(function(word) {
		const wordLen = word.length;
		if (!weights[wordLen]) {
			weights[wordLen] = new Perceptron({debug: false});
		}
		weights[wordLen].train(helpers.stringToArray(word.toLowerCase()), 1);
	});

	Object.keys(weights).forEach(function(wordLen) {
		while(!weights[wordLen].retrain()) {}
	});

	fs.writeFile("./weights", JSON.stringify(weights), function(err) {
			if (err) throw err;

			console.log("The file was saved!");
	}); 
}
