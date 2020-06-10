/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

export const renderWithRouter = (
	ui: React.ReactElement,
	{ route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {},
) => {
	return { ...render(<Router history={history}>{ui}</Router>), history };
};
