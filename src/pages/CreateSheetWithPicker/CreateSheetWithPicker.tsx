/* eslint-disable @typescript-eslint/no-explicit-any */
import { IonBackButton, IonButtons, IonHeader, IonItem, IonToolbar } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { Redirect } from 'react-router';
import GooglePicker from '../../components/GooglePicker';
import { Loading } from '../../components/Loading/Loading';
import './CreateSheetWithPicker.scss';
import { analytics } from '../../services/firebase';
import { isExpired, wait, refreshToken } from '../../services/firebase/auth';
import { useSelector, useStore } from 'react-redux';
import { refreshAccess } from '../../services/store/google';

interface CreateSheetWithPickerProps {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CreateSheetWithPicker: React.FC<CreateSheetWithPickerProps> = (_props: CreateSheetWithPickerProps) => {
	const [picked, setPicked] = useState(null);
	const [errors, setErrors] = useState(null);
	const [doneLoading, setDoneLoading] = useState(false);
	const [forceReload, setForceReload] = useState(0);

	const store = useStore();
	const firestore = useFirestore();
	const firebase = useFirebase();

	const googleAcccess = useSelector((state: ReduxState) => state.google);
	const sSheets = useSelector((state: ReduxState) => state.savedSheets.names);

	const [isLoaded, setLoaded] = useState(false);
	const [refresh, setRefresh] = useState(null);
	const [isAuth, setIsAuth] = useState(false);

	useEffect(() => wait(firebase, setIsAuth), []);

	useEffect(() => {
		analytics.setCurrentScreen('create_screen');
	}, []);

	firebase.auth().onAuthStateChanged(() => {
		setLoaded(true);
	});

	if (!isLoaded || !isAuth) {
		return <Loading>Waiting for storage</Loading>;
	}

	if (refresh) {
		refreshAccess(store)(refresh);
		setRefresh(null);
	}

	if (isExpired(googleAcccess.tokenId)) {
		refreshToken(googleAcccess.tokenId, setRefresh);
		return <Loading>Refreshing access to google</Loading>;
	}

	if (doneLoading) {
		return <Redirect to="/select" />;
	}

	//firestore.collection("users").doc(user.user.uid).collection("sheets").

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
		if (err.action === google.picker.Action.CANCEL) {
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
				<GooglePicker exclude={sSheets} onPick={onPick} onError={onError} autoOpen={!picked && !errors} />
			</IonItem>
			{errors && <IonItem color="danger">{errors}</IonItem>}
			{/* </IonContent> */}
		</div>
	);
};
