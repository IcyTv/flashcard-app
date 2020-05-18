import { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from '@firebase/firestore-types';
import { Network } from '@ionic-native/network';
import { ActionSheetButton } from '@ionic/core';
import { IonActionSheet, IonButton, IonContent, IonIcon, IonItem, IonList, IonSpinner, IonText } from '@ionic/react';
import {
	arrowDown,
	closeOutline,
	ellipsisVertical,
	pencilOutline,
	remove,
	trashOutline,
	cashOutline,
} from 'ionicons/icons';
import sizeof from 'object-sizeof';
import 'rc-tooltip/assets/bootstrap_white.css';
import React, { useEffect, useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { Redirect } from 'react-router-dom';
import { Loading } from '../../components/Loading/Loading';
import { downloadSpreadsheet } from '../../services/download';
import { analytics } from '../../services/firebase';
import { refreshToken, wait } from '../../services/firebase/auth';
import { deleteSavedStore } from '../../services/store/downloader';
import { refreshAccess } from '../../services/store/google';
import './SelectSheet.scss';
import { useNetwork } from '../../services/network';
import { saveNamesStore } from '../../services/store/savedSheets';

const openInNewTab = (url: string): void => {
	window.open(url, '_blank');
};

function formatBytes(a, b = 2): string {
	if (0 === a) return '0 Bytes';
	const c = 0 > b ? 0 : b,
		d = Math.floor(Math.log(a) / Math.log(1024));
	return (
		parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
		' ' +
		['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]
	);
}

export const SelectSheet: React.FC = () => {
	const [sheets, setSheets] = useState<{ id: string; name: string }[]>(null);
	const [selectedSheet, setSelected] = useState<{
		id: string;
		name: string;
	}>();
	const [selectedActionSheet, setActionSheet] = useState(-1);

	const firebase = useFirebase();
	const firestore = useFirestore();
	const store = useStore();

	const [redirectTo, setRedirectTo] = useState('');

	const uid = useSelector((state: ReduxState) => state.firebase.auth.uid);
	const googleAccess = useSelector((state: ReduxState) => state.google);

	const [downloading, setDownloading] = useState<string>(null);

	const dlSheets = useSelector((state: ReduxState) => state.download);

	const downloaded = Object.keys(dlSheets).filter((v) => v !== '_persist');

	const [refresh, setRefresh] = useState(null);
	const [isAuth, setIsAuth] = useState(false);

	const [forceReload, setForceReload] = useState(false);

	const online = useNetwork();

	useEffect(() => wait(firebase, setIsAuth), []);
	useEffect(() => {
		analytics.setCurrentScreen('select_sheet');
	}, []);

	useEffect(() => {
		if (downloaded.indexOf(downloading) >= 0) {
			setDownloading(null);
		}
	}, [downloaded]);

	if (!isAuth) {
		return <Loading>Loading authentication</Loading>;
	}

	if (googleAccess.expiresIn - Date.now() < 0) {
		console.log('Refreshing');
		refreshToken(googleAccess.tokenId, setRefresh);
	}

	analytics.setUserId(firebase.auth().currentUser.uid);

	if (refresh) {
		refreshAccess(store)(refresh);
		setRefresh(null);
		return <Loading>Refreshing access</Loading>;
	}

	if (redirectTo !== '') {
		return <Redirect to={redirectTo} push />;
	}

	if (!online && downloaded.length === 0) {
		return (
			<IonContent>
				<IonText color="danger" style={{ wordWrap: 'break-word' }}>
					You are offline and don&apos;t have any sheets downloaded. To use this in offline mode, please go
					online and download some sheets
				</IonText>
			</IonContent>
		);
	}

	if (sheets == undefined || sheets == null) {
		console.log('loading sheets');
		if (!online) {
			if (downloaded.length === 0) {
				return <p>No downloads</p>;
			} else {
				const tmp = [];
				downloaded.forEach((v, i) => {
					const t = dlSheets[v];
					tmp.push({ id: v, name: t.name });
				});
				setSheets(tmp || []);
				setForceReload(!forceReload);
			}
		} else {
			firestore
				.collection('users')
				.doc(uid)
				.collection('sheets')
				.get()
				.then((data: QuerySnapshot<DocumentData>) => {
					const tmp = [];
					data.forEach((d: QueryDocumentSnapshot<DocumentData>): void => {
						tmp.push({ id: d.id, name: d.data().name });
					});
					setSheets(tmp);
					saveNamesStore(
						store,
						tmp.map((v) => v.name),
					);
				});
		}
		return <Loading>Loading from database</Loading>;
	}

	if (selectedSheet) {
		return <Redirect to={{ pathname: '/flashcard', state: selectedSheet }} push />;
	}

	const onClick = (id: string, name: string) => (): void => {
		setSelected({
			id: id,
			name: name,
		});
	};

	const onDelete = (id: string, name: string, index: number): void => {
		// database.ref("/user/" + uid + "/sheets/" + id).remove();
		firestore.collection('users').doc(uid).collection('sheets').doc(id).delete();
		const tmp = sheets.slice();
		tmp.splice(index, 1);
		console.log(tmp.length);
		setActionSheet(-1);
		setSheets(tmp);
		saveNamesStore(
			store,
			tmp.map((v) => v.name),
		);
	};

	const actionHandler = (id: string, index: number, action: string) => (): void => {
		switch (action) {
			case 'delete':
				onDelete(id, '', index);
				break;
			case 'edit':
				openInNewTab('https://docs.google.com/spreadsheets/d/' + id);
				break;
			case 'download':
				setDownloading(id);
				downloadSpreadsheet(id, googleAccess.accessToken, store);
				break;
			case 'deleteSaved':
				deleteSavedStore(store)(id);
				break;
			case 'pay':
				setRedirectTo('/payment');
				break;
			default:
				break;
		}
	};

	return (
		<IonContent key={'sheet-list-length-' + sheets.length}>
			<IonList className="sheet-list" lines="full">
				{sheets.map(
					(
						v: {
							id: string;
							name: string;
						},
						i: number,
					) => {
						const isDownloaded = downloaded.indexOf(v.id) >= 0;
						const dlBtn: ActionSheetButton = isDownloaded
							? {
									cssClass: 'download',
									text: 'Remove saved',
									icon: remove,
									handler: actionHandler(v.id, i, 'deleteSaved'),
							  }
							: downloaded.length < 2
							? {
									text: 'Download',
									icon: arrowDown,
									handler: actionHandler(v.id, i, 'download'),
									cssClass: 'download',
							  }
							: {
									cssClass: 'download',
									text: 'Download limit reached',
									icon: cashOutline,
									handler: actionHandler(v.id, i, 'pay'),
							  };
						return (
							<IonItem key={'parsed-' + v.id}>
								<IonButton onClick={onClick(v.id, v.name)} className="list-item-sheet">
									<p>{v.name}</p> {downloading === v.id && <IonSpinner name="crescent" />}
									{downloaded.indexOf(v.id) >= 0 && [
										<IonIcon icon={arrowDown} color="primary" key={v.id + '-dl'} />,
										formatBytes(sizeof(dlSheets[v.id])),
									]}
								</IonButton>
								<IonButton onClick={(): void => setActionSheet(i)} className="more-options">
									<IonIcon icon={ellipsisVertical} />
								</IonButton>
								<IonActionSheet
									isOpen={selectedActionSheet === i}
									animated
									onDidDismiss={(): void => setActionSheet(-1)}
									header="More options"
									cssClass="action-sheets-more-options"
									buttons={[
										{
											text: 'Delete',
											icon: trashOutline,
											role: 'destructive',
											handler: actionHandler(v.id, i, 'delete'),
											cssClass: 'delete',
										},
										{
											text: 'Edit',
											icon: pencilOutline,
											handler: actionHandler(v.id, i, 'edit'),
											cssClass: 'edit',
										},
										dlBtn,
										{
											text: 'Cancel',
											icon: closeOutline,
											role: 'cancel',
										},
									]}
								/>
							</IonItem>
						);
					},
				)}
			</IonList>
			{online && (
				<IonButton onClick={(): void => setRedirectTo('/create')} className="new-sheet">
					Add new sheet
				</IonButton>
			)}
		</IonContent>
	);
};
