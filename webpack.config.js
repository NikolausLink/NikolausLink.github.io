const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'docs'),
		filename: 'js/main.js',
	},
	devServer: {
		contentBase: path.join(__dirname, 'docs'),
		compress: true,
		port: 9000,
		watchContentBase: true,
	},
	module: {
		rules: [
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader',
				],
			},
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "css/[name].css",
		}),
	],
};
