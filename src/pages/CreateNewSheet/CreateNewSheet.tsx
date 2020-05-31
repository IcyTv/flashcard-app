/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState, useRef } from 'react';
import {
	IonContent,
	IonIcon,
	IonButton,
	IonText,
	IonCard,
	IonCardHeader,
	IonTitle,
	IonCardContent,
	IonModal,
	IonInput,
	IonCheckbox,
	IonLabel,
	isPlatform,
} from '@ionic/react';
import './CreateNewSheet.scss';
import { Redirect, useHistory } from 'react-router-dom';
import Loading from '../../components/Loading';
import { useSelector, useStore } from 'react-redux';
import config from '../../services/googleapis_config.json';
import { AnyAction } from 'redux';
import { refreshToken } from '../../services/firebase/auth';
import { Plugins } from '@capacitor/core';
const { Browser } = Plugins;

interface CreateNewSheetProps {}

const createSheet = (
	accessToken: string,
	name: string,
	columnCount?: number,
	loadingFunc?: React.Dispatch<boolean>,
	successFunc?: React.Dispatch<string>,
): Promise<gapi.client.sheets.Spreadsheet> => {
	if (loadingFunc) {
		loadingFunc(true);
	}
	return gapi.client.sheets.spreadsheets
		.create(
			{
				access_token: accessToken,
			},
			{
				properties: {
					title: name,
				},
			},
		)
		.then((v) => {
			return gapi.client.sheets.spreadsheets.batchUpdate(
				{
					access_token: accessToken,
					spreadsheetId: v.result.spreadsheetId,
				},
				{
					includeSpreadsheetInResponse: true, // For now, later, edit rows?
					requests: [
						{
							deleteDimension: {
								range: {
									dimension: 'COLUMNS',
									startIndex: columnCount || 2,
								},
							},
						},
					],
				},
			);
		})
		.then((v) => {
			console.log(v);
			if (successFunc) {
				successFunc('Created sheet with ' + columnCount + ' columns!');
			}
			if (loadingFunc) {
				loadingFunc(false);
			}
			return new Promise((resolve, reject) => {
				resolve(v.result);
			});
		})
		.catch(console.error);
};

const openInNewTab = (url: string): void => {
	if (isPlatform('mobile')) {
		Browser.open({ url: url });
	} else {
		window.open(url, '_blank');
	}
};

const url = 'https://docs.google.com/spreadsheets/u/0/create';

export const CreateNewSheet: React.FC<CreateNewSheetProps> = (props) => {
	const [loaded, setLoaded] = useState(false);
	const gAuth = useSelector((state: ReduxState) => state.google);
	const store = useStore<ReduxState, AnyAction>();
	const [refreshErr, setRefreshErr] = useState(null);
	const [success, setSuccess] = useState(null);
	const [createLoading, setCreateLoading] = useState(false);
	const [showModal, setShowModal] = useState(0);
	const nameRef = useRef<HTMLIonInputElement>();
	const openAfterRef = useRef<HTMLIonCheckboxElement>();
	// const history = useHistory();
	// history.push(url);
	// useEffect(() => {
	// 	window.location.href = url;
	// }, []);

	useEffect(() => {
		if (!loaded) {
			gapi.load('client', () => gapi.client.load('sheets', 'v4').then(() => setLoaded(true)));
		}
	}, [loaded]);

	useEffect(() => {
		if (gAuth.expiresIn - Date.now() < 0) {
			refreshToken(gAuth.tokenId, store, setRefreshErr);
		}
	}, [store, gAuth]);

	useEffect(() => {
		if (loaded) {
			gapi.client.init({
				apiKey: 'AIzaSyBAWi-x21jtCAUbXEwAaGHqs0XbGEpjgTg',
				clientId: config.web.client_id,
				scope: 'https://www.googleapis.com/auth/drive.file',
			});
			gapi.client.setToken({ access_token: gAuth.accessToken });
			console.log('Set token');
		}
	}, [gAuth, loaded]);

	if (!loaded) {
		return <Loading>Loading scripts</Loading>;
	}

	if (createLoading) {
		return <Loading>Creating sheet</Loading>;
	}

	if (refreshErr) {
		return (
			<IonContent>
				<IonText color="danger">
					<pre>{'' + refreshErr}</pre>
				</IonText>
			</IonContent>
		);
	}

	const onClick = (columnCount: number) => (): void => {
		// createSheet(gAuth.accessToken, 2, setCreateLoading, setSuccess);
		setShowModal(columnCount);
	};

	const onIonModal = (type: string) => () => {
		if (type === 'okay') {
			const checked = openAfterRef.current.checked;
			createSheet(
				gAuth.accessToken,
				nameRef.current.value as string,
				showModal,
				setCreateLoading,
				setSuccess,
			).then((v) => {
				if (checked) {
					openInNewTab(`https://docs.google.com/spreadsheets/d/${v.spreadsheetId}/edit`);
				}
			});

			setShowModal(0);
		} else {
			setShowModal(0);
		}
	};

	// return <Redirect to="/create" />;
	// return <Redirect to="https://docs.google.com/spreadsheets/u/0/create" />;
	return (
		<IonContent>
			<IonModal isOpen={showModal !== 0}>
				<IonTitle>New Sheet</IonTitle>
				<IonInput type="text" placeholder="name" ref={nameRef} />
				<IonCheckbox checked ref={openAfterRef} id="open-after-checkbox" />
				<IonLabel>Edit after creation?</IonLabel>
				<IonButton onClick={onIonModal('okay')}>Okay</IonButton>
				<IonButton onClick={onIonModal('cancel')}>Cancel</IonButton>
			</IonModal>
			<IonCard>
				<IonCardHeader>
					<IonTitle>New Sheet</IonTitle>
				</IonCardHeader>
				<IonCardContent>
					<IonButton onClick={onClick(2)}>Simple</IonButton>
					<IonButton onClick={onClick(10)}>Advanced</IonButton>
					{success && <IonText color="success">{success}</IonText>}
				</IonCardContent>
			</IonCard>
		</IonContent>
	);
};
