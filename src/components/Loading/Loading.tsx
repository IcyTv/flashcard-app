import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import './Loading.scss';

export const Loading: React.FC = (props: React.Props<null>) => {
	return (
		<div className="loading">
			{/* <SyncLoader size={15} margin={5} color="var(--ion-color-primary)" loading /> */}
			{/* <BounceLoader size={50} loading color="var(--ion-color-primary)" /> */}
			<ClipLoader size={50} loading color="var(--ion-color-tertiary)" />
			<br />
			<div className="loading-content" style={{ color: 'var(--ion-text-color)' }}>
				{props.children}
			</div>
		</div>
	);
};
