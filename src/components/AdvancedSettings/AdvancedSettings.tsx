import { IonList, IonItem, IonLabel, IonListHeader, IonTitle, IonToggle, IonCheckbox, IonAlert } from '@ionic/react';
import React, { useState } from 'react';
import './AdvancedSettings.scss';
import { useStore, useSelector } from 'react-redux';
import { ToggleChangeEventDetail, CheckboxChangeEventDetail } from '@ionic/core';
import { toggleNetworkDev, setFirstTime } from '../../services/store/debug';
import { useHistory } from 'react-router';
import { FirebaseX } from '@ionic-native/firebase-x';
import { error } from '../../tools/logger';

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
		console.log('crashing');
		console.log('Dumps: ');
		console.log(store.getState());
		FirebaseX.sendCrash();
	};

	const sendMsg = (): void => {
		try {
			throw new Error('Test');
		} catch (err) {
			error('Test error', err, 43, 13, __filename);
		}
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
					{ text: 'No', handler: () => setConfirm(false) },
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
				<IonItem onClick={crashAsk}>
					<IonLabel>Crash</IonLabel>
				</IonItem>
				<IonItem onClick={sendMsg}>
					<IonLabel>Log test message to server</IonLabel>
				</IonItem>
			</IonList>
		</>
	);
};
