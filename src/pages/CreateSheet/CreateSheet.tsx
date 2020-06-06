import { IonButton, IonCard, IonCardContent, IonCardTitle, IonContent, IonIcon, IonTitle } from '@ionic/react';
import { addOutline, folderOpenOutline } from 'ionicons/icons';
import React from 'react';
import { useHistory } from 'react-router';
import './CreateSheet.scss';

export const CreateSheet: React.FC = () => {
	const history = useHistory();

	const redirectTo = (url: string) => () => {
		history.push(url);
	};

	return (
		<IonContent className="create-sheet">
			<IonCard>
				<IonCardTitle>
					<IonTitle>Add a new sheet</IonTitle>
				</IonCardTitle>
				<IonCardContent>
					<IonButton onClick={redirectTo('/create/picker')} color="success">
						<IonIcon icon={folderOpenOutline} />
						<p>Use existing sheet</p>
					</IonButton>
					<IonButton onClick={redirectTo('/create/new')} color="primary">
						<IonIcon icon={addOutline} />
						<p>Create new sheet</p>
					</IonButton>
					{/* <IonButton onClick={redirectTo('/create/template')} color="warning" disabled>
						<IonIcon icon={documentOutline} />
						<p>Create from template</p>
					</IonButton> */}
				</IonCardContent>
			</IonCard>
		</IonContent>
	);
};
