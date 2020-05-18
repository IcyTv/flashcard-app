import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Store } from 'redux';
import { saveProgressStore, saveSpreadsheetStore } from './store/downloader';

export const downloadSpreadsheet = async (id: string, accessToken: string, store: Store): Promise<void> => {
	const sheet = new GoogleSpreadsheet(id);
	await sheet.useRawAccessToken(accessToken);
	await sheet.loadInfo();
	await sheet.sheetsById[0].loadCells();
	saveSpreadsheetStore(store)(sheet, id);
};

export const saveDone = async (id: string, done: number[], store: Store): Promise<void> => {
	console.log('saving', id, done);
	return new Promise((resolve) => {
		saveProgressStore(store)(done, id);
		resolve();
	});
};
