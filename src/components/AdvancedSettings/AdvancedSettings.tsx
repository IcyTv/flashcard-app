import { IonList, IonItem, IonLabel, IonListHeader, IonTitle, IonToggle, IonCheckbox } from '@ionic/react';
import React, { useState } from 'react';
import './AdvancedSettings.scss';
import { useStore, useSelector } from 'react-redux';
import { ToggleChangeEventDetail, CheckboxChangeEventDetail } from '@ionic/core';
import { toggleNetworkDev, setFirstTime } from '../../services/store/debug';
import { useHistory } from 'react-router';

interface AdvancedSettingsProps {}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = () => {
	const store = useStore();
	const history = useHistory();

	const offline = useSelector((state: ReduxState) => state.debug.networkDev);
	const firstTime = useSelector((state: ReduxState) => state.debug.firstTime);

	const onNetworkToggle = (ev: CustomEvent<ToggleChangeEventDetail>): void => {
		toggleNetworkDev(store)(ev.detail.checked);
	};

	const onFirstTimeToggle = (ev: CustomEvent<CheckboxChangeEventDetail>): void => {
		setFirstTime(store)(ev.detail.checked);
	};

	return (
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
		</IonList>
	);
};
