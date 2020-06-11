/* Theme variables */
// import { FirebaseX } from '@ionic-native/firebase-x';
import { ThemeDetection } from '@ionic-native/theme-detection';
import { isPlatform } from '@ionic/core';
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
import React, { Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import { PersistGate } from 'redux-persist/integration/react';
import './App.scss';
import Loading from './components/Loading';
import StoreLoading from './components/StoreLoading';
import Router from './pages/Router';
import firebase, { analytics, auth } from './services/firebase';
import createStore from './services/store/createStore';
import './theme/variables.scss';
import { overrideOnError } from './tools/logger';
import * as Sentry from '@sentry/browser';

const App: React.FC = () => {
	// console.log("RERENDERING APP", store.getState())

	// const auth = store.getState().auth;

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				analytics.setUserId(user.uid);
				Sentry.setUser({
					email: user.email,
					id: user.uid,
					username: user.displayName,
				});
				// if (isPlatform('cordova') || isPlatform('capacitor')) {
				// 	FirebaseX.setCrashlyticsUserId(user.uid);
				// }
			}
		});
		if (isPlatform('cordova') || isPlatform('capacitor')) {
			overrideOnError();
		}
	}, []);

	// useEffect(() => {
	// 	if (isPlatform('cordova') || isPlatform('capacitor')) {
	// 		SplashScreen.show({
	// 			showDuration: 10000,
	// 		});
	// 	}
	// });

	const { persistor, store } = createStore({});

	if (isPlatform('cordova') || isPlatform('capacitor')) {
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
