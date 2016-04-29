
const Perceptron = require('perceptron'),
	fs = require('fs'),
	helpers = require('./helpers'),
	backendHelpers = require('./backendHelpers'),
	weights = {},
	ENGLISH = 'abcdefghijklmnopqrstuvwxyz\'',
	doRetrain = true,
	doProcessAllWords = false;

backendHelpers.getWords(processFile);

function processFile(words) {

	backendHelpers.processExistWords(words);

	if (doProcessAllWords) {
		processAllWords();
	}

	if (doRetrain) {
		backendHelpers.retrain(weights);
	}

	backendHelpers.writeWeights(weights);
}

function processAllWords() {
	const maxWordLen = max(words.map(function(word) {
			return word.length;
		})),
		permutation = new Array(maxWordLen),
		start = Date.now(),
		COUNT_OF_PERMUTATIONS = Math.pow(ENGLISH.length + 1, maxWordLen);

	var last = 0,
		tick_count = 1,
		i = tick_count;
	while (tick(permutation, tick_count)) {
		let word = generateWord(permutation);console.log(word)
		const wordLen = word.length;
		if (!weights[wordLen]) {
			weights[wordLen] = new Perceptron({debug: false});
		}
		weights[wordLen].train(helpers.stringToArray(word), words.includes(word));

		i += tick_count;
		let percent = i / COUNT_OF_PERMUTATIONS;
		console.log(percent / percision + '%', i, 'of', COUNT_OF_PERMUTATIONS);
	}
	console.log('processAllWords finished', Date.now() - start);
}

function max(arr) {
	var max = 0;
	arr.forEach(function(val) {
		if (val > max) {
			max = val;
		}
	});
	return max;
}

function tick(arr, count) {
	if (!count) {
		count = 1;
	}
	var first = arr.pop();

	if (typeof first !== 'number') {
		first = -1;
	}
	first += count;

	const distance = first - ENGLISH.length;
	if (distance >= 0) {
		first = 0;
		if (
			arr.length === 0 ||
			!tick(arr, Math.floor(ENGLISH.length / (count - distance)))
		) {
			return false;
		}
	}

	arr.push(first);
	return true;
}

function generateWord(permutation) {
	return permutation
		.map(function(i) {
			if (typeof i === 'undefined') {
				return '';
			}
			return ENGLISH[i];
		})
		.join('');
}
