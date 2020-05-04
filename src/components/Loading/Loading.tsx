import { IonSpinner } from "@ionic/react";
import React from "react";
import "./Loading.scss";

export const Loading: React.FC = (props) => {
	return (
		<div className="loading">
			<IonSpinner color="primary" />
			{props.children}
		</div>
	);
};
