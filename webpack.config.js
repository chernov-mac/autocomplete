const path = require('path');
const PATHS = {
	src: path.join(__dirname, 'src/js'),
	dist: path.join(__dirname, 'dist/js')
};
module.exports = {
	entry: PATHS.src + '/main.js',
	output: {
		path: PATHS.dist,
		filename: 'bundle.js'
	},
	devtool: '#source-map'
};
