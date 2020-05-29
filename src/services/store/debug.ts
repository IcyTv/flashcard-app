import { Store } from 'redux';

export const types = {
	SET_ONLINE: 'SET_ONLINE',
	SET_OFFLINE: 'SET_OFFLINE',
	SET_FIRST_TIME: 'SET_FIRST_TIME',
};

export const setOnline = ({ dispatch }: Store): void => {
	dispatch({ type: types.SET_ONLINE });
};

export const setOffline = ({ dispatch }: Store): void => {
	dispatch({ type: types.SET_OFFLINE });
};

export const setFirstTime = ({ dispatch }: Store) => (firstTime: boolean): void => {
	dispatch({ type: types.SET_FIRST_TIME, payload: firstTime });
};

export const toggleNetworkDev = ({ dispatch }: Store) => (to: boolean): void => {
	dispatch({ type: to ? types.SET_OFFLINE : types.SET_ONLINE });
};

const reducer = (state, { type, payload }: { type: string; payload: unknown }): ReduxState['debug'] => {
	if (state === undefined) {
		return { networkDev: false, firstTime: false };
	}
	switch (type) {
		case types.SET_ONLINE:
			return { ...state, networkDev: false };
		case types.SET_OFFLINE:
			return { ...state, networkDev: true };
		case types.SET_FIRST_TIME:
			return { ...state, firstTime: payload };
		default:
			return state;
	}
};

export default reducer;
