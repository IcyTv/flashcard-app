import { IonRouterOutlet, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React, { useEffect } from 'react';
import './Router.scss';
import { Route, Switch, Redirect } from 'react-router-dom';
import JoyrideRoute from '../JoyrideRoute';
import { useSelector } from 'react-redux';
import { ThemeDetection } from '@ionic-native/theme-detection';
// import AppUrlListener from './components/AppUrlListener';
const AppUrlListener = React.lazy(() => import('../../components/AppUrlListener'));
// import { Header } from './components/Header/Header';
const Header = React.lazy(() => import('../../components/Header'));
// import { Loading } from './components/Loading/Loading';
const Loading = React.lazy(() => import('../../components/Loading'));
// import StoreLoading from './components/StoreLoading';
const StripePayment = React.lazy(() => import('../../components/StripePayment'));
// import CreateSheetWithPicker from './pages/CreateSheetWithPicker';
const CreateSheetWithPicker = React.lazy(() => import('../CreateSheetWithPicker'));
// import { FlashCardsPage } from './pages/FlashCardsPage/FlashCardsPage';
const FlashCardsPage = React.lazy(() => import('../FlashCardsPage'));
// import { Login } from './pages/Login/Login';
const Login = React.lazy(() => import('../Login'));
// import { Logout } from './pages/Logout/Logout';
const Logout = React.lazy(() => import('../Logout'));
// import NotFound from './pages/NotFound';
const NotFound = React.lazy(() => import('../NotFound'));
// import PaymentCancel from './pages/PaymentCancel';
const PaymentCancel = React.lazy(() => import('../PaymentCancel'));
// import PaymentSuccess from './pages/PaymentSuccess';
const PaymentSuccess = React.lazy(() => import('../PaymentSuccess'));
// import ProtectedRoute from './pages/ProtectedRoute';
const ProtectedRoute = React.lazy(() => import('../ProtectedRoute'));
// import Test from './components/Test';
const Test = React.lazy(() => import('../../components/Test'));
// import Menu from './components/Menu';
const Menu = React.lazy(() => import('../../components/Menu'));
// import { SelectSheet } from './pages/SelectSheet/SelectSheet';
const SelectSheet = React.lazy(() => import('../SelectSheet'));
// import Settings from './pages/Settings'
const Settings = React.lazy(() => import('../Settings'));

interface RouterProps {}

const isDarkmode = async (): Promise<boolean> => {
	if (isPlatform('mobile')) {
		return (await ThemeDetection.isDarkModeEnabled()).value;
	} else {
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	}
};

export const Router: React.FC<RouterProps> = (props) => {
	const theme = useSelector((state: ReduxState) => state.settings.theme);

	useEffect(() => {
		if (theme === 'dark') {
			const bClassList = document.querySelector('body').classList;
			if (!bClassList.contains('dark')) {
				bClassList.add('dark');
			}
		} else if (theme === 'light') {
			const bClassList = document.querySelector('body').classList;
			if (bClassList.contains('dark')) {
				bClassList.remove('dark');
			}
		} else if (theme === 'auto') {
			const bClassList = document.querySelector('body').classList;
			isDarkmode().then((v) => {
				if (v) {
					if (!bClassList.contains('dark')) {
						bClassList.add('dark');
					}
				} else {
					if (bClassList.contains('dark')) {
						bClassList.remove('dark');
					}
				}
			});
		}
	}, [theme]);

	return (
		<>
			<IonReactRouter>
				<Menu />
				<Header />
				<AppUrlListener />
				<IonRouterOutlet id="main-content" animated>
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
						<Route path="/payment/success" component={PaymentSuccess} exact />
						<Route path="/payment/cancel" component={PaymentCancel} exact />
						<Route path="/payment" component={StripePayment} exact />
						<Route path="/" render={(): JSX.Element => <Redirect to="/login" />} exact />
						<Route
							path="/app"
							render={(): JSX.Element => {
								if (isPlatform('mobileweb')) {
									window.close();
								}
								return null;
							}}
						/>
						<Route path="/settings" component={Settings} exact />
						<Route path="/joyride" component={JoyrideRoute} exact />
						<Route path="/test" component={Test} exact />
						<Route component={NotFound} />
					</Switch>
				</IonRouterOutlet>
			</IonReactRouter>
		</>
	);
};
