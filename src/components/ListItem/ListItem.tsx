import { IonItem } from '@ionic/react';
import React from 'react';
import './ListItem.scss';

interface ListItemProps {
	children: React.ReactElement;
	key?: string;
}

export const ListItem: React.FC<ListItemProps> = (props: ListItemProps) => {
	return (
		<>
			<IonItem
				className="list-item ion-align-items-center ion-justify-content-center ion-text-center ion-text-justify"
				key={props.key}
			>
				{/* <IonTitle className="ion-align-items-center ion-justify-content-center ion-text-center"> */}
				{props.children}
				{/* </IonTitle> */}
			</IonItem>
		</>
	);
};
