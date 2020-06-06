/* eslint-disable @typescript-eslint/explicit-function-return-type */
import delay from '@redux-saga/delay-p';
import { put, call, select } from '@redux-saga/core/effects';
import { types } from '../store/google';

const url = 'https://flashcards.icytv.de/api/refresh?token=';

function* refreshToken() {
	try {
		const idToken = yield select((state: ReduxState) => state.google.tokenId);
		console.log('idToken', idToken);
		const result = yield call(async () => {
			return await (await fetch(url + idToken)).json();
		});
		// console.log(result);
		// const jsonResult = yield call(result.json());
		yield put({ type: types.ACCESS_REFRESH, payload: result.access_token });
		yield put({ type: types.ID_TOKEN_REFRESH, payload: result.id_token });
	} catch (err) {
		console.error('Error while refreshing', err);
	}
}

export const refreshContinually = (rehydrationPromise: Promise<unknown>) =>
	function* () {
		yield call(async () => await rehydrationPromise);
		const expIn = yield select((state: ReduxState) => state.google.expiresIn);
		if (expIn - Date.now() > 0) {
			yield delay(expIn - Date.now());
		} else {
			console.log(expIn, expIn - Date.now());
		}
		while (true) {
			yield call(async () => await rehydrationPromise);
			yield refreshToken();
			yield delay(1000 * 60 * 60);
		}
	};
