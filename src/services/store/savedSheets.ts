/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from 'redux';

export const types = {
	SAVE_NAMES: 'SAVE_SHEET_NAMES',
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

const reducer = (
	state: ReduxState['savedSheets'] = { names: [] },
	{ type, payload }: { type: string; payload: unknown },
): ReduxState['savedSheets'] => {
	switch (type) {
		case types.SAVE_NAMES:
			return {
				...state,
				names: payload as string[],
			};
		default:
			return state;
	}
};

export default reducer as any;
