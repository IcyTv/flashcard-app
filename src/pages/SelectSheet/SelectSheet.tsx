import { IonButton, IonContent, IonIcon, IonItem, IonList } from "@ionic/react";
import { createOutline, trashOutline } from "ionicons/icons";
import React, { useState } from "react";
import { useStore } from "react-redux";
import { Redirect } from "react-router-dom";
import { Loading } from "../../components/Loading/Loading";
import { database } from "../../services/firebase";
import "./SelectSheet.scss";

const parseSheets = (a: { [id: string]: { name: string } }) => {
	let ret: { id: string; name: string; index: number }[] = [];
	let index = 0;
	for (let sheet in a) {
		if (a[sheet]) {
			ret.push({ id: sheet, name: a[sheet].name, index: index++ });
		}
	}
	return ret;
};

const openInNewTab = (url: string) => {
	window.open(url, "_blank");
};

export const SelectSheet: React.FC = () => {
	const store = useStore();
	const auth = store.getState().auth as Auth;

	const [sheets, setSheets] = useState<{ id: string; name: string }[]>();
	const [selectedSheet, setSelected] = useState<{ id: string; name: string }>();
	const [redirectTo, setRedirectTo] = useState("");

	if (redirectTo !== "") {
		return <Redirect to={redirectTo} />;
	}

	if (!auth) {
		return <Redirect to="/login" />;
	}

	if (!sheets) {
		console.log("Refreshing from firebase");
		database.ref("/user/" + auth.firebase.user.uid + "/sheets").on("value", (a) => {
			setSheets(parseSheets(a.toJSON() as any));
		});
		return <Loading>Saving to database</Loading>;
	}

	if (selectedSheet) {
		return <Redirect to={{ pathname: "/flashcard", state: selectedSheet }} />;
	}

	const onClick = (id: string, name: string) => (ev: any) => {
		setSelected({
			id: id,
			name: name,
		});
	};

	const onDelete = (id: string, name: string, index: number) => (ev: any) => {
		database.ref("/user/" + auth.firebase.user.uid + "/sheets/" + id).remove();
		let tmp = sheets.slice();
		tmp.splice(index);
		setSheets(tmp);
	};

	console.log(sheets);

	return (
		<IonContent key={"sheet-list-length-" + sheets.length}>
			<IonList className="sheet-list">
				{sheets.map((v, i) => {
					console.log(i);
					return (
						<IonItem key={"parsed-" + v.id}>
							<p onClick={onClick(v.id, v.name)}>{v.name}</p>
							<div>
								<IonButton
									onClick={() => openInNewTab(`https://docs.google.com/spreadsheets/d/${v.id}`)}
									className="edit"
								>
									<IonIcon icon={createOutline} />
								</IonButton>
								<IonButton onClick={onDelete(v.id, v.name, i)} className="delete">
									<IonIcon icon={trashOutline} />
								</IonButton>
							</div>
						</IonItem>
					);
				})}
			</IonList>
			<IonButton onClick={() => setRedirectTo("/create")}>Add new sheet</IonButton>
		</IonContent>
	);
};
