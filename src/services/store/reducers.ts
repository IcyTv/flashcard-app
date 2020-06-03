import { firebaseReducer as firebase } from 'react-redux-firebase';
import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import { persistReducer } from 'redux-persist';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import localStorage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import authReducer from './google';
import downloadReducer from './downloader';
import savedSheetsReducer from './savedSheets';
import debugReducer from './debug';
import settingsReducer from './settings';
import cacheReducer from './cache';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function makeRootReducer() {
	return combineReducers({
		// Add sync reducers here
		firebase: persistReducer(
			{
				key: 'firebaseState',
				storage: localStorage,
				stateReconciler: hardSet,
			},
			firebase,
		),
		firestore: persistReducer(
			{
				key: 'firestore',
				storage: localStorage,
				stateReconciler: hardSet,
			},
			firestoreReducer,
		),
		// location: locationReducer,
		google: persistReducer(
			{
				key: 'google',
				storage: localStorage,
			},
			authReducer,
		),
		download: persistReducer(
			{
				key: 'download',
				storage: localStorage,
			},
			downloadReducer,
		),
		savedSheets: persistReducer(
			{
				key: 'savedSheets',
				storage: localStorage,
			},
			savedSheetsReducer,
		),
		debug: persistReducer(
			{
				key: 'debug',
				storage: localStorage,
			},
			debugReducer,
		),
		settings: persistReducer(
			{
				key: 'settings',
				storage: localStorage,
			},
			settingsReducer,
		),
		cache: persistReducer(
			{
				key: 'cache',
				storage: localStorage,
			},
			cacheReducer,
		),
	});
}
