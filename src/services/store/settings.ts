import { Store } from 'redux';

export const types = {
	SET_ADVANCED: 'SET_ADVANCED',
	SET_THEME: 'SET_THEME',
};

export const toggleAdvanced = ({ dispatch }: Store) => (to: boolean): void => {
	dispatch({ type: types.SET_ADVANCED, payload: to });
};

export const setTheme = ({ dispatch }: Store) => (to: 'dark' | 'light' | 'auto'): void => {
	dispatch({ type: types.SET_THEME, payload: to });
};

const reducer = (
	state: ReduxState['settings'],
	{ type, payload }: { type: string; payload: unknown },
): ReduxState['settings'] => {
	if (state === undefined) {
		return {
			advanced: false,
			theme: 'auto',
		};
	}
	switch (type) {
		case types.SET_ADVANCED:
			return { ...state, advanced: payload as boolean };
		case types.SET_THEME:
			return { ...state, theme: payload as 'dark' | 'light' | 'auto' };
		default:
			return state;
	}
};

export default reducer;
