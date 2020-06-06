/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useState } from 'react';
import { Loading } from '../Loading/Loading';
import './GooglePayButton.scss';

interface GooglePayButtonProps {
	amount: number;
	id: string;
	subscription?: boolean;
}

const stripe = {
	gateway: 'stripe',
	'stripe:version': '22018-10-31',
	'stripe:publishableKey': 'pk_test_NC8FxNLuu9MRuXwjlJPsecEj00Xu8EddV5',
};

const PayPalPaymentMethod: any = {
	type: 'PAYPAL',
	parameters: {
		purchase_context: {
			purchase_units: [
				{
					payee: {
						merchant_id: '6MVU7QLV4MT3U',
					},
				},
			],
		},
	},
	tokenizationSpecification: {
		type: 'DIRECT',
	},
};

const tokenizationSpecification = {
	type: 'PAYMENT_GATEWAY',
	parameters: stripe,
};

const allowedCardNetworks = ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA'];
const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];
const baseCardPaymentMethod = {
	type: 'CARD',
	parameters: {
		allowedAuthMethods: allowedCardAuthMethods,
		allowedCardNetworks: allowedCardNetworks,
	},
};
const baseRequest = {
	apiVersion: 2,
	apiVersionMinor: 0,
};

export const GooglePayButton: React.FC<GooglePayButtonProps> = (props: GooglePayButtonProps) => {
	const [loaded, setLoaded] = useState(false);

	if (!window.google && !window.google.payments && !loaded) {
		document.getElementById('gpay-scr').addEventListener('load', () => {
			setLoaded(true);
		});
		return <Loading>Loading payment provider</Loading>;
	}

	const client = new google.payments.api.PaymentsClient({
		environment: 'TEST',
		merchantInfo: {
			merchantId: '01234567890123456789',
			merchantName: 'IcyTv',
		},
	});

	const cardPaymentMethod = Object.assign(
		{ tokenizationSpecification: tokenizationSpecification },
		baseCardPaymentMethod,
	);
	const isReadyToPayRequest: any = Object.assign({}, baseRequest);
	isReadyToPayRequest.allowedPaymentMethods = [baseCardPaymentMethod, PayPalPaymentMethod];

	const transactionInfo: google.payments.api.TransactionInfo = {
		totalPriceStatus: 'FINAL',
		totalPrice: props.amount.toString(),
		currencyCode: 'EUR',
		countryCode: 'DE',
	};

	const merchantInfo = {
		merchantName: 'IcyTv',
		merchantId: '01234567890123456789',
	};
	const allowedPaymentMethods = [PayPalPaymentMethod, cardPaymentMethod]; //[cardPaymentMethod, PayPalPaymentMethod];

	const paymentDataRequest: google.payments.api.PaymentDataRequest = Object.assign({}, baseRequest, {
		merchantInfo: merchantInfo,
		transactionInfo: transactionInfo,
		allowedPaymentMethods: allowedPaymentMethods,
	});
	console.log(paymentDataRequest);

	const onButtonClicked = (): void => {
		client
			.loadPaymentData(paymentDataRequest)
			.then((val) => {
				console.log(val);
				const token = val.paymentMethodData.tokenizationData.token;
				console.log(token);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	client
		.isReadyToPay(isReadyToPayRequest)
		.then((val) => {
			console.log(val);
			return new Promise((resolve) => {
				resolve(
					client.createButton({
						onClick: onButtonClicked,
					}),
				);
			});
		})
		.then((btn: any) => {
			document.getElementById(props.id).appendChild(btn);
		})
		.catch((err) => {
			console.error(err);
		});

	return <div id={props.id}></div>;
};
