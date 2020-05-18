import { IonButton, IonContent, IonTitle } from '@ionic/react';
import React from 'react';
import Confetti from 'react-confetti';
import './PaymentSuccess.scss';

interface PaymentSuccessProps {}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = (props) => {
	// const { width, height } = useWindowSize();

	return (
		<IonContent>
			<Confetti />
			<IonTitle
				style={{
					fontSize: '20vw',
				}}
			>
				Wooooo
			</IonTitle>
			<IonTitle
				style={{
					fontSize: '7vw',
					wordWrap: 'break-word',
				}}
			>
				Thank you for your support
			</IonTitle>
			<IonButton routerLink="/select">Return to home</IonButton>
		</IonContent>
	);
};
