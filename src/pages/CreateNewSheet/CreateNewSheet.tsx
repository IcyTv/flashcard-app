/* eslint-disable @typescript-eslint/camelcase */
import { Plugins } from '@capacitor/core';
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCheckbox,
	IonContent,
	IonInput,
	IonLabel,
	IonModal,
	IonText,
	IonTitle,
	isPlatform,
} from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';
import Loading from '../../components/Loading';
import config from '../../services/googleapis_config.json';
import './CreateNewSheet.scss';
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
			return new Promise((resolve) => {
				resolve(v.result);
			});
		})
		.catch(console.error);
};

const openInNewTab = (url: string): void => {
	if (isPlatform('cordova') || isPlatform('capacitor')) {
		Browser.open({ url: url });
	} else {
		window.open(url, '_blank');
	}
};

// const url = 'https://docs.google.com/spreadsheets/u/0/create';

export const CreateNewSheet: React.FC<CreateNewSheetProps> = () => {
	const [loaded, setLoaded] = useState(false);
	const gAuth = useSelector((state: ReduxState) => state.google);
	const uid = useSelector((state: ReduxState) => state.firebase.auth.uid);
	const [success, setSuccess] = useState(null);
	const [createLoading, setCreateLoading] = useState(false);
	const [showModal, setShowModal] = useState(0);
	const nameRef = useRef<HTMLIonInputElement>();
	const openAfterRef = useRef<HTMLIonCheckboxElement>();
	const firestore = useFirestore();
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

	// useEffect(() => {
	// 	if (gAuth.expiresIn - Date.now() < 0) {
	// 		refreshToken(gAuth.tokenId, store, setRefreshErr);
	// 	}
	// }, [gAuth]);

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

	const onClick = (columnCount: number) => (): void => {
		// createSheet(gAuth.accessToken, 2, setCreateLoading, setSuccess);
		setShowModal(columnCount);
	};

	const onIonModal = (type: string) => (): void => {
		if (type === 'okay') {
			const checked = openAfterRef.current.checked;
			const name = nameRef.current.value as string;
			createSheet(gAuth.accessToken, name, showModal, setCreateLoading, setSuccess).then((v) => {
				if (checked) {
					openInNewTab(`https://docs.google.com/spreadsheets/d/${v.spreadsheetId}/edit`);
				}
				if (!uid) {
					console.error('UID not found');
					return;
				}
				const doc = firestore.collection('users').doc(uid).collection('sheets');
				doc.doc(v.spreadsheetId).set({
					name: name,
					done: [],
				});
			});

			setShowModal(0);
		} else {
			setShowModal(0);
		}
	};

	// return <Redirect to="/create" />;
	// return <Redirect to="https://docs.google.com/spreadsheets/u/0/create" />;
	return (
		<IonContent className="create-new-sheet-content">
			<IonModal isOpen={showModal !== 0} cssClass="new-sheet-modal" onDidDismiss={(): void => setShowModal(0)}>
				<IonTitle>New Sheet</IonTitle>
				<div className="name-input-container">
					<IonLabel className="name-label" position="stacked">
						Name
					</IonLabel>
					<IonInput type="text" placeholder="Exaple Name" ref={nameRef} maxlength={22} />
				</div>
				<div className="checkbox-container">
					<IonCheckbox checked ref={openAfterRef} id="open-after-checkbox" />
					<IonLabel>Edit after creation?</IonLabel>
				</div>
				<div className="btn-container">
					<IonButton onClick={onIonModal('okay')}>Okay</IonButton>
					<IonButton onClick={onIonModal('cancel')}>Cancel</IonButton>
				</div>
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
