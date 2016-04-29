var webpack = require('webpack');
module.exports = {
	entry: {
		alpha: './task.js'
	},
	output: {
		filename: 'task.min.js',
		libraryTarget: 'umd'
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin()
	]
}
