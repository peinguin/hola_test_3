
const Perceptron = require('perceptron'),
	helpers = require('./helpers');

module.exports = exports = { init, test };

var weights;

function init(data) {
	weights = JSON.stringify(data.toString('utf8'));
	weights = Object.keys(weights).map(function(wordLen) {
		return new Perceptron({ weights: weights[wordLen] });
	});
}

function test(word) {
	const wordLen = word.length,
		perceptron = weights[word.length];
	if (!perceptron) {
		return false;
	}
	return !!perceptron.perceive(helpers.stringToArray(word));
}


