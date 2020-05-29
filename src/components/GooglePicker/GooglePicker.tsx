/* eslint-disable @typescript-eslint/no-explicit-any */
import { IonButton, isPlatform } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { wait, refreshToken } from '../../services/firebase/auth';
import config from '../../services/googleapis_config.json';
import { Loading } from '../Loading/Loading';
import './GooglePicker.scss';
import { refreshAccess } from '../../services/store/google';
import { analytics } from '../../services/firebase';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { parse } from 'query-string';
import { useLocation } from 'react-router';

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
	const [loaded, setLoaded] = useState(false);
	const [pickerLoaded, setPickerLoaded] = useState(false);
	const firebase = useFirebase();
	const [isAuth, setIsAuth] = useState(false);
	const store = useStore();
	const auth = useSelector((state: ReduxState) => state.google);

	const location = useLocation();

	const parsed = parse(location.search);

	let oauthToken = null;

	if (parsed.oauthToken) {
		oauthToken = atob(parsed.oauthToken as string);
	}

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

	if (auth.expiresIn - Date.now() < 0) {
		console.log('Picker refresh');
		refreshToken(auth.tokenId, store);
		return <Loading>Refreshing access to google</Loading>;
	}

	console.log('picker gaccess', auth);

	if (!isAuth && !oauthToken) {
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
		} else if (ev.action === 'loaded') {
			console.log('Loaded');
		} else {
			console.error(ev);
			analytics.logEvent('exception', {
				description: ev,
				fatal: true,
			});
		}
	};

	console.log('Oauth', oauthToken);

	const pickerBuilder = new google.picker.PickerBuilder()
		.setCallback(pickerCallback)
		// .setAppId(145284732434 + '')
		.setAppId(config.web.client_id)
		.setTitle('Select your spreadsheet')
		.setDeveloperKey('AIzaSyAL67LyqvrD7jaf278aS4fluD_vzaq4vVM')
		.setOrigin(window.location.protocol + '//' + window.location.host)
		.addView(view)
		.enableFeature(google.picker.Feature.NAV_HIDDEN)
		.enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
		.enableFeature(google.picker.Feature.SUPPORT_TEAM_DRIVES);

	if (oauthToken) {
		console.log('Setting token from query param', oauthToken);
		pickerBuilder.setOAuthToken(oauthToken);
	} else {
		pickerBuilder.setOAuthToken(auth.accessToken);
	}

	if (window.matchMedia('(max-width: 600px)').matches) {
		pickerBuilder.setSize(window.innerWidth, window.innerHeight);
	}

	const picker = pickerBuilder.build();

	if ((props.autoOpen && auth.expiresIn - Date.now() > 0) || oauthToken) {
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
