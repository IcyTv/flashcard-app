/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFirebase } from 'react-redux-firebase';
import { applyMiddleware, compose, createStore, Store, AnyAction } from 'redux';
import { persistReducer, persistStore, Persistor, PersistConfig, REHYDRATE } from 'redux-persist';
import localStorage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import thunk from 'redux-thunk';
import makeRootReducer from './reducers';
import makeSagaMiddleware from 'redux-saga';
import reduxSentryMiddleware from 'redux-sentry-middleware';
import { refreshContinually } from '../firebase/redux';
import * as Sentry from '@sentry/browser';
import sizeof from 'object-sizeof';

const persistConfig: PersistConfig<ReduxState> = {
	key: 'root',
	storage: localStorage,
	blacklist: ['cache'],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_initialState: ReduxState | {} = {}): { store: Store<any, AnyAction>; persistor: Persistor } => {
	// const createStoreWithMiddleware = compose(
	// 	typeof window === 'object' && typeof (window as any).devToolsExtension !== 'undefined'
	// 		? (): any => (window as any).__REDUX_DEVTOOLS_EXTENSION__ // eslint-disable-line no-underscore-dangle
	// 		: (f: any): any => f,
	// )(createStore);

	const saga = makeSagaMiddleware({
		onError: (err) => Sentry.captureException(err),
	});

	const middlewares = [
		thunk.withExtraArgument(getFirebase),
		saga,
		reduxSentryMiddleware(Sentry, {
			stateTransformer: ({ cache, settings, google, debug, savedSheets }: ReduxState) => {
				return {
					cache,
					settings,
					debug,
					google: {
						expiresIn: google.expiresIn,
						now: Date.now(),
						diff: google.expiresIn - Date.now(),
					},
					savedSheets: {
						names: savedSheets.names,
					},
				};
			},
			actionTransformer: (action) => {
				//TODO filter large actions
				if (action.type.contains('@@firebase')) {
					return {
						type: action.type,
					};
				} else if (sizeof((action as any).payload) > 100000) {
					return {
						type: action.type,
						payload: 'Too large for logging!',
					};
				}
				return action;
			},
			filterBreadcrumbActions: (action) => {
				if (action.type === REHYDRATE) {
					return false;
				} else {
					return true;
				}
			},
			getUserContext: (state) => {
				return {
					id: state.firebase.auth.uid,
					email: state.firebase.auth.email,
					username: state.firebase.auth.displayName,
				};
			},
		}),
	];

	const persistedReducer = persistReducer(persistConfig, makeRootReducer());
	let rehydrationComplete;
	const rehydrationPromise = new Promise((resolve) => {
		rehydrationComplete = resolve;
	});

	// const composeEnhancers = composeWithDevTools({
	// 	realtime: true,
	// 	name: 'Flashcards',
	// 	hostname: 'remotedev.herokuapp.com',
	// 	port: 443,
	// 	secure: true,
	// });

	const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

	const store = createStore(
		persistedReducer,
		// initialState,
		composeEnhancers(applyMiddleware(...middlewares)),
		// composeEnhancers(applyMiddleware(...middlewares)),
	);

	const persistor = persistStore(store, {}, () => rehydrationComplete());

	// makeSagaActions(saga);
	saga.run(refreshContinually(rehydrationPromise));

	return { store, persistor };
};
