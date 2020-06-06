import {
	IonBackButton,
	IonButtons,
	IonHeader,
	IonIcon,
	IonItem,
	IonMenuButton,
	IonTitle,
	IonToolbar,
} from '@ionic/react';
import { wifiOutline } from 'ionicons/icons';
import React, { useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useNetwork } from '../../services/network';
import './Header.scss';
interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
	const history = useHistory();
	const location = useLocation();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const ref = useRef<any>();
	const online = useNetwork();

	useEffect(() => {
		if (ref.current) {
			ref.current.clickButton = (e): void => {
				if (location.pathname === '/payment/success' || location.pathname === '/payment/cancel') {
					history.push('/payment');
				} else {
					history.goBack();
				}
				console.log('history', history);
				// setRedirectTo('-1');
				e.preventDefault();
			};
		}
	}, [ref]);

	return (
		<IonHeader>
			<IonToolbar>
				<IonButtons slot="start">
					<IonMenuButton menu="first" slot="start" autoHide={false} />
					<IonBackButton ref={ref} defaultHref="/" />
				</IonButtons>
				<IonItem slot="end">
					<IonIcon icon={wifiOutline} className={online ? 'connected' : 'disconnected'} />
				</IonItem>
				<IonTitle className="ion-align-self-center">Flashcards</IonTitle>
			</IonToolbar>
		</IonHeader>
	);
};
