// Constants

import { Store } from 'redux';

export const types = {
	AUTH_SET: 'AUTH_SET',
	ACCESS_REFRESH: 'AUTH_REFRESH',
	ID_TOKEN_REFRESH: 'ID_TOKEN_REFRESH',
};

export function authChange(auth: GoogleAuth): { type: string; payload: GoogleAuth } {
	return {
		type: types.AUTH_SET,
		payload: auth,
	};
}

export function accessRefresh(accessToken: string): { type: string; payload: string } {
	return {
		type: types.ACCESS_REFRESH,
		payload: accessToken,
	};
}

export const setAuth = ({ dispatch }: Store): ((auth: GoogleAuth) => void) => {
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	return (auth: GoogleAuth) => dispatch(authChange(auth));
};

export const refreshAccess = ({ dispatch }: Store) => {
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	return (token: string) => dispatch(accessRefresh(token));
};

export const idTokenRefresh = ({ dispatch }: Store) => (idToken: string): void => {
	dispatch({ type: types.ID_TOKEN_REFRESH, payload: idToken });
};

// Reducer
const initialState = null;
export default function authReducer(
	state: ReduxState['google'] = initialState,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	{ type, payload }: { type: string; payload: any },
): ReduxState['google'] {
	if (type === types.AUTH_SET) {
		return {
			...payload,
			expiresIn: Date.now() + 60 * 60 * 1000,
		};
	} else if (type === types.ACCESS_REFRESH) {
		console.log('Access Refresh', Date.now() + 60 * 60 * 1000);
		return {
			...state,
			accessToken: payload,
			expiresIn: Date.now() + 60 * 60 * 1000,
		};
	} else if (type === types.ID_TOKEN_REFRESH) {
		return { ...state, tokenId: payload };
	} else {
		return state;
	}
}
