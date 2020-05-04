import { IonButton, IonContent, IonText, IonTitle } from "@ionic/react";
import { GoogleSpreadsheet } from "google-spreadsheet";
import React, { useState } from "react";
import { useStore } from "react-redux";
import { Redirect, RouterProps } from "react-router";
import { FlashCard } from "../../components/FlashCard/FlashCard";
import { Loading } from "../../components/Loading/Loading";
import "./FlashCardsPage.scss";

export const FlashCardsPage: React.FC<RouterProps> = (props) => {
	const store = useStore();
	const auth = store.getState().auth as Auth;

	const [cards, setCards] = useState<{ front: string; back: string }[]>([]);
	const [errors, setErrors] = useState<string>("");
	const [index, setIndex] = useState<number>(0);
	const [doReturn, setDoReturn] = useState(false);

	if (doReturn) {
		return <Redirect to="/select" />;
	}

	if (!auth) {
		return <Redirect to="/login" />;
	}

	if (errors) {
		return <IonText color="warning">{errors}</IonText>;
	}

	if (cards.length === 0) {
		const sheet = new GoogleSpreadsheet((props.history.location.state as any).id);
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
						let cellLeft = worksheet.getCell(i, 0);
						if (cellLeft.value) {
							c.push({ front: cellLeft.value, back: worksheet.getCell(i, 1).value });
						}
					}
					setCards(c);
				})
				.catch((err) => {
					setErrors(err);
				});
		});
		return <Loading>Loading flashcards, please wait</Loading>;
	}

	const onContinue = (correct: boolean) => {
		console.log(correct);
		setIndex(index + 1);
	};

	if (index >= cards.length) {
		return (
			<IonContent className="flashcard-page">
				<IonTitle className="return-title">Do you want to try again?</IonTitle>
				<div slot="fixed">
					<IonButton onClick={() => setIndex(0)}>Yes</IonButton>
					<IonButton onClick={() => setDoReturn(true)}>No</IonButton>
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
		return <FlashCard slot="fixed" back={v2} front={v1} key={"card-" + i} onContinue={onContinue} />;
	});

	return <IonContent className="flashcard-page">{flashcards[index]}</IonContent>;
};
