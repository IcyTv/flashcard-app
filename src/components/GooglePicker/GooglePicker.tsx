/* eslint-disable @typescript-eslint/no-explicit-any */
import { IonButton, isPlatform } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { wait } from '../../services/firebase/auth';
import config from '../../services/googleapis_config.json';
import { Loading } from '../Loading/Loading';
import './GooglePicker.scss';

interface GooglePickerProps {
	onPick: (ev: any) => void;
	onError: (err: any) => void;
	onLoad?: () => void;
	autoOpen?: boolean;
	children?: JSX.Element;
	exclude?: string[];
}
/**
 *	Google Picker component
 *
 * Be careful when adding onClick events to children, they will be overridden
 *
 * @param props
 */
export const GooglePicker: React.FC<GooglePickerProps> = (props: GooglePickerProps) => {
	const auth = useSelector((state: ReduxState) => state.google);
	const [loaded, setLoaded] = useState(false);
	const [pickerLoaded, setPickerLoaded] = useState(false);
	const firebase = useFirebase();
	const [isAuth, setIsAuth] = useState(false);

	useEffect(() => {
		if (gapi) {
			setLoaded(true);
		} else {
			const gapiScript = document.getElementById('gapi');
			gapiScript.nonce = '' + Math.random() * 100000;
			gapiScript.addEventListener('load', () => setLoaded(true));
		}
		wait(firebase, setIsAuth);
	}, []);

	if (!isAuth) {
		return <Loading>Loading authentication</Loading>;
	}

	if (loaded && !pickerLoaded) {
		if (props.onLoad) {
			props.onLoad();
		}
		// gapi.load("auth2", () => console.log("loaded"));
		// gapi.load("auth", () => console.log("loaded"));
		gapi.load('picker', () => setPickerLoaded(true));
	}

	if (!loaded || !pickerLoaded) {
		return <Loading>Loading scripts</Loading>;
	}

	const view: any = new google.picker.DocsView(google.picker.ViewId.SPREADSHEETS);
	view.setMimeTypes('application/vnd.google-apps.spreadsheet'); //ANCHOR google sheets cannot work with xls etc
	if (props.exclude) {
		view.setQuery(props.exclude.map((v) => '-title:"' + v + '"').join(' '));
	}

	const pickerCallback = (ev: any): void => {
		if (ev.action === 'picked') {
			props.onPick(ev.docs);
		} else if (ev.action === 'cancel') {
			props.onError(ev.driveError || ev);
		} else {
			console.log(ev);
		}
	};

	const pickerBuilder = new google.picker.PickerBuilder()
		.setCallback(pickerCallback)
		.setAppId(config.web.client_id)
		.setTitle('Select your spreadsheet')
		.setDeveloperKey('AIzaSyAL67LyqvrD7jaf278aS4fluD_vzaq4vVM')
		.addView(view)
		.setOrigin(window.location.protocol + '//' + window.location.host)
		.enableFeature(google.picker.Feature.NAV_HIDDEN)
		.enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
		.enableFeature(google.picker.Feature.SUPPORT_TEAM_DRIVES)
		.setOAuthToken(auth.accessToken);

	if (isPlatform('mobile')) {
		pickerBuilder.setSize(window.innerWidth, window.innerHeight);
	}

	const picker = pickerBuilder.build();

	if (props.autoOpen) {
		picker.setVisible(true);
	}

	return (
		<div>
			{(props.children &&
				React.cloneElement(props.children as any, {
					onClick: () => picker.setVisible(true),
				})) || <IonButton onClick={(): unknown => picker.setVisible(true)}>Select a document</IonButton>}
		</div>
	);
};
