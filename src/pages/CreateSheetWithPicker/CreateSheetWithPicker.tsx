/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { isPlatform } from '@ionic/core';
import { IonBackButton, IonButtons, IonHeader, IonItem, IonToolbar } from '@ionic/react';
import fbTypes from 'firebase/app';
import { arrowBack } from 'ionicons/icons';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import GooglePicker from '../../components/GooglePicker';
import { Loading } from '../../components/Loading/Loading';
import { analytics } from '../../services/firebase';
import { refreshToken, wait } from '../../services/firebase/auth';
import { error } from '../../tools/logger';
import './CreateSheetWithPicker.scss';

declare global {
	interface Window {
		picker?: any;
		webkit?: {
			messageHandlers: {
				cordova_iab: {
					postMessage(message: string): void;
				};
			};
		};
	}
}

interface CreateSheetWithPickerProps {
	disableAutoOpen?: boolean;
}

const url = 'https://flashcards.icytv.de/create';
// const url = 'http://192.168.178.60:8100/create';

const isDarkMode = document.querySelector('body').classList.contains('dark');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CreateSheetWithPicker: React.FC<CreateSheetWithPickerProps> = (props: CreateSheetWithPickerProps) => {
	const [picked, setPicked] = useState(null);
	const [errors, setErrors] = useState(null);
	const [doneLoading, setDoneLoading] = useState(false);
	const [forceReload, setForceReload] = useState(0);

	const store = useStore();
	const location = useLocation();
	const history = useHistory();
	const firestore = useFirestore();
	const firebase = useFirebase();

	const googleAcccess = useSelector((state: ReduxState) => state.google);
	const sSheets = useSelector((state: ReduxState) => state.savedSheets.names);

	const [isLoaded, setLoaded] = useState(false);
	const [isAuth, setIsAuth] = useState(false);

	const redirectToQuery = queryString.parse(location.search).redirectTo as string;
	// const accessToken = queryString.parse(location.search).oauthToken as string;
	const theme = queryString.parse(location.search).theme as string;
	const tokenId = queryString.parse(location.search).tokenId as string;

	if (theme === 'dark' && !isDarkMode) {
		document.querySelector('body').classList.add('dark');
	}

	useEffect(() => wait(firebase, setIsAuth), []);

	useEffect(() => {
		analytics.setCurrentScreen('create_screen');
	}, []);

	useEffect(() => {
		if (isPlatform('mobile') && !isPlatform('mobileweb') && !redirectToQuery) {
			let urlBuilder = `${url}?redirectTo=flashcards://select&oauthToken=${btoa(
				googleAcccess.accessToken,
			)}&tokenId=${googleAcccess.tokenId}`;
			console.log(urlBuilder);
			if (isDarkMode) {
				urlBuilder += '&theme=dark';
			}
			// Browser.open({ url: urlBuilder });
			const browser = InAppBrowser.create(urlBuilder, '_blank', {
				footer: 'no',
				hidenavigationbuttons: 'yes',
				toolbar: 'no',
				hardwareback: 'no',
				location: 'no',
				fullscreen: 'no',
			});
			browser.on('exit').subscribe(() => {
				console.log('exited browser');
				if (!errors) {
					history.push('/create');
				}
			});

			browser.on('message').subscribe((event) => {
				console.log(event);
				if (event.data && event.data.my_message === 'close') {
					if (event.data.errors) {
						setErrors(errors);
					}
					browser.close();
				}
			});
		}
	}, [googleAcccess]);

	useEffect(() => {
		if (tokenId) {
			const cred = fbTypes.auth.GoogleAuthProvider.credential(tokenId);
			firebase
				.auth()
				.signInWithCredential(cred)
				.then(() => {
					setLoaded(true);
				})
				.catch((err) => {
					console.error(err);
					if (window.webkit) {
						window.webkit.messageHandlers.cordova_iab.postMessage(
							JSON.stringify({
								my_message: 'close',
								errors: err,
							}),
						);
					} else {
						analytics.logEvent('exception', {
							description: "Window.webkit not found! Couldn't close the picker browser automatically",
						});
						error("Window.webkit not found! Couldn't close the picker browser automatically");
					}
				});
		}
	}, [firebase]);

	useEffect(() => {
		history.listen(() => {
			if (window.picker) {
				window.picker.setVisible(false);
			}
		});
	}, [history]);

	useEffect(() => {
		if (googleAcccess.expiresIn - Date.now() < 0) {
			refreshToken(googleAcccess.tokenId, store);
			setForceReload(forceReload + 1);
		}
	}, [googleAcccess]);

	firebase.auth().onAuthStateChanged(() => {
		setLoaded(true);
	});

	if (!isLoaded || !isAuth) {
		return <Loading>Waiting for storage</Loading>;
	}

	if (doneLoading) {
		if (redirectToQuery) {
			// return <Redirect to={redirectToQuery} />;
			// history.push(redirectToQuery);
			console.log('Done loading, redirecting');
			// window.close();
			if ((window as any).webkit) {
				// eslint-disable-next-line @typescript-eslint/camelcase
				(window as any).webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify({ my_message: 'close' }));
			}
		} else {
			return <Redirect to="/create" />;
		}
	}

	//firestore.collection('users').doc(user.user.uid).collection('sheets').

	if (picked) {
		console.log('picked', picked);

		const doc = firestore.collection('users').doc(firebase.auth().currentUser.uid).collection('sheets');

		const proms = [];
		picked
			// .map((v: any) => ({ id: v.id, name: v.name }))
			.forEach((data: any) => {
				analytics.logEvent('new_sheet', {
					name: data.name,
					id: data.id,
				});
				proms.push(doc.doc(data.id).set({ name: data.name, done: [] }));
			});

		console.log(proms);

		Promise.all(proms)
			.then(() => {
				console.log('Done Loading');
				setDoneLoading(true);
			})
			.catch((err: any) => {
				analytics.logEvent('exception', {
					description: err,
					fatal: false,
				});
				setErrors(err);
			});

		return <Loading>Creating flashcards</Loading>;
	}

	const onPick = (ev: any): void => {
		console.log(ev);
		setPicked(ev);
		setForceReload(forceReload + 1);
	};

	const onError = (err: any): void => {
		console.log(err);
		if (redirectToQuery && (window as any).webkit) {
			// eslint-disable-next-line @typescript-eslint/camelcase
			(window as any).webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify({ my_message: 'close' }));
		} else if (err.action === google.picker.Action.CANCEL) {
			setErrors('You did not select anything!');
		} else {
			analytics.logEvent('exception', { description: err, fatal: true });
			console.error('Something went really wrong!', err);
			setErrors(<pre>{JSON.stringify(err, null, 4)}</pre>);
		}
	};

	return (
		<div className="create-page">
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton icon={arrowBack} defaultHref="select" />
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			{/* <IonContent > */}
			<IonItem>
				<GooglePicker
					exclude={sSheets}
					onPick={onPick}
					onError={onError}
					autoOpen={!picked && !errors && !props.disableAutoOpen && !isPlatform('mobile')}
				/>
			</IonItem>
			{errors && <IonItem color="danger">{JSON.stringify(errors)}</IonItem>}
			{/* </IonContent> */}
		</div>
	);
};
