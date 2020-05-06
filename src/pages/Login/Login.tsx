import firebase from "firebase/app";
import "firebase/auth";
import React, { useState } from "react";
import GoogleLogin from "react-google-login";
import { connect, useStore } from "react-redux";
import { Redirect } from "react-router";
import { auth as FBAuth } from "../../services/firebase";
import config from "../../services/googleapis_config.json";

interface LoginProps {
	dispatch?: (x: any) => any;
	isLoggedIn?: boolean;
}

const GOOGLE_OATH_SCOPES =
	"https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/spreadsheets";
const LoginComp: React.FC<LoginProps> = (props) => {
	const [token, setToken] = useState<GoogleAuth>();
	const store = useStore();
	// const auth = store.getState().auth;

	if (props.isLoggedIn) {
		console.log("Redirecting");
		return <Redirect to="/select" />;
	}

	if (token) {
		console.log("Google", token);
		let cred = firebase.auth.GoogleAuthProvider.credential(token.tokenId);
		FBAuth.signInWithCredential(cred).then((user) => {
			props.dispatch({
				type: "UPDATE_AUTH",
				payload: {
					firebase: user,
					google: token,
				},
			});
			console.log(store.getState());
		});
	}
	return (
		<div>
			<GoogleLogin
				clientId={config.web.client_id}
				onFailure={(err) => {
					console.log(token);
					console.log(store.getState());
					console.error(err);
				}}
				onSuccess={(res: any) => {
					setToken(res);
				}}
				accessType="offline"
				prompt="consent"
				scope={GOOGLE_OATH_SCOPES}
				fetchBasicProfile={true}
			/>
			{/* <IonButton
				onClick={() =>
					(window.location.href =
						"https://europe-west1-flashcards-1588528687957.cloudfunctions.net/googleAuth/auth")
				}
			>
				<IonIcon icon={logoGoogle} />
				Sign in with google
			</IonButton> */}
		</div>
	);
};

const isLoggendIn = (state, ownProps) => {
	return {
		isLoggedIn: !!state.auth,
	};
};

export const Login = connect(isLoggendIn)(LoginComp);
