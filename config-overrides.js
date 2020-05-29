const TerserPlugin = require('terser-webpack-plugin');
const { override } = require('customize-cra');
const webpack = require('webpack');
const cliProgress = require('cli-progress');
var BrotliPlugin = require('brotli-webpack-plugin');

const handler = (bar) => (percetage, message, ...args) => {
	bar.update(((percetage * 10000) % 10000) / 100);
	if (percetage >= 0.99) {
		bar.stop();
	}
};

const addProgressBar = (config) => {
	const bar = new cliProgress.SingleBar({}, cliProgress.Presets.legacy);
	bar.start(100, 0);
	config.plugins.push(new webpack.ProgressPlugin(handler(bar)));
	return config;
};

const addTerserPlugin = (config) => {
	if (process.argv.indexOf('--prod') >= 0) {
		config.optimization.minimize = true;
		config.optimization.minimizer = [
			new TerserPlugin({
				sourceMap: true,
				terserOptions: {
					compress: {
						drop_console: true,
						evaluate: true,
						module: true,
					},
				},
			}),
		];
	}
	return config;
};

const addSplitChunks = (config) => {
	if (process.argv.indexOf('--prod') >= 0) {
		config.optimization.splitChunks = {
			cacheGroups: {
				vendors: {
					chunks: 'all',
					maxAsyncRequests: 6,
					maxInitialRequests: Infinity,
					test: /(?!.*ionic)[\\/]node_modules[\\/]/,
					name(module) {
						const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
						// console.log(`npm.${packageName.replace('@', '')}`);
						return `npm.${packageName.replace('@', '')}`;
					},
					minSize: 10000,
					priority: -10,
				},
				default: {
					priority: -20,
				},
			},
		};
	}
	return config;
};

const setProd = (config) => {
	if (process.argv.indexOf('--prod') >= 0) {
		config.mode = 'production';
	}
	return config;
};

const addBrotli = (config) => {
	if (process.argv.indexOf('--prod') >= 0) {
		config.plugins.push(
			new BrotliPlugin({
				asset: '[path].br[query]',
				test: /\.(js|css|html|svg)$/,
				threshold: 10240,
				minRatio: 0.8,
			}),
		);
	}
	return config;
};

const addVerbose = (config) => {
	if (process.argv.indexOf('--verbose') >= 0) {
		config.stats = 'verbose';
	}
	return config;
};

module.exports = override(
	addVerbose,
	addProgressBar,
	setProd,
	addSplitChunks,
	addBrotli,
	addTerserPlugin,
	// addBundleVisualizer({}, true),
);
