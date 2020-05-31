import { IonModal, IonTitle, IonLabel, IonInput, IonCheckbox } from '@ionic/react';
import React, { useMemo, useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import { newSheetProps } from '../../services/store/savedSheets';
import './SheetPropsSelector.scss';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { useAsyncEffect } from '../../tools';
import Loading from '../Loading';

interface SheetPropsSelectorProps {
	name: string;
	id: string;
	worksheetIndex: number;
	isOpen: boolean;
}

export const SheetPropsSelector: React.FC<SheetPropsSelectorProps> = (props: SheetPropsSelectorProps) => {
	const store = useStore();
	const save = newSheetProps(store);

	const [info, setInfo] = useState(null);
	const spreadsheet = useMemo(() => new GoogleSpreadsheet(props.id), [props]);

	const [amount, setAmount] = useState(20);

	useAsyncEffect(async () => {
		await spreadsheet.loadInfo();
		const worksheet = spreadsheet.sheetsByIndex[props.worksheetIndex];
		const info = {
			columnCount: worksheet.columnCount,
		};
		setInfo(info);
	}, [spreadsheet]);

	if (!info) {
		return <Loading>Loading spreadsheet info</Loading>;
	}

	return (
		<IonModal isOpen={props.isOpen}>
			<IonTitle>{props.name}</IonTitle>
			<IonLabel position="stacked">Front</IonLabel>
			<IonInput type="number" max={info.columnCount} />
			<IonLabel position="stacked">Back</IonLabel>
			<IonInput type="number" max={info.columnCount} />
			<div>
				<IonCheckbox checked />
				<IonLabel>Include first row?</IonLabel>
			</div>
		</IonModal>
	);
};
