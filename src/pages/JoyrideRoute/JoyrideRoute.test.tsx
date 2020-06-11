import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { JoyrideRoute } from './JoyrideRoute';
import createMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mockFb } from '../../tools/tests/firebase';
import { mockRRFB } from '../../tools/tests/react-redux-firebase';
import rr from 'react-redux';

const mockStore = createMockStore<ReduxState>([]);

describe('JoyrideRoute Tests', () => {
	let store: MockStoreEnhanced<ReduxState, {}>;
	beforeEach(() => {
		store = mockStore({
			google: {},
			firebase: {
				auth: {
					uid: 'testuid123',
				},
			},
		});
	});
	afterEach(cleanup);
	it('tmp test', () => {
		//Not implemented yet, because react-redux spyon does not work properly
	});
	// it('Renders without crashing', () => {
	// 	const spy = jest.spyOn(rr, 'useSelector').mockReturnValue('mockselectortest123');

	// 	const c = mockFb();
	// 	const c2 = mockRRFB();
	// 	const { baseElement } = render(
	// 		<Provider store={store}>
	// 			<JoyrideRoute />
	// 		</Provider>,
	// 	);
	// 	expect(baseElement).toBeDefined();
	// 	spy.mockRestore();
	// 	c();
	// 	c2();
	// });
});
