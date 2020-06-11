import React from 'react';
import { render, cleanup } from '@testing-library/react';
import App from './App';

describe('Main app tests', () => {
	afterEach(cleanup);
	it('renders without crashing', () => {
		const { baseElement } = render(<App />);
		expect(baseElement).toBeDefined();
	});
});
