/* eslint-disable react/prop-types */
import { IonContent } from '@ionic/react';
import React, { useState } from 'react';
import Cards, { Focused } from 'react-credit-cards';
import StripeForm from '../../components/StripeForm';
import './PaymentPage.scss';

interface CreditCardPageProps {}

interface CreditCardForms {
	number: string;
	name: string;
	expiry: string;
	focus: string;
	cvc: string;
	issuer: string;
}

export const CreditCardPage: React.FC<CreditCardPageProps> = (props) => {
	console.log('Props', props);

	const [creditCard, setInfo] = useState<CreditCardForms>({
		number: '',
		name: '',
		expiry: '',
		focus: '',
		cvc: '',
		issuer: '',
	});
	const [forceRerender, setForceRerender] = useState(0);

	const interv = setInterval(() => {
		if (creditCard.number.length < 14) {
			setInfo(Object.assign(creditCard, { number: creditCard.number + ((Math.random() * 10) % 10) }));
		}
	});

	const handleSubmit = (ev: CreditCardForms): void => {
		console.log(creditCard);
	};

	const handleInputFocus = (name: string) => (e: any): void => {
		setInfo(Object.assign(creditCard, { focus: e.target.name }));
		setForceRerender(forceRerender + 1);
	};

	const handleInputChange = (name: string) => (ev: any): void => {
		// eslint-disable-next-line prefer-const
		console.log(ev);
		const value = '';
		setInfo(Object.assign(creditCard, { [name]: value }));
		setForceRerender(forceRerender + 1);
	};

	const submit = (type: { issuer: string; maxLength: number }, isValid: boolean): void => {
		setInfo(Object.assign(creditCard, { issuer: type.issuer }));
		console.log(type, isValid);
	};

	return (
		<>
			<IonContent>
				<br />
				<Cards
					cvc={creditCard.cvc}
					expiry={creditCard.expiry}
					focused={creditCard.focus as Focused}
					name={creditCard.name}
					number={creditCard.number}
					preview
					callback={submit}
				/>
				{/* <CreditCardForm
					handleInputChange={handleInputChange}
					handleInputFocus={handleInputFocus}
					handleSubmit={handleSubmit}
				/> */}
				<StripeForm handleInputChange={handleInputChange} handleInputFocus={handleInputFocus} />
			</IonContent>
		</>
	);
};
