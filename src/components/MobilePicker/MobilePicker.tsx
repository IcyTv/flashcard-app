import { Chooser } from '@ionic-native/chooser';
import { IonContent } from '@ionic/react';
import React, { useEffect, useState } from 'react';
// import GooglePicker from 'react-google-picker';
import './MobilePicker.scss';

interface MobilePickerProps {}

export const MobilePicker: React.FC<MobilePickerProps> = () => {
	const [link, setLink] = useState(null);

	useEffect(() => {
		const c = Chooser.getFile('application/vnd.google-apps.spreadsheet');
		c.then((v) => {
			if (v) {
				setLink(v.uri);
			}
			console.log(v);
		});
	}, []);
	return (
		<IonContent>
			<a href={link}> HERE </a>
		</IonContent>
	);
};
