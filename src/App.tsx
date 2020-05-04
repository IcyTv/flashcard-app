import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/typography.css";
import React from "react";
import { Provider } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { AnyAction, createStore, Reducer } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import { CreateSheet } from "./pages/CreateSheet/CreateSheet";
import { FlashCardsPage } from "./pages/FlashCardsPage/FlashCardsPage";
import { Login } from "./pages/Login/Login";
import { SelectSheet } from "./pages/SelectSheet/SelectSheet";
/* Theme variables */
import "./theme/variables.css";

const reducer: Reducer<{ auth: Auth }> = (state, { type, payload }) => {
	if (type === "UPDATE_AUTH") {
		return { ...state, auth: payload };
	} else if (type === "DELETE_AUTH") {
		return { ...state, auth: null };
	} else {
		return state;
	}
};

const App: React.FC = () => {
	const persistConf = {
		key: "redux",
		storage,
	};
	const persistedReducer = persistReducer<{ auth: Auth }>(persistConf, reducer);
	const store = createStore<{ auth: Auth }, AnyAction, any, any>(persistedReducer, {
		auth: null,
	});

	const persistor = persistStore(store);

	console.log("RERENDERING APP", store.getState());

	const auth = store.getState().auth;

	return (
		<IonApp>
			<IonReactRouter>
				<IonRouterOutlet>
					<Provider store={store}>
						<PersistGate loading={<p>Loading...</p>} persistor={persistor}>
							<Route path="/create" component={CreateSheet} exact />
							<Route path="/select" component={SelectSheet} exact />
							<Route path="/flashcard" component={FlashCardsPage} exact />
							<Route path="/login" component={Login} exact />
							<Route
								path="/logout"
								render={() => {
									store.dispatch({ type: "DELETE_AUTH" });
									return <Redirect to="/" />;
								}}
								exact
							/>
							<Route path="/" render={() => <Redirect to="/login" />} exact={true} />
						</PersistGate>
					</Provider>
				</IonRouterOutlet>
			</IonReactRouter>
		</IonApp>
	);
};

export default App;
