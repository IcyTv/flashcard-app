import '@testing-library/jest-dom/extend-expect';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { AnyAction, Store } from 'redux';
import createMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import Login from '.';
import { renderWithRouter } from '../../setupTests';
import '../../tools/tests/firebase';
import firebase from 'firebase/app';
import { mockFb } from '../../tools/tests/firebase';
import { mockRRFB } from '../../tools/tests/react-redux-firebase';
// import {} from 'firestore-jest-mock';

const mockStore = createMockStore<ReduxState>([]);

describe('Testing Login Page', () => {
	let store: MockStoreEnhanced<ReduxState, {}>;
	beforeEach(() => {
		store = mockStore({
			google: {},
		});
	});

	afterEach(async () => {
		await cleanup();
	});

	it('Renders without crashing', () => {
		const { baseElement, getByText } = renderWithRouter(
			<Provider store={store}>
				<Login />
			</Provider>,
			{ route: '/login' },
		);
		expect(baseElement).toBeDefined();
		const btn = getByText('Sign in with google');
		expect(btn).toBeDefined();
	});

	it('Redirects on click', async () => {
		const { getByText } = renderWithRouter(
			<Provider store={store}>
				<Login />
			</Provider>,
			{ route: '/login' },
		);
		global.open = jest.fn();
		fireEvent.click(getByText('Sign in with google'));
		expect(global.open).toHaveBeenCalledWith(
			expect.stringMatching(/https:\/\/flashcards.icytv.de\/api\/auth\?redirect_uri=.*/),
			'_self',
		);
		// expect(history.location.pathname).toEqual('/api/auth');
	});

	it('Test if firebase login works', async () => {
		const spy = mockFb();
		const spy2 = mockRRFB();
		const accessToken = '123123asdasd';
		const tokenId = 'sdfsdfsdf1231';
		const { history, container } = renderWithRouter(
			<Provider store={store}>
				<Login />
			</Provider>,
			{
				route: `/login?accessToken=${accessToken}&tokenId=${tokenId}`,
			},
		);
		await waitFor(() => expect(firebase.auth().signInWithCredential).toHaveBeenCalledTimes(1), {
			container,
			timeout: 4000,
		});
		await waitFor(() => expect(history.location.pathname).toEqual('/select'));
		const actions = store.getActions();
		expect(actions).toHaveLength(2);
		expect(actions[0]).toMatchObject({
			payload: { accessToken, tokenId },
		});
		expect(actions[1]).toMatchObject({
			payload: true,
		});
		expect(firebase.auth.GoogleAuthProvider.credential).toHaveBeenCalledTimes(1);
		spy();
		spy2();
	});
});
