const fs = require('fs'),
	task = require('./task'),
	request = require('request'),
	filename = './weights',
	url = 'https://hola.org/challenges/word_classifier/testcase/0';

fs.readFile(filename, 'utf8', function(err, data) {
	if (err) throw err;

	const buf = new Buffer(data);
	task.init(buf);

	getTestData();
});

function getTestData() {
	request(url, function (error, response, body) {
		if (error || response.statusCode !== 200) throw 'get test data error';

		test(JSON.parse(body));
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
