import React, { useState, useEffect } from 'react';
import { IonContent, IonIcon } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import { FileChooser } from '@ionic-native/file-chooser';
import { Chooser } from '@ionic-native/chooser';
// import GooglePicker from 'react-google-picker';

import './MobilePicker.scss';
import { useSelector } from 'react-redux';

interface MobilePickerProps {}

export const MobilePicker: React.FC<MobilePickerProps> = (props) => {
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
