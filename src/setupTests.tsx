/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import 'fake-indexeddb/auto';
import 'intersection-observer';
import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';

(global as any).matchMedia =
	global.matchMedia ||
	function () {
		return {
			matches: false,
			addListener: function () {},
			removeListener: function () {},
		};
	};

export const renderWithRouter = (
	ui: React.ReactElement,
	{ route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {},
) => {
	return { ...render(<Router history={history}>{ui}</Router>), history };
};
