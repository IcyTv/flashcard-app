import {
	IonButton,
	IonContent,
	IonFooter,
	IonHeader,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonMenu,
	IonTitle,
	IonToolbar,
} from '@ionic/react';
import { bookOutline, cashOutline, homeOutline, menu, powerOutline, settingsOutline } from 'ionicons/icons';
import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import './Menu.scss';

interface MenuProps {
	children?: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Menu: React.FC<MenuProps> = (_props: MenuProps) => {
	const ref = useRef<HTMLIonMenuElement>();
	const history = useHistory();

	console.log('Rerender');

	// Toggle menu on click away, but not if tutorial is open...
	useEffect(() => {
		const menu = document.querySelector('ion-menu');
		const width = menu.querySelector('ion-header');
		const ls = async (ev): Promise<void> => {
			if (
				(await menu.isOpen()) &&
				ev.offsetX > width.clientWidth &&
				!document.querySelector('div.react-joyride-portal')
			) {
				menu.toggle(true);
				console.log('Click handler closed menu');
			}
		};
		document.addEventListener('click', ls);
		return (): void => {
			document.removeEventListener('click', ls);
		};
	}, []);

	const redirectTo = (redirectTo: string) => (): void => {
		history.push(redirectTo);
		ref.current.close();
	};

	return (
		<IonMenu side="start" menuId="first" contentId="main-content" type="overlay" ref={ref} swipeGesture>
			<IonHeader>
				<IonToolbar>
					<IonButton onClick={async (): Promise<boolean> => await ref.current.close()} className="main-btn">
						<IonIcon icon={menu} />
						<IonTitle>Flashcards</IonTitle>
					</IonButton>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList lines="none">
					<IonItem onClick={redirectTo('/select')}>
						<IonIcon icon={homeOutline} />
						<IonLabel>Home</IonLabel>
					</IonItem>
					<IonItem onClick={redirectTo('/joyride')}>
						<IonIcon icon={bookOutline} />
						<IonLabel>Tutorial</IonLabel>
					</IonItem>
				</IonList>
			</IonContent>
			<IonFooter className="menu-footer">
				<IonList lines="none">
					<IonItem onClick={redirectTo('/payment')}>
						<IonIcon icon={cashOutline} />
						<IonLabel>Donate</IonLabel>
					</IonItem>
					<IonItem onClick={redirectTo('/settings')}>
						<IonIcon icon={settingsOutline} />
						<IonLabel>Settings</IonLabel>
					</IonItem>
					<IonItem slot="end" color="danger" onClick={redirectTo('/logout')}>
						<IonIcon icon={powerOutline} />
						<IonLabel>Logout</IonLabel>
					</IonItem>
				</IonList>
			</IonFooter>
		</IonMenu>
	);
};
