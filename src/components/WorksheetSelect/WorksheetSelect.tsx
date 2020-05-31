import { IonContent, IonList, IonItem, IonModal, IonTitle, IonText } from '@ionic/react';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAsyncEffect } from '../../tools';
import './WorksheetSelect.scss';

// import Loading from '../Loading';
const Loading = React.lazy(() => import('../Loading'));

interface WorksheetSelectProps {
	spreadsheet?: GoogleSpreadsheet;
	id?: string;
	isOpen: boolean;
	onSelect: (id: number) => void;
}

export const WorksheetSelect: React.FC<WorksheetSelectProps> = (props: WorksheetSelectProps) => {
	const accessToken = useSelector((state: ReduxState) => state.google.accessToken);
	const [loaded, setLoaded] = useState(false);

	const spreadsheet = useMemo(() => {
		if (props.id) {
			return new GoogleSpreadsheet(props.id);
		} else {
			return props.spreadsheet;
		}
	}, [props.id, props.spreadsheet]);

	useAsyncEffect(async () => {
		if (props.id) {
			await spreadsheet.useRawAccessToken(accessToken);
			await spreadsheet.loadInfo();
		}
		setLoaded(true);
	}, [spreadsheet]);

	if (!loaded) {
		return <Loading>Loading Spreadsheet data</Loading>;
	}

	const onClick = (id: number) => (): void => {
		console.log('Clicked', id);
		props.onSelect(id);
	};

	return (
		<IonModal isOpen={props.isOpen} cssClass="worksheet-select">
			<IonTitle>{spreadsheet.title}</IonTitle>
			<IonText>Select your worksheet</IonText>
			<IonList>
				{spreadsheet.sheetsByIndex.map((v) => {
					return (
						<IonItem onClick={onClick(v.index)} key={'worksheet-' + v.sheetId + '-' + v.index}>
							{v.title}
						</IonItem>
					);
				})}
			</IonList>
		</IonModal>
	);
};
