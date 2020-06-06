import { ThemeDetection } from '@ionic-native/theme-detection';
import { IonApp } from '@ionic/react';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/typography.css';
import React, { useEffect, Suspense } from 'react';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import { PersistGate } from 'redux-persist/integration/react';
import './App.scss';
import StoreLoading from './components/StoreLoading';
import Router from './pages/Router';
import firebase, { analytics, auth } from './services/firebase';
import createStore from './services/store/createStore';
/* Theme variables */
import { Plugins } from '@capacitor/core';
import './theme/variables.scss';
import Loading from './components/Loading';
import { isPlatform } from '@ionic/core';
import { FirebaseX } from '@ionic-native/firebase-x';
import { overrideOnError } from './tools/logger';

const { SplashScreen } = Plugins;

const App: React.FC = () => {
	// console.log("RERENDERING APP", store.getState())

	// const auth = store.getState().auth;

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				analytics.setUserId(user.uid);
				if (isPlatform('mobile')) {
					FirebaseX.setCrashlyticsUserId(user.uid);
				}
			}
		});
		if (isPlatform('mobile')) {
			overrideOnError();
		}
	}, []);

	// useEffect(() => {
	// 	if (isPlatform('mobile')) {
	// 		SplashScreen.show({
	// 			showDuration: 10000,
	// 		});
	// 	}
	// });

	const { persistor, store } = createStore({});

	if (isPlatform('mobile')) {
		ThemeDetection.isDarkModeEnabled().then((v) => {
			if (v.value) {
				document.querySelector('body').classList.add('dark');
			}
		});
	} else {
		if (window.matchMedia('(perfers-color-scheme: dark)').matches) {
			document.querySelector('body').classList.add('dark');
		}
	}

	const fbProvConf = {
		userProfile: 'users',
	};

	const rrfProps = {
		firebase: firebase,
		config: fbProvConf,
		dispatch: store.dispatch,
		createFirestoreInstance,
	};

	return (
		<Provider store={store}>
			<PersistGate loading={<StoreLoading />} persistor={persistor}>
				<ReactReduxFirebaseProvider {...rrfProps}>
					<IonApp>
						<Suspense fallback={<Loading>Loading components</Loading>}>
							<Router />
						</Suspense>
					</IonApp>
				</ReactReduxFirebaseProvider>
			</PersistGate>
		</Provider>
	);
};

export default App;
