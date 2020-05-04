import { IonButton, IonContent, IonItem, IonList } from "@ionic/react";
import React, { useState } from "react";
import { useStore } from "react-redux";
import { Redirect } from "react-router-dom";
import { Loading } from "../../components/Loading/Loading";
import { database } from "../../services/firebase";
import "./SelectSheet.scss";

const parseSheets = (a: { [id: string]: { name: string } }) => {
	let ret: { id: string; name: string }[] = [];
	for (let sheet in a) {
		ret.push({ id: sheet, name: a[sheet].name });
	}
	console.log(ret);
	return ret;
};

export const SelectSheet: React.FC = () => {
	const store = useStore();
	const auth = store.getState().auth as Auth;

	const [sheets, setSheets] = useState<{ [id: string]: { name: string } }>();
	const [selectedSheet, setSelected] = useState<{ id: string; name: string }>();
	const [redirectTo, setRedirectTo] = useState("");

	if (redirectTo !== "") {
		return <Redirect to={redirectTo} />;
	}

	if (!auth) {
		return <Redirect to="/login" />;
	}

	if (!sheets) {
		database.ref("/user/" + auth.firebase.user.uid + "/sheets").on("value", (a) => {
			setSheets(a.toJSON() as any);
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

	return (
		<IonContent>
			<IonList>
				{parseSheets(sheets).map((v, i) => {
					return (
						<IonItem onClick={onClick(v.id, v.name)} key={"parsed-" + v.id}>
							{v.name}
						</IonItem>
					);
				})}
			</IonList>
			<IonButton onClick={() => setRedirectTo("/create")}>Add new sheet</IonButton>
		</IonContent>
	);
};
