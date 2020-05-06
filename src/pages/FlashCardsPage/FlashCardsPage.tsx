import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonLabel,
	IonText,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { GoogleSpreadsheet } from "google-spreadsheet";
import React, { useState } from "react";
import { useStore } from "react-redux";
import { Redirect, RouterProps } from "react-router";
import { FlashCard } from "../../components/FlashCard/FlashCard";
import { Loading } from "../../components/Loading/Loading";
import { database } from "../../services/firebase";
import "./FlashCardsPage.scss";

let numCorrect = 0;
let numTotal = 0;

export const FlashCardsPage: React.FC<RouterProps> = (props) => {
	const store = useStore();
	const auth = store.getState().auth as Auth;

	const [initialCards, setInitialCards] = useState<{ front: string; back: string; row: number }[]>(null);
	const [cards, setCards] = useState<{ front: string; back: string; row: number }[]>(null);
	const [errors, setErrors] = useState<string>("");
	const [doReturn, setDoReturn] = useState(false);
	const [forceRefresh, doForceRefresh] = useState(0);
	const [doReset, setDoReset] = useState(false);

	if (doReturn) {
		return <Redirect to="/select" push />;
	}

	if (!auth) {
		return <Redirect to="/login" />;
	}

	if (errors) {
		store.dispatch({ type: "DELETE_AUTH" });
		return (
			<IonText color="danger">
				<p>{errors}</p>
				<p>Your login is probably expired</p>
			</IonText>
		);
	}

	if (doReset) {
		database
			.ref("user/" + auth.firebase.user.uid + "/done/" + (props.history.location.state as any).id)
			.remove()
			.then(() => {
				setDoReset(false);
				setCards(null);
			});
	}

	if (!cards) {
		numCorrect = 0;
		numTotal = 0;
		const sheet = new GoogleSpreadsheet((props.history.location.state as any).id);
		console.log(auth.google.accessToken);
		database
			.ref("user/" + auth.firebase.user.uid + "/done/" + (props.history.location.state as any).id)
			.once("value", (data) => {
				console.log(data.val());
				const done = data.val() || {};
				sheet.useRawAccessToken(auth.google.accessToken).then(() => {
					sheet
						.loadInfo()
						.then(() => {
							const worksheet = sheet.sheetsByIndex[0];
							return worksheet.loadCells();
						})
						.then(() => {
							const worksheet = sheet.sheetsByIndex[0];
							console.log("loaded cells");
							let c = [];
							for (let i = 0; i < worksheet.rowCount; i++) {
								if (!done[i]) {
									let cellLeft = worksheet.getCell(i, 0);
									if (cellLeft.value) {
										c.push({ front: cellLeft.value, back: worksheet.getCell(i, 1).value, row: i });
									}
								}
							}
							setCards(c);
							numTotal = c.length;
							setInitialCards(c.slice());
						})
						.catch((err) => {
							console.error(err.message);
							setErrors("" + err);
						});
				});
			});
		return <Loading>Loading flashcards, please wait</Loading>;
	}

	const onContinue = (i: number, row: number) => (correct: boolean) => {
		console.log(correct ? "right" : "wrong");
		let tmp = cards;
		tmp.splice(i, 1);
		if (correct) {
			//TODO handle firebase correct

			numCorrect++;

			database
				.ref("user/" + auth.firebase.user.uid + "/done/" + (props.history.location.state as any).id + "/" + row)
				.set(true)
				.then(() => {
					console.log("Next card");
					setCards(tmp);
					doForceRefresh(forceRefresh + 1);
				});
		} else {
			setCards(tmp);
			doForceRefresh(forceRefresh + 1);
		}
	};

	const backButton = (
		<IonHeader>
			<IonToolbar>
				<IonButtons slot="start">
					<IonBackButton defaultHref="select">Return</IonBackButton>
				</IonButtons>
			</IonToolbar>
		</IonHeader>
	);

	if (cards.length === 0) {
		return (
			<IonContent className="flashcard-page">
				{backButton}
				<IonTitle className="return-title">
					{numTotal === 0
						? "There are no wrong flashcards here. Do you want to reset your progress and start new?"
						: "Do you want to try again?"}
				</IonTitle>
				<IonLabel>
					{numTotal !== 0 &&
						(() => {
							if (numCorrect === numTotal) {
								return <p>Great Job! You got everything right</p>;
							} else {
								return (
									<div className="score">
										<p>{numCorrect >= numTotal / 2 && "Good Job! "}You got</p>
										<p style={{ color: "green" }}>{numCorrect}</p>
										<p>out out of</p>
										<p style={{ color: "red" }}>{numTotal}</p>
										<p>right!</p>
									</div>
								);
							}
						})()}
				</IonLabel>
				<div slot="fixed">
					{numTotal !== 0 && <IonButton onClick={() => setCards(initialCards.slice())}>Yes</IonButton>}
					{numTotal !== 0 && <IonButton onClick={() => setCards(null)}>Only Wrong</IonButton>}
					<IonButton onClick={() => setDoReset(true)}>{numTotal === 0 ? "Yes" : "Reset"}</IonButton>
					<IonButton onClick={() => setDoReturn(true)}>No, return</IonButton>
				</div>
			</IonContent>
		);
	}

	const flashcards = cards.map((v, i) => {
		let v1: any = v.front;
		if (("" + v.front).startsWith("http")) {
			v1 = <img src={v1} alt={v1} />;
		}

		let v2: any = v.back;
		if (("" + v.back).startsWith("http")) {
			v2 = <img src={v2} alt={v2} />;
		}
		return <FlashCard slot="fixed" back={v2} front={v1} key={"card-" + i} onContinue={onContinue(i, v.row)} />;
	});

	return (
		<IonContent className="flashcard-page">
			{backButton}
			<IonLabel position="floating">{cards.length} cards left</IonLabel>
			{flashcards[Math.floor(Math.random() * cards.length)]}
		</IonContent>
	);
};
