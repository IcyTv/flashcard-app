module.exports = {
	extends: 'react-app',
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	parserOptions: {
		ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
		sourceType: 'module', // Allows for the use of imports
		ecmaFeatures: {
			jsx: true, // Allows for the parsing of JSX
		},
	},
	settings: {
		react: {
			version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
		},
	},
	extends: [
		'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
		'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin,
		'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
		'plugin:prettier/recommended',
		'plugin:react/recommended',
		// 'airbnb',
	],
	rules: {
		'@typescript-eslint/no-useless-constructor': 1,
		// '@typescript-eslint/typedef': 1,
		'@typescript-eslint/no-require-imports': 2,
		'@typescript-eslint/no-empty-interface': 0,
	},
	env: {
		browser: true,
	},
	ignorePatterns: ['config-overrides.js', 'Test.tsx', 'CreateSheet.tsx', 'functions/*'],
};
