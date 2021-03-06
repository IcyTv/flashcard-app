// import { FirebaseX } from '@ionic-native/firebase-x';
import { CheckboxChangeEventDetail, isPlatform, ToggleChangeEventDetail } from '@ionic/core';
import { IonAlert, IonCheckbox, IonItem, IonLabel, IonList, IonListHeader, IonTitle, IonToggle } from '@ionic/react';
import React, { useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { useHistory } from 'react-router';
import { setFirstTime, toggleNetworkDev } from '../../services/store/debug';
import './AdvancedSettings.scss';

interface AdvancedSettingsProps {}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = () => {
	const store = useStore();
	const history = useHistory();

	const offline = useSelector((state: ReduxState) => state.debug.networkDev);
	const firstTime = useSelector((state: ReduxState) => state.debug.firstTime);

	const [confirm, setConfirm] = useState(false);

	const onNetworkToggle = (ev: CustomEvent<ToggleChangeEventDetail>): void => {
		toggleNetworkDev(store)(ev.detail.checked);
	};

	const onFirstTimeToggle = (ev: CustomEvent<CheckboxChangeEventDetail>): void => {
		setFirstTime(store)(ev.detail.checked);
	};

	const crashAsk = (): void => {
		setConfirm(true);
	};

	const crash = (): void => {
		console.warn('Crashing currently not implemented');
		// FirebaseX.sendCrash();
	};

	const sendMsg = (): void => {
		// try {
		// 	throw new Error('Test');
		// } catch (err) {
		// 	error('Test error', err, 43, 13, __filename);
		// }
		throw new Error('test');
	};

	return (
		<>
			<IonAlert
				isOpen={confirm}
				message="Are you sure?"
				buttons={[
					{
						text: 'Yes',
						handler: crash,
					},
					{ text: 'No', handler: (): void => setConfirm(false) },
				]}
			/>
			<IonList lines="none">
				<IonListHeader>
					<IonTitle>Advanced Settings</IonTitle>
				</IonListHeader>
				<IonItem>
					<IonToggle onIonChange={onNetworkToggle} checked={offline} />
					<IonLabel>{offline ? 'offline' : 'online'}</IonLabel>
				</IonItem>
				<IonItem>
					<IonCheckbox onIonChange={onFirstTimeToggle} checked={firstTime} />
					<IonLabel>Test first time</IonLabel>
				</IonItem>
				<IonItem onClick={(): void => history.push('/test')}>
					<IonLabel>Test page</IonLabel>
				</IonItem>
				{isPlatform('cordova') ||
					(isPlatform('capacitor') && (
						<IonItem onClick={crashAsk}>
							<IonLabel>Crash</IonLabel>
						</IonItem>
					))}
				<IonItem onClick={sendMsg}>
					<IonLabel>Log test message to server</IonLabel>
				</IonItem>
			</IonList>
		</>
	);
};
