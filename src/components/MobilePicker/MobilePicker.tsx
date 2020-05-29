import React from 'react';
import { IonContent, IonIcon } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import { FileChooser } from '@ionic-native/file-chooser';
import GooglePicker from 'react-google-picker';

import './MobilePicker.scss';
import { useSelector } from 'react-redux';

interface MobilePickerProps {}

export const MobilePicker: React.FC<MobilePickerProps> = (props) => {
	return (
		<IonContent>
			<input type="file" />
		</IonContent>
	);
};
