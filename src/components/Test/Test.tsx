import { IonContent, IonButton } from '@ionic/react';
import React from 'react';
import GooglePayButton from '../GooglePayButton';
import PrebidAdUnit from '../PrebidAdUnit';

import './Test.scss';
import GooglePicker from '../GooglePicker';
import MobilePicker from '../MobilePicker';

// import "@types/gapi.client.sheets";

interface TestProps {}

export const Test: React.FC<TestProps> = (props) => {
	const onClick = () => {};
	return (
		<IonContent>
			<MobilePicker />
			{/* <GooglePayButton id="test" amount={0.01} /> */}
			{/* <input type="file" name="test" /> */}
			{/* <IonButton onClick={onClick}>Test</IonButton>
			<PrebidAdUnit />
			<GooglePicker onError={console.error} onPick={console.log} /> */}
		</IonContent>
	);
};
