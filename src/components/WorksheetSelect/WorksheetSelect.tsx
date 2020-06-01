import { IonContent, IonList, IonItem, IonModal, IonTitle, IonText } from '@ionic/react';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import React, { useMemo, useState, useEffect } from 'react';
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
	onSpreadsheetLoad?: (spreadsheet: GoogleSpreadsheet) => void;
	onDismiss?: () => void;
}

export const WorksheetSelect: React.FC<WorksheetSelectProps> = (props: WorksheetSelectProps) => {
	const accessToken = useSelector((state: ReduxState) => state.google.accessToken);
	const [loaded, setLoaded] = useState(false);
	const [effectTriggered, setEffectTriggered] = useState(false);

	useEffect(() => {
		// setLoaded(false);
		setEffectTriggered(false);
	}, [props.id]);

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
			setEffectTriggered(true);
		} else if (props.spreadsheet) {
			setEffectTriggered(true);
		}
		if (props.onSpreadsheetLoad) {
			props.onSpreadsheetLoad(spreadsheet);
		}
		setLoaded(true);
	}, [spreadsheet, props.id, props.spreadsheet]);

	if (!loaded) {
		return (
			<IonModal isOpen={props.isOpen}>
				<Loading>Loading Spreadsheet data</Loading>
			</IonModal>
		);
	}

	if (!props.isOpen || !effectTriggered) {
		return null;
	}

	const onClick = (id: number) => (): void => {
		props.onSelect(id);
	};

	return (
		<IonModal isOpen={props.isOpen} onDidDismiss={props.onDismiss}>
			<div className="worksheet-select">
				<IonTitle>{spreadsheet.title}</IonTitle>
				<p>Select your worksheet</p>
				<IonList>
					{spreadsheet.sheetsByIndex.map((v) => {
						return (
							<IonItem onClick={onClick(v.index)} key={'worksheet-' + v.sheetId + '-' + v.index}>
								{v.title}
							</IonItem>
						);
					})}
				</IonList>
			</div>
		</IonModal>
	);
};
