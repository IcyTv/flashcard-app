/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFirebase } from 'react-redux-firebase';
import { applyMiddleware, compose, createStore, Store, AnyAction } from 'redux';
import { persistReducer, persistStore, Persistor, PersistConfig } from 'redux-persist';
import localStorage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'remote-redux-devtools';
import makeRootReducer from './reducers';

const persistConfig: PersistConfig<ReduxState> = {
	key: 'root',
	storage: localStorage,
	blacklist: ['cache'],
};

export default (initialState: ReduxState | {} = {}): { store: Store<any, AnyAction>; persistor: Persistor } => {
	const createStoreWithMiddleware = compose(
		typeof window === 'object' && typeof (window as any).devToolsExtension !== 'undefined'
			? (): any => (window as any).__REDUX_DEVTOOLS_EXTENSION__ // eslint-disable-line no-underscore-dangle
			: (f: any): any => f,
	)(createStore);

	const middlewares = [thunk.withExtraArgument(getFirebase)];

	const persistedReducer = persistReducer(persistConfig, makeRootReducer());

	const composeEnhancers = composeWithDevTools({
		realtime: true,
		name: 'Flashcards',
		hostname: 'remotedev.herokuapp.com',
		port: 443,
		secure: true,
	});

	const store = createStoreWithMiddleware(
		persistedReducer,
		initialState,
		composeEnhancers(applyMiddleware(...middlewares)),
	);

	const persistor = persistStore(store);

	return { store, persistor };
};
