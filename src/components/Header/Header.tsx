import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonHeader,
	IonIcon,
	IonToolbar,
	IonTitle,
	IonSegment,
	IonMenuButton,
} from '@ionic/react';
import { powerOutline, wifiOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, Redirect } from 'react-router';
import './Header.scss';
import { Network } from '@ionic-native/network';
import { useNetwork } from '../../services/network';
interface HeaderProps {}

export const Header: React.FC<HeaderProps> = (props) => {
	const history = useHistory();
	const location = useLocation();
	const ref = useRef<any>();
	const [fR, setfr] = useState(0);
	const [redirectTo, setRedirectTo] = useState('');
	const online = useNetwork();

	useEffect(() => {
		setTimeout(() => setfr(fR + 1), 30);
	}, []);

	if (redirectTo) {
		return <Redirect from={location.pathname} to={redirectTo} />;
	}

	if (ref.current) {
		ref.current.clickButton = (e) => {
			if (location.pathname === '/payment/success' || location.pathname === '/payment/cancel') {
				history.push('/payment');
				return;
			}
			history.goBack();
			// setRedirectTo('-1');
			e.preventDefault();
		};
	}

	const onLogout = (): void => {
		history.push('/logout');
		// setRedirectTo('/logout');
	};

	return (
		<IonHeader hidden={location.pathname === '/login'}>
			<IonToolbar>
				<IonButtons slot="start">
					<IonMenuButton menu="first" slot="start" autoHide={false} />
					<IonBackButton ref={ref} defaultHref="/" />
				</IonButtons>
				<IonIcon slot="end" icon={wifiOutline} className={online ? 'connected' : 'disconnected'} />
				<IonButton className="logout" slot="end" onClick={onLogout}>
					<IonIcon icon={powerOutline} />
				</IonButton>
				<IonTitle className="ion-align-self-center">Flashcards</IonTitle>
			</IonToolbar>
		</IonHeader>
	);
};
