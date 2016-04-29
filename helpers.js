
function stringToArray(word) {
	return word.split('').map(function(c) {
		return c.charCodeAt(0);
	});
}

module.exports = exports = { stringToArray: stringToArray };
