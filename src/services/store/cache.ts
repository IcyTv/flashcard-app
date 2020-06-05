import { set } from 'lodash';
import { Store } from 'redux';

export const types = {
	SHEET: 'CACHE_SHEET',
	LIST: 'CACHE_SHEET_LIST',
	VALIDATE: 'CACHE_VALIDATE',
	INVALIDATE: 'CACHE_INVALIDATE',
};

export const validateCache = ({ dispatch }: Store) => (key?: string): void => {
	dispatch({ type: types.VALIDATE, payload: key });
};

export const invalidateCache = ({ dispatch }: Store) => (key?: string): void => {
	dispatch({ type: types.INVALIDATE, payload: key });
};

export const cacheList = ({ dispatch }: Store) => (list: ReduxState['cache']['list']): void => {
	dispatch({ type: types.LIST, payload: list });
};

export const cacheSheet = ({ dispatch }: Store) => (
	sheet: ReduxState['cache']['sheets'][''] & { id: string },
): void => {
	dispatch({ type: types.SHEET, payload: sheet });
};

export default (
	state: ReduxState['cache'],
	{ type, payload }: { type: string; payload: unknown },
): ReduxState['cache'] => {
	if (state === undefined) {
		return {
			list: [],
			sheets: {},
		};
	}
	switch (type) {
		case types.VALIDATE:
			if (!payload) {
				return {
					...state,
					valid: true,
				};
			} else {
				const tmp = set(state, payload as string, true);
				return {
					...tmp,
				};
			}
		case types.INVALIDATE:
			if (!payload) {
				return {
					...state,
					valid: false,
				};
			} else {
				const tmp = set(state, payload as string, false);
				return {
					...tmp,
				};
			}
		case types.LIST:
			return {
				...state,
				...(payload as ReduxState['cache']['list']),
			};
		case types.SHEET:
			const id = (payload as { id: string }).id;
			delete payload['id'];
			return {
				...state,
				[id]: payload,
			};
		default:
			return state;
	}
};
