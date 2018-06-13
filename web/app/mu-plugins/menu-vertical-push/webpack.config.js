const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
module.exports = {
	entry: path.join(__dirname, './index.js'),
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: "source-map",
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: "babel-loader"
			}
		}],
	},
	module: {
		rules: [{
			test: /\.scss$/,
			use: [
				// fallback to style-loader in development
				/*process.env.NODE_ENV !== 'production' ? 'style-loader' : */MiniCssExtractPlugin.loader,
				"css-loader", // translates CSS into CommonJS
				"postcss-loader",
				"sass-loader" // compiles Sass to CSS
			]
		}]
	},
	plugins: [
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			// filename: "[name].css",
			// chunkFilename: "[id].css"
		})
	]
};