import { Plugins } from '@capacitor/core';
import { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from '@firebase/firestore-types';
import { ActionSheetButton, isPlatform, RefresherEventDetail } from '@ionic/core';
import {
	IonActionSheet,
	IonButton,
	IonContent,
	IonIcon,
	IonItem,
	IonList,
	IonRefresher,
	IonRefresherContent,
	IonSpinner,
	IonText,
} from '@ionic/react';
import {
	arrowDown,
	cashOutline,
	closeOutline,
	ellipsisVertical,
	pencilOutline,
	remove,
	trashOutline,
	settingsOutline,
} from 'ionicons/icons';
import sizeof from 'object-sizeof';
import 'rc-tooltip/assets/bootstrap_white.css';
import React, { useEffect, useState } from 'react';
import { Flip, Zoom } from 'react-awesome-reveal';
import { useSelector, useStore } from 'react-redux';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { Redirect, useHistory } from 'react-router-dom';
import { AnyAction } from 'redux';
import { downloadSpreadsheet } from '../../services/download';
import { analytics } from '../../services/firebase';
import { refreshToken, wait } from '../../services/firebase/auth';
import { useNetwork } from '../../services/network';
import { setFirstTime } from '../../services/store/debug';
import { deleteSavedStore } from '../../services/store/downloader';
import { saveNamesStore } from '../../services/store/savedSheets';
import Hammer from 'hammerjs';
import './SelectSheet.scss';
import WorksheetSelect from '../../components/WorksheetSelect';
import SheetPropsSelector from '../../components/SheetPropsSelector';
import { GoogleSpreadsheet } from 'google-spreadsheet';

const { Browser } = Plugins;

// import { Loading } from '../../components/Loading/Loading';
const Loading = React.lazy(() => import('../../components/Loading'));

const openInNewTab = (url: string): void => {
	if (isPlatform('mobile')) {
		console.log('HERE');
		Browser.open({ url: url });
	} else {
		window.open(url, '_blank');
	}
};

const edit = (id: string): void => {
	openInNewTab('https://docs.google.com/spreadsheets/d/' + id);
};

function formatBytes(a: number, b = 2): string {
	if (0 === a) return '0 Bytes';
	const c = 0 > b ? 0 : b,
		d = Math.floor(Math.log(a) / Math.log(1024));
	return (
		parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
		' ' +
		['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]
	);
}

interface SelectSheetProps {
	className?: string;
	hidden?: boolean;
	predefinedSheets?: {
		name: string;
		id?: string;
	}[];
}

export const SelectSheet: React.FC<SelectSheetProps> = (props: SelectSheetProps) => {
	const [sheets, setSheets] = useState<{ id: string; name: string }[]>(null);
	const [action, setAction] = useState(null);
	const [selectedSheet, setSelected] = useState<{
		id: string;
		name: string;
	}>();
	const [selectedActionSheet, setActionSheet] = useState(-1);

	const firebase = useFirebase();
	const firestore = useFirestore();
	const store = useStore<ReduxState, AnyAction>();

	const [redirectTo, setRedirectTo] = useState('');

	const uid = useSelector((state: ReduxState) => state.firebase.auth.uid);
	const googleAccess = useSelector((state: ReduxState) => state.google);

	const [downloading, setDownloading] = useState<string>(null);

	const dlSheets = useSelector((state: ReduxState) => state.download);

	const downloaded = Object.keys(dlSheets).filter((v) => v !== '_persist');

	const [isAuth, setIsAuth] = useState(false);

	const [forceReload, setForceReload] = useState(false);
	const [hammer, setHammer] = useState(false);

	const [worksheetSelectIsOpen, setWorksheetSelectOpen] = useState<string>(null);
	const [isSettings, setIsSettings] = useState(false);
	const [worksheetIndex, setWorksheetIndex] = useState(-1);
	const [spreadsheet, setSpreadsheet] = useState<GoogleSpreadsheet>(null);

	const online = useNetwork();
	const history = useHistory();

	useEffect(() => {
		if (store.getState().debug.firstTime) {
			setFirstTime(store)(false);
			history.push('/joyride');
		}
	}, [store, history]);

	useEffect(() => {
		setSheets(null);
	}, [online]);

	useEffect(() => {
		if (action && sheets) {
			action.detail.complete();
			setAction(null);
		}
	}, [action, sheets]);

	useEffect(() => wait(firebase, setIsAuth), []);
	useEffect(() => {
		analytics.setCurrentScreen('select_sheet');
	}, [firebase]);

	useEffect(() => {
		if (downloaded.indexOf(downloading) >= 0) {
			setDownloading(null);
		}
	}, [downloaded]);

	useEffect(() => {
		if (googleAccess.expiresIn - Date.now() < 0) {
			refreshToken(googleAccess.tokenId, store);
			setForceReload(!forceReload);
		}
	}, [store, googleAccess]);

	useEffect(() => {
		const sIList = document.getElementsByClassName('sheet-list-item');
		for (let n = 0; n < sIList.length; n++) {
			new Hammer(sIList.item(n) as HTMLElement).on('press', (ev) => {
				setHammer(true);
				setActionSheet(n);
				ev.preventDefault();
			});
		}
	});

	//TODO Refresher

	if (!isAuth) {
		return <Loading>Loading authentication</Loading>;
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

	if (sheets === undefined || sheets === null) {
		console.log('loading sheets');
		if (props.predefinedSheets) {
			const tmp = [];
			props.predefinedSheets.forEach((v) => {
				tmp.push({ id: v.id, name: v.name });
			});
			setSheets(tmp);
			setForceReload(!forceReload);
		} else if (!online) {
			if (downloaded.length === 0) {
				return <p>No downloads</p>;
			} else {
				const tmp = [];
				downloaded.forEach((v) => {
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
		if (!hammer) {
			// setSelected({
			// 	id: id,
			// 	name: name,
			// });
			setWorksheetSelectOpen(id);
		} else {
			setHammer(false);
		}
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

	const doSettings = (id: string): void => {
		console.log('Opening props for ' + id);
		setWorksheetSelectOpen(id);
		setIsSettings(true);
	};

	const onSelect = (index: number): void => {
		console.log(index);
		setWorksheetIndex(index);
		if (!isSettings) {
			history.push('/flashcard', {
				id: worksheetSelectIsOpen,
				worksheetIndex: index,
			});
		}
	};

	const afterSave = (): void => {
		setWorksheetIndex(-1);
		setIsSettings(false);
		setSpreadsheet(null);
		setWorksheetSelectOpen('');
	};

	const onSpreadsheetLoad = (spreadsheet: GoogleSpreadsheet): void => {
		setSpreadsheet(spreadsheet);
	};

	const actionHandler = (id: string, index: number, action: string) => (): void => {
		switch (action) {
			case 'delete':
				onDelete(id, '', index);
				break;
			case 'edit':
				edit(id);
				break;
			case 'download':
				setDownloading(id);
				downloadSpreadsheet(id, googleAccess.accessToken, store);
				break;
			case 'deleteSaved':
				deleteSavedStore(store)(id);
				break;
			case 'settings':
				doSettings(id);
				break;
			case 'pay':
				setRedirectTo('/payment');
				break;
			default:
				break;
		}
	};

	const onRefresh = (ev: CustomEvent<RefresherEventDetail>): void => {
		setSheets(null);
		setAction(ev);
	};

	const onDismissWorksheet = (): void => {
		setWorksheetSelectOpen('');
		setWorksheetIndex(-1);
		setIsSettings(false);
		setSpreadsheet(null);
	};

	const onDismiss = (): void => {
		setWorksheetIndex(-1);
	};

	const onBack = (ev: React.MouseEvent<HTMLIonButtonElement, MouseEvent>): void => {
		setWorksheetIndex(-1);
	};

	return (
		<IonContent key={'sheet-list-length-' + sheets.length} hidden={props.hidden} className={props.className}>
			<WorksheetSelect
				isOpen={!!worksheetSelectIsOpen}
				onSelect={onSelect}
				id={worksheetSelectIsOpen}
				onSpreadsheetLoad={onSpreadsheetLoad}
				onDismiss={onDismissWorksheet}
			/>
			<SheetPropsSelector
				isOpen={isSettings && worksheetIndex !== -1 && !!spreadsheet}
				worksheetIndex={worksheetIndex}
				spreadsheet={spreadsheet}
				afterSave={afterSave}
				onDismiss={onDismiss}
				onBack={onBack}
			/>
			<IonRefresher slot="fixed" onIonRefresh={onRefresh}>
				<IonRefresherContent refreshingSpinner="crescent"></IonRefresherContent>
			</IonRefresher>
			<IonList className="sheet-list" lines="full">
				<Flip cascade>
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
							const buttons = [];
							buttons.push({
								text: 'Settings',
								icon: settingsOutline,
								handler: actionHandler(v.id, i, 'settings'),
								cssClass: 'settings',
							});
							buttons.push({
								text: 'Delete',
								icon: trashOutline,
								role: 'destructive',
								handler: actionHandler(v.id, i, 'delete'),
								cssClass: 'delete',
							});
							if (online) {
								buttons.push({
									text: 'Edit',
									icon: pencilOutline,
									handler: actionHandler(v.id, i, 'edit'),
									cssClass: 'edit',
								});
								buttons.push(dlBtn);
							}
							buttons.push({
								text: 'Cancel',
								icon: closeOutline,
								role: 'cancel',
							});
							return (
								<IonItem key={'parsed-' + v.id} className="sheet-list-item">
									<IonButton onClick={onClick(v.id, v.name)} className="list-item-sheet">
										<p>{v.name}</p>{' '}
										{downloading === v.id && <IonSpinner name="crescent" color="primary" />}
										{downloaded.indexOf(v.id) >= 0 && [
											<IonIcon icon={arrowDown} color="primary" key={v.id + '-dl'} />,
											<p key={'bytes-p-' + v.id}>{formatBytes(sizeof(dlSheets[v.id]))}</p>,
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
										buttons={buttons}
									/>
								</IonItem>
							);
						},
					)}
				</Flip>
			</IonList>
			{online && (
				<Zoom>
					<IonButton onClick={(): void => setRedirectTo('/create')} className="new-sheet">
						Add new sheet
					</IonButton>
				</Zoom>
			)}
		</IonContent>
	);
};
