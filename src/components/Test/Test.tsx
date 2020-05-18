import { IonContent } from '@ionic/react';
import React from 'react';
import AdUnit from '../AdUnit';
import ListItem from '../ListItem';
import StyledList from '../StyledList';
import './Test.scss';

// import "@types/gapi.client.sheets";

interface TestProps {}

export const Test: React.FC<TestProps> = (props) => {
	return (
		<IonContent>
			<AdUnit />
			<StyledList>
				<ListItem>Test</ListItem>
				<ListItem>Test</ListItem>
			</StyledList>
		</IonContent>
	);
};
