import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { JoyrideRoute } from './JoyrideRoute';

describe('JoyrideRoute Tests', () => {
	afterEach(cleanup);
	it('Renders without crashing', () => {
		const { baseElement } = render(<JoyrideRoute />);
		expect(baseElement).toBeDefined();
	});
});
