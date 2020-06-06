import { DocumentData, DocumentReference, DocumentSnapshot } from '@firebase/firestore-types';
import { IonButton, IonContent, IonLabel, IonText, IonTitle } from '@ionic/react';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { sampleSize } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { Redirect, useHistory } from 'react-router';
import { FlashCard } from '../../components/FlashCard/FlashCard';
import { Loading } from '../../components/Loading/Loading';
import { saveDone } from '../../services/download';
import { analytics } from '../../services/firebase';
import { refreshToken, wait } from '../../services/firebase/auth';
import { useNetwork } from '../../services/network';
import './FlashCardsPage.scss';

let numCorrect = 0;
let numTotal = 0;

//TODO optimize firebase data structure for scaling

let done = [];

let isRefreshing = false;

const FlashCardsPageComponent: React.FC = () => {
	const store = useStore();
	const firebase = useFirebase();

	const googleAccess = useSelector((state: ReduxState) => state.google);
	const uid = useSelector((state: ReduxState) => state.firebase.auth.uid);
	const dl = useSelector((state: ReduxState) => state.download);

	const [initialCards, setInitialCards] = useState<{ front: string; back: string; row: number }[]>(null);
	const [cards, setCards] = useState<{ front: string; back: string; row: number }[]>(null);
	const [errors, setErrors] = useState<string>('');
	const [doReturn, setDoReturn] = useState(false);
	const [forceRefresh, doForceRefresh] = useState(0);
	const [doReset, setDoReset] = useState(false);

	const history = useHistory();
	const [isAuth, setIsAuth] = useState(false);

	const id = (history.location.state as { id: string }).id;
	const worksheetIndex = (history.location.state as { worksheetIndex: number }).worksheetIndex;

	const doneOffline = useSelector((state: ReduxState) => (state.download[id] || {}).done);
	const properties = useSelector(
		(state: ReduxState) =>
			((state.savedSheets.sheets || {})[id] || [])[worksheetIndex] || {
				cols: [0, 1],
				name: 'any', // TODO Maybe read real name?
				amount: 20,
				includeFirstRow: true,
			},
	);

	const online = useNetwork();

	useEffect(() => wait(firebase, setIsAuth), []);
	useEffect(() => {
		analytics.setCurrentScreen('flashcard_screen');
	}, []);

	useEffect(() => {
		console.log('effect');
		let listener: () => Promise<void>;
		let doc: DocumentReference<DocumentData>;
		if (online) {
			doc = firebase.firestore().collection('users').doc(uid).collection('sheets').doc(id);

			doc.get().then((snap: DocumentSnapshot<DocumentData>) => (done = snap.data().done));
			listener = (): Promise<void> => doc.update({ done: done });
		} else {
			listener = (): Promise<void> => saveDone(id, done, store);
			done = doneOffline || [];
			console.log(done, doneOffline);
		}
		window.addEventListener('beforeunload', listener);
		return (): void => {
			console.log('effect end', done);
			if (online) {
				doc.update({ done: done });
			} else {
				console.log('Storing done offline');
				if (doneOffline !== done) {
					saveDone(id, done, store);
				}
			}
			window.removeEventListener('beforeunload', listener);
		};
	}, []);

	useEffect(() => {
		console.log('Refresh effect triggered', googleAccess.expiresIn - Date.now() < 0);
		if (googleAccess.expiresIn - Date.now() < 0) {
			refreshToken(googleAccess.tokenId, store);
		}
	}, [googleAccess]);

	if (!isAuth) {
		return <Loading>Loading authentication</Loading>;
	}

	if (doReturn) {
		return <Redirect to="/select" push />;
	}

	if (errors) {
		if (errors.indexOf('401') >= 0 && !isRefreshing) {
			console.log('refreshing');
			// refreshToken(googleAccess.tokenId, store, setRefreshErrors);
			return <Loading>Refreshing access</Loading>;
		} else if (isRefreshing) {
			console.log(isRefreshing ? 'refreshing!' : 'not refreshing');
			setTimeout(() => setErrors(null), 2000);
			return <Loading>Refreshing access</Loading>;
		} else {
			store.dispatch({ type: 'DELETE_AUTH' });
			return (
				<IonContent>
					<IonText color="danger">
						<p>{errors}</p>
						<p>This indicates a wrong file type!</p>
					</IonText>
				</IonContent>
			);
		}
	}

	if (doReset) {
		done = [];
		setCards(null);
		setDoReset(false);
		return <Loading>Refreshing</Loading>;
	}

	if (cards === null) {
		numCorrect = 0;
		numTotal = 0;

		if (!online) {
			const sheet = ((dl[id] || {}).data || [])
				.map((v, i) => ({
					front: v[0],
					back: v[1],
					row: i,
				}))
				.filter((_, i) => done.indexOf(i) < 0);
			setCards(sheet);
			console.log('no network');
		} else {
			const sheet = new GoogleSpreadsheet(id);
			sheet.useRawAccessToken(googleAccess.accessToken).then(() => {
				isRefreshing = false;
				sheet
					.loadInfo()
					.then(() => {
						const worksheet = sheet.sheetsByIndex[worksheetIndex];
						return worksheet.loadCells();
					})
					.then(() => {
						const worksheet = sheet.sheetsByIndex[worksheetIndex];
						const start = properties.includeFirstRow ? 0 : 1;
						const c = [];
						for (let i = start; i < worksheet.rowCount; i++) {
							if (done.indexOf(i) < 0) {
								const cellLeft = worksheet.getCell(i, properties.cols[0]);
								if (cellLeft.value) {
									c.push({
										front: cellLeft.value,
										back: worksheet.getCell(i, properties.cols[1]).value,
										row: i,
									});
								}
							}
						}
						const b = sampleSize(c, properties.amount);
						setCards(b);
						numTotal = b.length;
						setInitialCards(b.slice());
					})
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					.catch((err: any) => {
						console.log(err);
						analytics.logEvent('exception', {
							description: err,
							fatal: false,
						});
						setErrors('' + err);
					});
			});
		}

		return <Loading>Loading flashcards, please wait</Loading>;
	}

	const onContinue = (i: number, row: number) => (correct: boolean): void => {
		const tmp = cards;
		tmp.splice(i, 1);
		if (correct) {
			numCorrect++;
			done.push(row);
			setCards(tmp);
			doForceRefresh(forceRefresh + 1);
		} else {
			setCards(tmp);
			doForceRefresh(forceRefresh + 1);
		}
	};

	if (cards.length === 0) {
		return (
			<IonContent className="flashcard-page">
				<IonTitle className="return-title">
					{numTotal === 0
						? 'There are no wrong flashcards here. Do you want to reset your progress and start new?'
						: 'Do you want to try again?'}
				</IonTitle>
				<IonLabel>
					{numTotal !== 0 &&
						((): JSX.Element => {
							if (numCorrect === numTotal) {
								return <p>Great Job! You got everything right</p>;
							} else {
								return (
									<div className="score">
										<p>
											{numCorrect >= numTotal / 2 && 'Good Job! '}
											You got
										</p>
										<p style={{ color: 'green' }}>{numCorrect}</p>
										<p>out out of</p>
										<p style={{ color: 'red' }}>{numTotal}</p>
										<p>right!</p>
									</div>
								);
							}
						})()}
				</IonLabel>
				<div slot="fixed">
					{numTotal !== 0 && <IonButton onClick={(): void => setCards(initialCards.slice())}>Yes</IonButton>}
					{numTotal !== 0 && <IonButton onClick={(): void => setCards(null)}>New Set</IonButton>}
					<IonButton onClick={(): void => setDoReset(true)}>{numTotal === 0 ? 'Yes' : 'Reset'}</IonButton>
					<IonButton onClick={(): void => setDoReturn(true)}>No, return</IonButton>
				</div>
			</IonContent>
		);
	}

	const flashcards = cards.map((v: { front: string; back: string; row: number }, i: number) => {
		let v1: string | JSX.Element = v.front;
		if (('' + v.front).startsWith('http')) {
			v1 = <img src={v1} alt={v1} />;
		}

		let v2: string | JSX.Element = v.back;
		if (('' + v.back).startsWith('http')) {
			v2 = <img src={v2} alt={v2} />;
		}
		return (
			<FlashCard
				slot="fixed"
				back={v2 as JSX.Element}
				front={v1 as JSX.Element}
				key={'card-' + i}
				onContinue={onContinue(i, v.row)}
			/>
		);
	});

	return (
		<IonContent className="flashcard-page">
			<IonLabel position="floating">{cards.length} cards left</IonLabel>
			{flashcards[Math.floor(Math.random() * cards.length)]}
		</IonContent>
	);
};

export const FlashCardsPage = React.memo(FlashCardsPageComponent, () => false);
