import { IonBackButton, IonButtons, IonHeader, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import React, { useEffect } from 'react';
import { analytics } from '../../services/firebase';
import './NotFound.scss';

interface NotFoundProps {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const NotFound: React.FC<NotFoundProps> = (_props: NotFoundProps) => {
	useEffect(() => {
		analytics.setCurrentScreen('404_screen');
	}, []);

	return (
		<div className="not-found">
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton icon={arrowBack} defaultHref="select" />
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonTitle color="danger">404</IonTitle>
			<IonText>Not found</IonText>
		</div>
	);
};
