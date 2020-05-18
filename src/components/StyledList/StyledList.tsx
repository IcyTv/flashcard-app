import { IonList } from '@ionic/react';
import React from 'react';
import './StyledList.scss';
import { Fade } from 'react-awesome-reveal';

interface StyledListProps {
	children: JSX.Element | JSX.Element[] | string;
	[prop: string]: any;
}

export const StyledList: React.FC<StyledListProps> = (props: StyledListProps) => {
	return (
		<IonList
			className="styled-list ion-justify-content-center ion-align-items-center"
			lines="none"
			{...props.props}
		>
			<Fade>{props.children}</Fade>
		</IonList>
	);
};
