const Perceptron = require('perceptron'),
	fs = require('fs'),
	helpers = require('./helpers'),
	backendHelpers = require('./backendHelpers'),
	task = require('./task.min'),
	request = require('request'),
	filename = './weights',
	url = 'https://hola.org/challenges/word_classifier/testcase/0',
	doTeach = true;

fs.readFile(filename, 'utf8', function(err, data) {
	if (err) throw err;

	const buf = new Buffer(data);
	task.init(buf);

	getTestData(JSON.parse(data));
});

function getTestData(weights) {
	request(url, function (error, response, body) {
		if (error || response.statusCode !== 200) throw 'get test data error';

		const data = JSON.parse(body);
		test(data);
		if (doTeach) {
			teach(data, weights);
			test(data);
		}
	});
}

function test(testData) {
	var successTries = 0;
	const words = Object.keys(testData);
	words.forEach(function(word) {
		successTries += (task.test(word) === testData[word]);
	});

	console.log('percent', successTries / words.length);
}

function teach(data, weights) {
	backendHelpers.getWords(teachAll.bind(null, data, weights));
}

function teachAll(data, weights, words) {
	weights = Object.keys(weights).map(function(wordLen) {
		return new Perceptron({ weights: weights[wordLen] });
	});

	backendHelpers.processExistWords(words, weights);

	Object.keys(data).forEach(function(word) {
		const perceptron = weights[word.length];
		if (!perceptron) {
			return;
		}
		const wordCodes = helpers.stringToArray(word);
		perceptron.train(wordCodes, +data[word]);
	});

	backendHelpers.retrain(weights);

	backendHelpers.writeWeights(weights);
}
