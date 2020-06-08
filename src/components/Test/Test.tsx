/* eslint-disable */
import { IonContent } from '@ionic/react';
import React from 'react';
import ProposeRelease from '../ProposeRelease';
import './Test.scss';
import { showErrorModal } from '../../tools/errorModal';

// import "@types/gapi.client.sheets";

interface TestProps {}

export const Test: React.FC<TestProps> = (props) => {
	try {
		throw new Error('test');
	} catch (err) {
		showErrorModal(null, err, true);
	}

	return (
		<IonContent>
			{/* <ProposeRelease /> */}
			{/* <MobilePicker /> */}
			{/* <GooglePayButton id="test" amount={0.01} /> */}
			{/* <input type="file" name="test" /> */}
			{/* <IonButton onClick={onClick}>Test</IonButton>
			<PrebidAdUnit />
			<GooglePicker onError={console.error} onPick={console.log} /> */}
		</IonContent>
	);
};
