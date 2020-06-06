/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IonContent, IonTitle } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { Redirect } from 'react-router';
import { analytics } from '../../services/firebase';
import { setAuth } from '../../services/store/google';
import './Logout.scss';

export const Logout: React.FC = () => {
	const [redirect, setRedirect] = useState(false);
	const [errors, setErrors] = useState<any>();
	const store = useStore();
	const firebase = useFirebase();

	useEffect(() => {
		analytics.setCurrentScreen('create_screen');
		firebase
			.auth()
			.signOut()
			.then(() => {
				setAuth(store)(null);
				setRedirect(true);
			})
			.catch((err) => {
				setErrors(err);
			});
	}, [firebase, store]);

	if (redirect) {
		return <Redirect to="/login" />;
	}

	if (errors) {
		return (
			<IonContent>
				<IonTitle color="danger">{'' + errors}</IonTitle>
			</IonContent>
		);
	}
	return <IonContent></IonContent>;
};
