import React from 'react';
import SyncLoader from 'react-spinners/SyncLoader';
import './Loading.scss';

export const Loading: React.FC = (props: React.Props<null>) => {
	return (
		<div className="loading">
			<SyncLoader size={15} margin={5} color="var(--ion-color-primary)" loading />
			<br />
			<div className="loading-content">{props.children}</div>
		</div>
	);
};
