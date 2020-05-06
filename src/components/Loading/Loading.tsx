import React from "react";
import SyncLoader from "react-spinners/SyncLoader";
import "./Loading.scss";

export const Loading: React.FC = (props) => {
	return (
		<div className="loading">
			<SyncLoader size={15} margin={5} color="var(--ion-color-primary)" loading />
			<br />
			{props.children}
		</div>
	);
};
