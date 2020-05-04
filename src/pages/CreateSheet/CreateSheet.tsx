import { createClient } from "@buttercup/googledrive-client";
import { IonContent, IonItem, IonList } from "@ionic/react";
import React, { useState } from "react";
import { useStore } from "react-redux";
import { Redirect } from "react-router-dom";
import { VError } from "verror";
import { Loading } from "../../components/Loading/Loading";
import { database } from "../../services/firebase";
import "./CreateSheet.scss";

const getFilesByType = (files: any, type: string) => {
	let retFiles = (files.files as any[]).filter((v) => v.mime === type);

	let childFiles = [];

	if (files.children) {
		childFiles = (files.children as any[]).map((v) => getFilesByType(v, type));
	}

	return retFiles.concat(childFiles).flat();
};

export const CreateSheet: React.FC = (props) => {
	const store = useStore();
	const auth = store.getState().auth as Auth;

	const [files, setFiles] = useState<any[]>();
	const [redirectTo, setRedirectTo] = useState("");

	if (redirectTo !== "") {
		return <Redirect to={redirectTo} />;
	}

	if (!auth) {
		return <Redirect to="/login" />;
	}

	const client = createClient(auth.google.accessToken);

	if (!files) {
		client
			.getDirectoryContents({ tree: true })
			.then((files: any) => {
				let fileList = getFilesByType(files, "application/vnd.google-apps.spreadsheet");
				console.log("FILES", fileList);
				setFiles(fileList);
			})
			.catch((err: any) => {
				console.error(err);
				const { authFailure = false } = VError.info(err);
				// handle authFailure === true
				if (authFailure) {
					console.error("Auth failiure");
					store.dispatch({ type: "DELETE_AUTH" });
				} else {
					console.error(err);
				}
			});

		return <Loading>Loading Sheets from drive</Loading>;
	}

	const onClick = (index: number) => (ev: React.MouseEvent<HTMLIonItemElement, MouseEvent>) => {
		console.log(files[index]);
		database.ref("/user/" + auth.firebase.user.uid + "/sheets/" + files[index].id).set({
			name: files[index].filename,
		});
		setRedirectTo("/select");
	};

	return (
		<IonContent>
			<IonList>
				{files &&
					files.map((v, i) => {
						return (
							<IonItem onClick={onClick(i)} key={"file-" + i}>
								{v.filename}
							</IonItem>
						);
					})}
			</IonList>
		</IonContent>
	);
};
