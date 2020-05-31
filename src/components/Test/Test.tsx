import { IonContent, IonButton } from '@ionic/react';
import React, { useState, useMemo } from 'react';
import GooglePayButton from '../GooglePayButton';
import PrebidAdUnit from '../PrebidAdUnit';

import './Test.scss';
import GooglePicker from '../GooglePicker';
import MobilePicker from '../MobilePicker';
import SheetPropsSelector from '../SheetPropsSelector';
import WorksheetSelect from '../WorksheetSelect';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { useAsyncEffect } from '../../tools';
import Loading from '../Loading';
import { useSelector } from 'react-redux';

// import "@types/gapi.client.sheets";

interface TestProps {}

export const Test: React.FC<TestProps> = (props) => {
	const [workSheet, setWorkSheet] = useState(-1);
	const [loaded, setLoaded] = useState(false);
	const accessToken = useSelector((state: ReduxState) => state.google.accessToken);

	const spreadsheet = useMemo(() => new GoogleSpreadsheet('1GsGi3P8E5OLZRLTCu0vovqXm2MeluELmiT1KAF6bzc0'), []);

	useAsyncEffect(async () => {
		await spreadsheet.useRawAccessToken(accessToken);
		await spreadsheet.loadInfo();
		setLoaded(true);
	}, [spreadsheet]);

	if (!loaded) {
		return <Loading>Loading spreadsheet</Loading>;
	}

	const onClick = () => {};
	const onSelect = (id: number) => {
		setWorkSheet(id);
	};

	const onBack = () => {
		setWorkSheet(-1);
	};

	return (
		<IonContent>
			<SheetPropsSelector
				spreadsheet={spreadsheet}
				isOpen={workSheet >= 0}
				worksheetIndex={workSheet}
				onBack={onBack}
			/>
			<WorksheetSelect
				spreadsheet={spreadsheet}
				id="1GsGi3P8E5OLZRLTCu0vovqXm2MeluELmiT1KAF6bzc0"
				onSelect={onSelect}
				isOpen={workSheet < 0}
			/>
			{/* <MobilePicker /> */}
			{/* <GooglePayButton id="test" amount={0.01} /> */}
			{/* <input type="file" name="test" /> */}
			{/* <IonButton onClick={onClick}>Test</IonButton>
			<PrebidAdUnit />
			<GooglePicker onError={console.error} onPick={console.log} /> */}
		</IonContent>
	);
};
