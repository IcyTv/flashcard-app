/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IonButton, IonContent, IonIcon, IonList, isPlatform, IonItem } from '@ionic/react';
import { useStripe } from '@stripe/react-stripe-js';
import { cardOutline } from 'ionicons/icons';
import React from 'react';
import { useSelector } from 'react-redux';
import { Loading } from '../../components/Loading/Loading';
import './PaymentPage.scss';
import PaypalButton from '../../components/PaypalButton';

interface PaymentPageProps {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const PaymentPage: React.FC<PaymentPageProps> = (_props: PaymentPageProps) => {
	// const stripeProm = loadStripe('pk_test_NC8FxNLuu9MRuXwjlJPsecEj00Xu8EddV5');

	const stripe = useStripe();

	const fbauth = useSelector((state: ReduxState) => state.firebase.auth);

	console.log(stripe);

	if (!stripe) {
		return <Loading>Loading payment providers</Loading>;
	}

	const onCreditCardLifetime = (): void => {
		(stripe as any)
			.redirectToCheckout({
				successUrl: isPlatform('mobile') ? 'flashcards://payment/success' : window.location.href + '/success',
				cancelUrl: isPlatform('mobile') ? 'flashcards://payment/cancel' : window.location.href + '/cancel',
				clientReferenceId: fbauth.uid,
				mode: 'payment',
				lineItems: [{ price: 'price_HHEJmxh6wovNVZ', quantity: 1 }],
				customerEmail: fbauth.emailVerified ? fbauth.email : undefined,
			})
			.then((err) => {
				console.log('redirect');
				console.error(err);
			});
	};

	const onCreditCardSubscribe = (): void => {
		(stripe as any).redirectToCheckout({
			successUrl: isPlatform('mobile') ? 'flashcards://payment/success' : window.location.href + '/success',
			cancelUrl: isPlatform('mobile') ? 'flashcards://payment/cancel' : window.location.href + '/cancel',
			clientReferenceId: fbauth.uid,
			mode: 'subscription',
			lineItems: [{ price: 'price_HHEJDWhXQC9E2k', quantity: 1 }],
			customerEmail: fbauth.emailVerified ? fbauth.email : undefined,
		});
	};

	return (
		<>
			<IonContent>
				Currently not implemented, but thank you for your interest in supporting me
				{/* <IonList lines="none">
					<IonItem>
						<IonButton onClick={onCreditCardLifetime}>
							<IonIcon icon={cardOutline} />
							Lifetime - 15€
						</IonButton>
						<PaypalButton />
					</IonItem>
					<IonButton onClick={onCreditCardSubscribe}>
						<IonIcon icon={cardOutline} />
						Subscribe - 4€/year
					</IonButton>
				</IonList> */}
			</IonContent>
		</>
	);
};
