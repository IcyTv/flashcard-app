import { Plugins } from '@capacitor/core';
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonContent,
	IonImg,
	IonTitle,
	isPlatform,
} from '@ionic/react';
import firebase from 'firebase/app';
import 'firebase/auth';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { Redirect, RouterProps } from 'react-router';
import { Loading } from '../../components/Loading/Loading';
import { analytics } from '../../services/firebase';
import { setAuth } from '../../services/store/google';
import './Login.scss';
import { Flip } from 'react-awesome-reveal';
import { setFirstTime } from '../../services/store/debug';

const { Browser } = Plugins;

interface LoginProps extends RouterProps {
	isLoggedIn?: boolean;
}

// TODO save expires_at

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

				setFirstTime(store)(user.additionalUserInfo.isNewUser);

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
			});
		return <Loading>Processing login details</Loading>;
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
		<IonContent className="login ion-align-items-center ion-justify-content-center">
			<Flip>
				<IonCard>
					<IonCardHeader>
						<IonTitle>Login</IonTitle>
						<br />
					</IonCardHeader>
					<IonCardContent>
						<IonButton
							color="tertiary"
							className="ion-align-self-center ion-justify-content-center"
							onClick={(): null => {
								const redirect = window.location.href.slice();
								console.log(redirect);
								openInSameTab('https://flashcards.icytv.de/api/auth?redirect_uri=' + redirect);
								return null;
							}}
						>
							<IonImg
								src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
								alt="Google image"
							></IonImg>
							Sign in with google
						</IonButton>
					</IonCardContent>
				</IonCard>
			</Flip>
		</IonContent>
	);
};
export const Login = LoginComp;
