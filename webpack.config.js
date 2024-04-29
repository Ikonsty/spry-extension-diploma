const path = require('path');
const ChromeExtensionManifest = require('chrome-extension-manifest-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { DefinePlugin } = require('webpack');
const sourceRootPath = path.join(__dirname, 'src');
const distRootPath = path.join(__dirname, 'dist');
require('dotenv').config();

module.exports = {
	entry: {
		popup: path.join(sourceRootPath, 'popup', 'App.jsx'),
		content: path.join(sourceRootPath, 'content', 'index.jsx'),
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader', 'postcss-loader'],
			},
			{
				test: /\.(svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'images/',
						},
					},
				],
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'images/',
						},
					},
				],
			},
		],
	},
	resolve: {
		extensions: ['*', '.js', '.jsx', '.svg'],
	},
	plugins: [
		new ChromeExtensionManifest({
			inputFile: path.join(sourceRootPath, 'manifest.json'),
			outputFile: path.join(distRootPath, 'manifest.json'),
		}),
		new CopyWebpackPlugin({
			patterns: [{ from: 'src/popup/popup.html', to: './' }],
		}),
		new DefinePlugin({
			'process.env': JSON.stringify(process.env),
		}),
	],
};
