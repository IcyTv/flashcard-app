import { Plugins } from '@capacitor/core';
import { IonButton, IonIcon, isPlatform, IonRouterLink, IonContent } from '@ionic/react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { logoGoogle } from 'ionicons/icons';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useStore, useSelector } from 'react-redux';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { Redirect, RouterProps } from 'react-router';
import { Loading } from '../../components/Loading/Loading';
import { analytics } from '../../services/firebase';
import { setAuth } from '../../services/store/google';

const { Browser } = Plugins;

interface LoginProps extends RouterProps {
	isLoggedIn?: boolean;
}

//TODO save expires_at

const openInSameTab = (url: string): null => {
	if (isPlatform('mobile')) {
		url = url.replace(/\?redirect_uri=.*/, '?redirect_uri=flashcards://login');

		Browser.open({ url: url });
	} else {
		window.open(url, '_self');
	}
	return null;
};

const LoginComp: React.FC<LoginProps> = (props: LoginProps) => {
	const [token, setToken] = useState<{
		accessToken: string;
		tokenId: string;
	}>();
	const [redirectTo, setRedirect] = useState('');
	const store = useStore();
	const firebaseStore = useFirebase();
	const firestore = useFirestore();

	const google = useSelector((state: ReduxState) => state.google);

	const [isLoaded, setLoaded] = useState(false);

	useEffect(() => {
		analytics.setCurrentScreen('login_screen');
	}, []);
	firebase.auth().onAuthStateChanged(() => {
		setLoaded(true);
	});

	if (!isLoaded) {
		return <Loading>Waiting for storage</Loading>;
	}

	if (redirectTo) {
		console.log('Redirecting', redirectTo);
		//window.location.href = redirectTo;
		return <Redirect to="/select" />;
	}

	if (firebase.auth().currentUser && google.accessToken && google.tokenId) {
		setRedirect('/select');
		return <Loading>Loading</Loading>;
	}

	if (token) {
		console.log('Google', token);
		const cred = firebase.auth.GoogleAuthProvider.credential(token.tokenId);
		firebaseStore
			.auth()
			.signInWithCredential(cred)
			.then((user: firebase.auth.UserCredential) => {
				setAuth(store)(token);

				analytics.setUserProperties({
					email: user.user.email,
					displayName: user.user.displayName,
				});

				firestore
					.collection('users')
					.doc(user.user.uid)
					.set({})
					.then(() => {
						analytics.logEvent('login', { method: 'google' });
						console.log('created user');
						setRedirect('/select');
					});

				console.log(store.getState());
			});
	}

	if (props.history.location.search && !token) {
		const search = queryString.parse(props.history.location.search);

		const tokens = {
			accessToken: search.accessToken as string,
			tokenId: search.tokenId as string,
		};

		setToken(tokens);
	}

	return (
		<IonContent>
			<IonButton
				onClick={(): null => {
					const redirect = window.location.href.slice();
					console.log(redirect);
					openInSameTab('https://flashcards.icytv.de/api/auth?redirect_uri=' + redirect);
					return null;
				}}
			>
				<IonIcon icon={logoGoogle} />
				Sign in with google
			</IonButton>
		</IonContent>
	);
};
export const Login = LoginComp;
