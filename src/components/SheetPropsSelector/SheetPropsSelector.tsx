import { IonButton, IonCheckbox, IonIcon, IonInput, IonLabel, IonModal, IonText, IonTitle } from '@ionic/react';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { arrowBack } from 'ionicons/icons';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useSelector, useStore } from 'react-redux';
import { newSheetProps } from '../../services/store/savedSheets';
import { assign } from 'lodash';
import Loading from '../Loading';
import './SheetPropsSelector.scss';

interface SheetPropsSelectorProps {
	spreadsheet?: GoogleSpreadsheet;
	id?: string;
	worksheetIndex: number;
	isOpen: boolean;
	afterSave?: () => void;
	onBack?: (ev?: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) => void;
	onDismiss?: () => void;
}

interface WorksheetInfo {
	columnCount: number;
	rowCount: number;
	worksheetName: string;
}

export const SheetPropsSelector: React.FC<SheetPropsSelectorProps> = (props: SheetPropsSelectorProps) => {
	const store = useStore();
	const save = newSheetProps(store);
	const savedInfo: ReduxState['savedSheets']['sheets'][''][0] = useSelector((state: ReduxState) =>
		assign(
			{
				cols: [0, 1],
				amount: 20,
				includeFirstRow: true,
			},
			(state.savedSheets.sheets || {})[props.id][props.worksheetIndex],
		),
	);
	const auth = useSelector((state: ReduxState) => state.google);

	const frontRef = useRef<HTMLIonInputElement>();
	const backRef = useRef<HTMLIonInputElement>();
	const firstRef = useRef<HTMLIonCheckboxElement>();
	const amountRef = useRef<HTMLIonInputElement>();

	const [info, setInfo] = useState<WorksheetInfo>(null);
	const spreadsheet = useMemo(() => {
		if (props.id) {
			return new GoogleSpreadsheet(props.id);
		} else {
			return props.spreadsheet;
		}
	}, [props.spreadsheet, props.id]);

	const [error, setError] = useState('');

	useEffect(() => {
		const func = async (): Promise<void> => {
			if (props.worksheetIndex === -1) {
				return;
			}
			console.log('loading');
			if (!props.spreadsheet) {
				await spreadsheet.useRawAccessToken(auth.accessToken);
				await spreadsheet.loadInfo();
			}
			const worksheet = spreadsheet.sheetsByIndex[props.worksheetIndex];
			console.log('Worksheet', spreadsheet.sheetCount);
			const info: WorksheetInfo = {
				columnCount: worksheet.columnCount,
				rowCount: worksheet.rowCount,
				worksheetName: worksheet.title,
			};
			setInfo(info);
		};
		func();
	}, [spreadsheet, props.worksheetIndex]);

	if (!info && props.isOpen) {
		return <Loading>Loading spreadsheet info</Loading>;
	}

	if (props.worksheetIndex === -1 || !info) {
		return null;
	}

	const onClick = (): void => {
		const front = frontRef.current.value.valueOf() as number;
		const back = backRef.current.value.valueOf() as number;
		if (front !== back) {
			save({
				name: spreadsheet.title,
				worksheetIndex: props.worksheetIndex,
				amount: amountRef.current.value.valueOf() as number,
				cols: [front, back],
				id: spreadsheet.spreadsheetId,
				includeFirstRow: firstRef.current.checked,
			});
			if (props.afterSave) {
				props.afterSave();
			}
			setError('');
		} else {
			setError('Front cannot be the same as back');
		}
	};

	const clamp = (min: number, max: number) => (ev: CustomEvent<void>): void => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const target = ev.target as any;
		console.log(ev);

		if (parseInt(target.value) > max) {
			target.value = max;
		} else if (parseInt(target.value) < min) {
			target.value = min;
		}
	};

	return (
		<IonModal isOpen={props.isOpen} cssClass="sheet-props-modal" onDidDismiss={props.onDismiss}>
			<IonButton onClick={props.onBack}>
				<IonIcon icon={arrowBack} />
				Back
			</IonButton>
			<IonTitle>{spreadsheet.title + ' - ' + info.worksheetName}</IonTitle>
			<div>
				<IonLabel position="stacked">Front</IonLabel>
				<IonInput
					type="number"
					max={'' + info.columnCount}
					min="0"
					value={savedInfo.cols[0]}
					ref={frontRef}
					// onIonChange={clamp(0, info.columnCount - 1)}
					onIonBlur={clamp(0, info.columnCount - 1)}
				/>
			</div>
			<div>
				<IonLabel position="stacked">Back</IonLabel>
				<IonInput
					type="number"
					max={'' + info.columnCount}
					min="0"
					value={savedInfo.cols[1]}
					ref={backRef}
					// onIonChange={clamp(0, info.columnCount - 1)}
					onIonBlur={clamp(0, info.columnCount - 1)}
				/>
			</div>
			<div>
				<IonCheckbox checked={savedInfo.includeFirstRow} ref={firstRef} />
				<IonLabel>Include first row?</IonLabel>
			</div>
			<div>
				<IonLabel position="stacked">Amount to practice</IonLabel>
				<IonInput
					type="number"
					max={'' + info.rowCount}
					min="0"
					value={savedInfo.amount}
					ref={amountRef}
					// onIonChange={clamp(0, info.rowCount - 1)}
					onIonBlur={clamp(0, info.rowCount - 1)}
				/>
			</div>
			{error && <IonText color="danger">{error}</IonText>}
			<IonButton color="success" onClick={onClick}>
				Okay
			</IonButton>
		</IonModal>
	);
};
