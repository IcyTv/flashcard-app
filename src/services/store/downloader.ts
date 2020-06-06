/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleSpreadsheetCell, GoogleSpreadsheet } from 'google-spreadsheet';
import { Store } from 'redux';

export const types = {
	SAVE_PROGRESS: 'SAVE_PROGRESS',
	SAVE_SPREADSHEET: 'SAVE_SPREADSHEET',
	DELETE_SAVED: 'DELETE_SAVED',
};

export const saveProgress = (progress: number[], id: string): { type: string; payload: number[]; id: string } => {
	return {
		type: types.SAVE_PROGRESS,
		payload: progress,
		id: id,
	};
};

export const saveSpreadsheet = (
	spreadsheet: string[][],
	name: string,
	id: string,
): { type: string; payload: any; id: string } => {
	return {
		type: types.SAVE_SPREADSHEET,
		payload: {
			data: spreadsheet,
			name: name,
		},
		id: id,
	};
};

export const deleteSaved = (id: string): { type: string; id: string } => {
	return {
		type: types.DELETE_SAVED,
		id: id,
	};
};

export const saveSpreadsheetStore = ({ dispatch }: Store) => (spreadsheet: GoogleSpreadsheet, id: string): void => {
	console.log('Sheet', spreadsheet.sheetsByIndex[0]);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const sheet = ((spreadsheet.sheetsByIndex[0] as any)._cells as GoogleSpreadsheetCell[][]).map((v) => {
		return v.map((c) => c.value);
	});
	const fSheet = sheet.filter((v) => v.filter((v) => v).length != 0);
	dispatch(saveSpreadsheet(fSheet, spreadsheet.title, id));
};

export const saveProgressStore = ({ dispatch }: Store) => (done: number[], id: string): void => {
	dispatch(saveProgress(done, id));
};

export const deleteSavedStore = ({ dispatch }: Store) => (id: string): void => {
	dispatch(deleteSaved(id));
};

const downloadReducer = (
	state: ReduxState['download'],
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	{ type, payload, id }: { type: string; payload: any; id: string },
): ReduxState['download'] => {
	if (state === undefined) {
		return {};
	}
	switch (type) {
		case types.SAVE_PROGRESS:
			return { ...state, [id]: { ...state[id], done: payload } };
		case types.SAVE_SPREADSHEET:
			return { ...state, [id]: payload };
		case types.DELETE_SAVED:
			delete state[id];
			return {
				...state,
			};
		default:
			return state;
	}
};

export default downloadReducer;
