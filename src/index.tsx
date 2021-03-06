import * as Sentry from '@sentry/browser';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

Sentry.init({
	dsn: 'https://4d92290421964df3bc443a8b8fba723b@o403798.ingest.sentry.io/5266816',
	environment: process.env.NODE_ENV || 'production',
	attachStacktrace: true,
	// eslint-disable-next-line
	release: '%%TAG_NAME%%'.indexOf('%') >= 0 ? undefined : '%%TAG_NAME%%',
});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
