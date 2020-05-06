import { IonContent, IonTitle } from "@ionic/react";
import React, { useState } from "react";
import { GoogleLogout } from "react-google-login";
import { useStore } from "react-redux";
import { Redirect } from "react-router";
import { auth } from "../../services/firebase";
import config from "../../services/googleapis_config.json";
import "./Logout.scss";

export const Logout: React.FC = () => {
	const [redirect, setRedirect] = useState(false);
	const [errors, setErrors] = useState<any>();
	const store = useStore();

	if (redirect) {
		return <Redirect to="/login" />;
	}

	if (errors) {
		return (
			<IonContent>
				<IonTitle color="danger">{"" + errors}</IonTitle>
			</IonContent>
		);
	}

	const onLogout = () => {
		console.log("Logged out!");
		store.dispatch({ type: "DELETE_AUTH" });
		auth.signOut().then(() => {
			setErrors("Redirecting");
			setTimeout(() => setRedirect(true), 500);
		});
	};
	return (
		<IonContent>
			<GoogleLogout
				onFailure={() => setErrors("Error while logging out")}
				clientId={config.web.client_id}
				onLogoutSuccess={onLogout}
			/>
		</IonContent>
	);
};
