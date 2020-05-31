import { ThemeDetection } from '@ionic-native/theme-detection';
import { isPlatform, SelectChangeEventDetail, ToggleChangeEventDetail } from '@ionic/core';
import {
	IonAlert,
	IonAvatar,
	IonCol,
	IonContent,
	IonGrid,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonRow,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToggle,
} from '@ionic/react';
import { powerOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { Option } from 'react-dropdown';
import 'react-dropdown/style.css';
import { useSelector, useStore } from 'react-redux';
import { useHistory } from 'react-router';
import { AnyAction } from 'redux';
import AdvancedSettings from '../../components/AdvancedSettings';
import { setTheme, toggleAdvanced } from '../../services/store/settings';
import { useAwait } from '../../tools';
import { Zoom } from 'react-awesome-reveal';
import './Settings.scss';

interface SettingsProps {}

const options: Option[] = [
	{
		value: 'Dark',
		label: 'Dark mode',
	},
	{
		value: 'Light',
		label: 'Light mode',
	},
	{
		value: 'Auto',
		label: 'Automatically choose theme',
	},
];

export const Settings: React.FC<SettingsProps> = () => {
	const advanced = useSelector((state: ReduxState) => state.settings.advanced);
	const theme = useSelector((state: ReduxState) => state.settings.theme);
	const store = useStore<ReduxState, AnyAction>();
	const history = useHistory();

	const [showAdvancedAlert, setShowAdvancedAlert] = useState(false);

	const avatar = useSelector((state: ReduxState) => state.firebase.auth.photoURL);
	const uName = useSelector((state: ReduxState) => state.firebase.auth.displayName);
	const uEmail = useSelector((state: ReduxState) => state.firebase.auth.email);

	const setAdvanced = (ev: CustomEvent<ToggleChangeEventDetail>): void => {
		if (!advanced) {
			setShowAdvancedAlert(true);
		} else {
			toggleAdvanced(store)(ev.detail.checked);
		}
	};
	const onAdvancedAlertClose = (type: string) => (): void => {
		if (type === 'yes') {
			toggleAdvanced(store)(true);
		}
		setShowAdvancedAlert(false);
	};

	const onThemeChange = (ev: CustomEvent<SelectChangeEventDetail>): void => {
		console.log(ev.detail.value);
		setTheme(store)(ev.detail.value);
	};

	return (
		<IonContent className="settings-page">
			<IonTitle>Settings</IonTitle>
			<IonAlert
				isOpen={showAdvancedAlert}
				header="Advanced Settings"
				message="Are you sure?"
				animated
				buttons={[
					{
						text: 'Yes',
						handler: onAdvancedAlertClose('yes'),
					},
					{
						text: 'No',
					},
				]}
			/>
			<Zoom>
				<IonItem className="profile">
					<IonGrid>
						<IonRow>
							<IonCol size="auto">
								<IonAvatar>
									<img src={avatar} alt="avatar" />
								</IonAvatar>
							</IonCol>
							<IonCol>
								<IonLabel>{uName}</IonLabel>
								<IonLabel>{uEmail}</IonLabel>
							</IonCol>
						</IonRow>
					</IonGrid>
					<IonIcon
						slot="end"
						icon={powerOutline}
						color="danger"
						onClick={(): void => history.push('/logout')}
					/>
				</IonItem>
			</Zoom>

			<Zoom>
				<IonList lines="none">
					<IonItem>
						<IonLabel>Theme</IonLabel>
						<IonSelect value={theme} onIonChange={onThemeChange} interface="popover">
							<IonSelectOption value="light">Light</IonSelectOption>
							<IonSelectOption value="dark">Dark</IonSelectOption>
							<IonSelectOption value="auto">Auto</IonSelectOption>
						</IonSelect>
					</IonItem>
					<IonItem slot="end">
						<IonToggle onIonChange={setAdvanced} checked={advanced} />
						<IonLabel>Advanced Settings</IonLabel>
					</IonItem>
				</IonList>
			</Zoom>
			{advanced && <AdvancedSettings />}
		</IonContent>
	);
};
