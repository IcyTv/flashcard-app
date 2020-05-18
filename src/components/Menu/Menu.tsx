import React, { useRef, useState, useEffect } from 'react';
import { powerOutline, menu, homeOutline, arrowBack } from 'ionicons/icons';
import './Menu.scss';
import {
	IonContent,
	IonIcon,
	IonMenu,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonItem,
	IonList,
	IonLabel,
	IonMenuToggle,
	IonButton,
	IonFooter,
	IonToggle,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

interface MenuProps {
	children?: unknown;
}

export const Menu: React.FC<MenuProps> = (props: MenuProps) => {
	const [ref, setRef] = useState(null);
	const [forceRerender, setForceRerender] = useState(false);
	useEffect(() => {
		const menu = document.querySelector('ion-menu');
		const width = menu.querySelector('ion-header');
		const ls = async (ev): Promise<void> => {
			if ((await menu.isOpen()) && ev.offsetX > width.clientWidth) {
				menu.toggle(true);
			}
		};
		document.addEventListener('click', ls);
		return (): void => {
			document.removeEventListener('click', ls);
		};
	}, []);

	return (
		<IonMenu
			side="start"
			menuId="first"
			contentId="main-content"
			type="overlay"
			ref={(ref): void => setRef(ref)}
			swipeGesture
		>
			<IonHeader>
				<IonToolbar>
					<IonButton onClick={() => ref.toggle()} className="main-btn">
						<IonIcon icon={menu} />
						<IonTitle>Flashcards</IonTitle>
					</IonButton>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList lines="none">
					<IonItem routerLink="/select" routerDirection="forward">
						<IonIcon icon={homeOutline} />
						<IonLabel>Home</IonLabel>
					</IonItem>
					<IonItem>
						<IonToggle
							checked={window.networkDev}
							onIonChange={(e) => {
								window.networkDev = e.detail.checked;
								setForceRerender(!forceRerender);
							}}
						/>
						<IonLabel>{window.networkDev ? 'offline' : 'online'}</IonLabel>
					</IonItem>
				</IonList>
			</IonContent>
			<IonFooter className="menu-footer">
				<IonList lines="none">
					<IonItem slot="end" color="danger" routerLink="/logout">
						<IonIcon icon={powerOutline} />
						<IonLabel>Logout</IonLabel>
					</IonItem>
				</IonList>
			</IonFooter>
		</IonMenu>
	);
};
