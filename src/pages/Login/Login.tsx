import firebase from "firebase";
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
	console.log(props);
	const [token, setToken] = useState<any>();
	const store = useStore();
	const auth = store.getState().auth;

	if (props.isLoggedIn) {
		console.log("Redirecting");
		return <Redirect to="/select" />;
	}

	if (token) {
		let cred = firebase.auth.GoogleAuthProvider.credential(token.tokenId);
		FBAuth.signInWithCredential(cred).then((user) => {
			console.log("Google", token);
			props.dispatch({
				type: "UPDATE_AUTH",
				payload: {
					firebase: user,
					google: token,
				},
			});
		});
	}
	return (
		<div>
			<GoogleLogin
				clientId={config.web.client_id}
				onFailure={console.error}
				onSuccess={(res: any) => setToken(res)}
				scope={GOOGLE_OATH_SCOPES}
			/>
		</div>
	);
};

const isLoggendIn = (state, ownProps) => {
	return {
		isLoggedIn: !!state.auth,
	};
};

export const Login = connect(isLoggendIn)(LoginComp);
