/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFirebase } from 'react-redux-firebase';
import { applyMiddleware, compose, createStore, Store, AnyAction } from 'redux';
import { persistReducer, persistStore, Persistor, PersistConfig } from 'redux-persist';
import localStorage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'remote-redux-devtools';
import makeRootReducer from './reducers';
import makeSagaMiddleware from 'redux-saga';
import makeSagaActions from './saga';
import { refreshContinually } from '../firebase/redux';

const persistConfig: PersistConfig<ReduxState> = {
	key: 'root',
	storage: localStorage,
	blacklist: ['cache'],
};

export default (initialState: ReduxState | {} = {}): { store: Store<any, AnyAction>; persistor: Persistor } => {
	// const createStoreWithMiddleware = compose(
	// 	typeof window === 'object' && typeof (window as any).devToolsExtension !== 'undefined'
	// 		? (): any => (window as any).__REDUX_DEVTOOLS_EXTENSION__ // eslint-disable-line no-underscore-dangle
	// 		: (f: any): any => f,
	// )(createStore);

	const saga = makeSagaMiddleware();

	const middlewares = [thunk.withExtraArgument(getFirebase), saga];

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
