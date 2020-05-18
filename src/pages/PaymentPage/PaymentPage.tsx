import { IonButton, IonContent, IonIcon, IonList, isPlatform } from '@ionic/react';
import { useStripe } from '@stripe/react-stripe-js';
import { cardOutline } from 'ionicons/icons';
import React from 'react';
import { useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { PayPalButton } from 'react-paypal-button-v2';
import { Loading } from '../../components/Loading/Loading';
import './PaymentPage.scss';
import { InAppPurchase } from '@ionic-native/in-app-purchase';

interface PaymentPageProps {}

export const PaymentPage: React.FC<PaymentPageProps> = (props) => {
	// const stripeProm = loadStripe('pk_test_NC8FxNLuu9MRuXwjlJPsecEj00Xu8EddV5');

	const stripe = useStripe();

	const fbauth = useSelector((state: ReduxState) => state.firebase.auth);

	console.log(stripe);

	if (!stripe) {
		return <Loading>Loading payment providers</Loading>;
	}

	const onCreditCardLifetime = () => {
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

	const onCreditCardSubscribe = () => {
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
				<IonList lines="none">
					{/* <IonButton routerLink="/payment/creditcard" routerDirection="forward">
						<IonIcon icon={cardOutline} />
						Credit card
					</IonButton> */}
					<IonButton onClick={onCreditCardLifetime}>
						<IonIcon icon={cardOutline} />
						Lifetime - 15€
					</IonButton>
					<IonButton onClick={onCreditCardSubscribe}>
						<IonIcon icon={cardOutline} />
						Subscribe - 4€/year
					</IonButton>
					{/* <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
						<input type="hidden" name="cmd" value="_s-xclick" />
						<input type="hidden" name="hosted_button_id" value="DLXEUXCGJZ2C8" />
						<input
							type="image"
							src="https://www.paypalobjects.com/en_US/DE/i/btn/btn_paynowCC_LG.gif"
							style={{ border: '0' }}
							name="submit"
							alt="PayPal - The safer, easier way to pay online!"
						/>
						<img
							alt=""
							style={{ border: '0' }}
							src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
							width="1"
							height="1"
						/>
					</form> */}

					{/* <PayPalButton amount="15" shippingPreference="GET_FROM_FILE">
						Lifetime
					</PayPalButton> */}
				</IonList>
			</IonContent>
		</>
	);
};
