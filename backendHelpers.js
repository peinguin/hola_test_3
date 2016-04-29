const Perceptron = require('perceptron'),
	fs = require('fs'),
	helpers = require('./helpers'),
	filename = './words.txt';

function writeWeights(weights) {
	fs.writeFile('./weights', serializeWeights(weights), function(err) {
		if (err) throw err;

		console.log('The file was saved!');
	}); 
}

function serializeWeights(weights) {
	return JSON.stringify(Object.keys(weights).reduce(function(serialized, wordLen) {
		const tmpWeights = weights[wordLen].weights.slice();
		if (wordLen < tmpWeights.length) {
			tmpWeights.pop();
		}
		serialized[wordLen] = tmpWeights;
		return serialized;
	}, {}));
}

function processExistWords(words, perceptrons) {
	const wordsCount = words.length,
		DEBUG = false;

	if (DEBUG) {
		const start = Date.now(),
			precision = 0.1;
		var last = 0,
			i = 0;
	}

	words.forEach(function(word) {
		const wordLen = word.length;
		if (!perceptrons[wordLen]) {
			perceptrons[wordLen] = new Perceptron({debug: false});
		}
		perceptrons[wordLen].train(helpers.stringToArray(word), 1);

		if (DEBUG) {
			var percent = ++i / wordsCount;
			if (percent - last > precision) {
				last = percent;
				console.log(Math.round(percent / precision) * precision * 100 + '%');
			}
		}
	});
	if (DEBUG) {
		console.log('processExistWords finished', Date.now() - start);
	}
}

function retrain(perceptrons) {
	Object.keys(perceptrons).forEach(function(wordLen) {
		while(!perceptrons[wordLen].retrain()) {}
	});
}

function getWords(cb) {
	fs.readFile(filename, 'utf8', function(err, data) {
	if (err) throw err;
	
	const array = data
		.split('\n')
		.map(function(word) {
			return word.toLowerCase();
		});

	array.pop();
	cb(array);
});
}

module.exports = exports = { writeWeights, processExistWords, retrain, getWords };
