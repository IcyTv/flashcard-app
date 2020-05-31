/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store, AnyAction } from 'redux';

export const types = {
	SAVE_NAMES: 'SAVE_SHEET_NAMES',
	ADD_SHEET: 'ADD_SHEET_PROPERTIES',
	REMOVE_SHEET: 'REMOVE_SHEET_PROPERTIES',
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const saveNames = (names: string[]) => {
	return {
		type: types.SAVE_NAMES,
		payload: names,
	};
};

export const saveNamesStore = ({ dispatch }: Store, names: string[]): void => {
	dispatch(saveNames(names));
};

export const newSheetProps = ({ dispatch }: Store) => (sheetProps: ReduxState['savedSheets']['sheets'][0]): void => {
	dispatch({ type: types.ADD_SHEET, payload: sheetProps });
};

export const removeSheetProps = ({ dispatch, getState }: Store<ReduxState, AnyAction>) => (id: string | number) => {
	if (typeof id === 'number') {
		dispatch({ type: types.REMOVE_SHEET, payload: id });
	} else {
		const sheets = getState().savedSheets.sheets.map((v) => v.id === id);
		if (sheets.indexOf(true) < 0) {
			throw new Error('No sheet with that id present');
		}
		dispatch({ type: types.REMOVE_SHEET, payload: sheets.indexOf(true) });
	}
};

const reducer = (
	state: ReduxState['savedSheets'] = { names: [], sheets: [] },
	{ type, payload }: { type: string; payload: unknown },
): ReduxState['savedSheets'] => {
	switch (type) {
		case types.SAVE_NAMES:
			return {
				...state,
				names: payload as string[],
			};
		case types.ADD_SHEET:
			state.sheets.push(payload as any);
			return {
				...state,
			};
		case types.REMOVE_SHEET:
			delete state.sheets[payload as number];
			return {
				...state,
			};
		default:
			return state;
	}
};

export default reducer as any;
