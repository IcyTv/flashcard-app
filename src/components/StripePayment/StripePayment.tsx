import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import './StripePayment.scss';
import PaymentPage from '../../pages/PaymentPage';

interface StripePaymentProps {}

const StripePayment: React.FC<StripePaymentProps> = () => {
	const stripe = loadStripe('pk_test_NC8FxNLuu9MRuXwjlJPsecEj00Xu8EddV5');

	return (
		<Elements stripe={stripe}>
			{/* <CreditCardPage /> */}
			<PaymentPage />
		</Elements>
	);
};

export default StripePayment;
