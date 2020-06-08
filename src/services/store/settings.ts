import { Store } from 'redux';

export const types = {
	SET_ADVANCED: 'SETTINGS_SET_ADVANCED',
	SET_THEME: 'SETTINGS_SET_THEME',
	SET_PRE_RELEASE: 'SETTIGNS_SET_PRE_RELEASE',
};

export const toggleAdvanced = ({ dispatch }: Store) => (to: boolean): void => {
	dispatch({ type: types.SET_ADVANCED, payload: to });
};

export const setTheme = ({ dispatch }: Store) => (to: 'dark' | 'light' | 'auto'): void => {
	dispatch({ type: types.SET_THEME, payload: to });
};

export const setPreReleases = ({ dispatch }: Store) => (preRelease: boolean): void => {
	dispatch({ type: types.SET_PRE_RELEASE, payload: preRelease });
};

const reducer = (
	state: ReduxState['settings'],
	{ type, payload }: { type: string; payload: unknown },
): ReduxState['settings'] => {
	if (state === undefined) {
		return {
			advanced: false,
			theme: 'auto',
			preReleases: false,
		};
	}
	switch (type) {
		case types.SET_ADVANCED:
			return { ...state, advanced: payload as boolean };
		case types.SET_THEME:
			return { ...state, theme: payload as 'dark' | 'light' | 'auto' };
		case types.SET_PRE_RELEASE:
			return {
				...state,
				preReleases: payload as boolean,
			};
		default:
			return state;
	}
};

export default reducer;
