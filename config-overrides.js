const TerserPlugin = require("terser-webpack-plugin");
const { override, addBundleVisualizer } = require("customize-cra");
const webpack = require("webpack");
const cliProgress = require("cli-progress");
const { WebpackDeduplicationPlugin } = require("webpack-deduplication-plugin");

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
	if (process.argv.indexOf("--prod") >= 0) {
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

const test = (config) => {
	console.log(config);
	return config;
};

module.exports = override(
	addProgressBar,
	addTerserPlugin,
	addBundleVisualizer({}, true)
);
