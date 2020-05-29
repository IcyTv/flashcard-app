import { ExtendedFirebaseInstance, ExtendedAuthInstance, ExtendedStorageInstance } from 'react-redux-firebase';
import { analytics } from './index';
import { AnyAction, Store } from 'redux';
import { setAuth, refreshAccess, idTokenRefresh } from '../store/google';
import IdTokenVer from 'idtoken-verifier';

const verifier = new IdTokenVer({
	issuer: 'https://accounts.google.com',
});

const url = 'https://flashcards.icytv.de/api/refresh?token=';
//'https://us-central1-flashcards-1588528687957.cloudfunctions.net/googleAuth/refresh?token=';
// "http://localhost:5001/flashcards-1588528687957/europe-west1/googleAuth/refresh?token=";

export const wait = (
	firebase: ExtendedFirebaseInstance & ExtendedAuthInstance & ExtendedStorageInstance,
	stateFunc: React.Dispatch<React.SetStateAction<boolean>>,
): void => {
	firebase.auth().onAuthStateChanged((user: firebase.User) => {
		console.log('Auth state changed');
		if (user) {
			stateFunc(true);
		}
	});
	return undefined;
};

export const refreshToken = async (
	idToken: string,
	store: Store<ReduxState, AnyAction>,
	errFunc?: React.Dispatch<React.SetStateAction<string>>,
): Promise<void> => {
	fetch(url + idToken)
		.then((data: Response) => data.json())
		.then((data: { id_token: string; access_token: string }) => {
			idTokenRefresh(store)(data.id_token);
			refreshAccess(store)(data.access_token);
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.catch((err: any) => {
			console.error(err);
			debugger;
			analytics.logEvent('exception', {
				description: 'Error while refreshing ' + err.message,
			});
			if (errFunc) {
				errFunc(err);
			}
		});
};

export const logout = async (
	firebase: ExtendedFirebaseInstance & ExtendedAuthInstance & ExtendedStorageInstance,
	store: Store<ReduxState, AnyAction>,
): Promise<void> => {
	setAuth(store)(null);
	await firebase.auth().signOut();
};

export const isExpired = (idToken: string): boolean => {
	const jwt = verifier.decode(idToken);
	const exp = new Date(parseInt(jwt.exp));
	return Date.now() - exp.getTime() < 0;
};
