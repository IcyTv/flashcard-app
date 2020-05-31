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

export const newSheetProps = ({ dispatch }: Store) => (
	sheetProps: ReduxState['savedSheets']['sheets'][0][0] & { id: string; worksheetIndex: number },
): void => {
	dispatch({ type: types.ADD_SHEET, payload: sheetProps });
};

export const removeSheetProps = ({ dispatch }: Store<ReduxState, AnyAction>) => (id: string): void => {
	dispatch({ type: types.REMOVE_SHEET, payload: id });
};

const reducer = (
	state: ReduxState['savedSheets'] = { names: [], sheets: {} },
	{ type, payload }: { type: string; payload: unknown },
): ReduxState['savedSheets'] => {
	switch (type) {
		case types.SAVE_NAMES:
			return {
				...state,
				names: payload as string[],
			};
		case types.ADD_SHEET:
			const id = (payload as { id: string }).id;
			const index = (payload as { worksheetIndex: number }).worksheetIndex;
			delete payload['id'];
			delete payload['worksheetIndex'];
			const tmp = state.sheets[id] || [];
			tmp[index] = payload as any;
			return {
				...state,
				sheets: {
					[id]: { ...tmp },
				},
			};
		case types.REMOVE_SHEET:
			delete state.sheets[payload as string];
			return {
				...state,
			};
		default:
			return state;
	}
};

export default reducer as any;
