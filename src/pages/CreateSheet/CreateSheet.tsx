import { Plugins } from '@capacitor/core';
import { isPlatform } from '@ionic/core';
//prettier-ignore
import { IonButton, IonContent, IonTitle, IonCard, IonCardTitle, IonCardContent, IonIcon } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router';
import './CreateSheet.scss';
import { folderOpenOutline, addOutline, documentOutline } from 'ionicons/icons';
const { Browser } = Plugins;

const openInNewTab = (url: string) => {
	if (isPlatform('mobile')) {
		Browser.open({ url: url });
	} else {
		window.open(url, '_blank');
	}
};

export const CreateSheet: React.FC = (props) => {
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
