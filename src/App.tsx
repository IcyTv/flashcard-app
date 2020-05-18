import { IonApp, IonRouterOutlet, isPlatform, createAnimation } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
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
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { Redirect, Route, Switch } from 'react-router-dom';
import { createFirestoreInstance } from 'redux-firestore';
import { PersistGate } from 'redux-persist/integration/react';
import './App.scss';
import AppUrlListener from './components/AppUrlListener';
import { Header } from './components/Header/Header';
import { Loading } from './components/Loading/Loading';
import StoreLoading from './components/StoreLoading';
import StripePayment from './components/StripePayment';
import CreateSheetWithPicker from './pages/CreateSheetWithPicker';
import { FlashCardsPage } from './pages/FlashCardsPage/FlashCardsPage';
import { Login } from './pages/Login/Login';
import { Logout } from './pages/Logout/Logout';
import NotFound from './pages/NotFound';
import PaymentCancel from './pages/PaymentCancel';
import PaymentSuccess from './pages/PaymentSuccess';
import ProtectedRoute from './pages/ProtectedRoute';
import { SelectSheet } from './pages/SelectSheet/SelectSheet';
import firebase, { analytics, auth } from './services/firebase';
import createStore from './services/store/createStore';
import { AnimatedSwitch } from 'react-router-transition';
/* Theme variables */
import './theme/variables.css';
import Test from './components/Test';
import Menu from './components/Menu';

const App: React.FC = () => {
	// console.log("RERENDERING APP", store.getState())

	// const auth = store.getState().auth;

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				analytics.setUserId(user.uid);
			}
		});
	}, []);

	const { persistor, store } = createStore({});

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
						<Menu />
						<IonReactRouter>
							{/* <Route component={Header} path="/" /> */}
							<Header />
							<AppUrlListener />
							<IonRouterOutlet id="main-content" animated>
								{/* <Route component={Header} /> */}
								<Switch>
									<ProtectedRoute path="/create" exact>
										<CreateSheetWithPicker />
									</ProtectedRoute>
									<ProtectedRoute path="/select" exact>
										<SelectSheet />
									</ProtectedRoute>
									<ProtectedRoute path="/flashcard" exact>
										<FlashCardsPage />
									</ProtectedRoute>
									<Route path="/login" component={Login} exact />
									<Route path="/debug/spinner" component={Loading} exact />
									<ProtectedRoute path="/logout" exact>
										<Logout />
									</ProtectedRoute>
									{/* <Route path="/payment/creditcard" component={StripePayment} /> */}
									<Route path="/payment/success" component={PaymentSuccess} exact />
									<Route path="/payment/cancel" component={PaymentCancel} exact />
									<Route path="/payment" component={StripePayment} exact />
									<Route path="/" render={(): JSX.Element => <Redirect to="/login" />} exact={true} />
									<Route
										path="/app"
										render={(): JSX.Element => {
											if (isPlatform('mobileweb')) {
												window.close();
											}
											return null;
										}}
									/>
									<Route component={NotFound} />
								</Switch>
								{/* <Route path="/refresh" component={Refresh} /> */}
								<Route path="/test" component={Test} />
							</IonRouterOutlet>
						</IonReactRouter>
					</IonApp>
				</ReactReduxFirebaseProvider>
			</PersistGate>
		</Provider>
	);
};

export default App;
