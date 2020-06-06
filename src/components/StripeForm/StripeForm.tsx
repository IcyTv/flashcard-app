/* eslint-disable @typescript-eslint/no-explicit-any */
import { useElements, useStripe } from '@stripe/react-stripe-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Loading } from '../Loading/Loading';
import './StripeForm.scss';

interface StripeFormProps {
	handleInputChange: (name: string) => (ev: any) => void;
	handleInputFocus: (name: string) => (ev: React.FocusEvent<any>) => void;
}

export const StripeForm: React.FC<StripeFormProps> = (props: StripeFormProps) => {
	const stripe = useStripe();
	const elements = useElements();

	const [cardRef, setCardRef] = useState(null);
	const [cardExpiryRef, setCardExpiryRef] = useState(null);
	const [cardCvvRef, setCardCvvRef] = useState(null);

	useEffect(() => {
		if (!cardRef) return;
		console.log('creating stripe components');
		elements
			.create('cardNumber', {
				placeholder: 'Card number',
			})
			.on('change', props.handleInputChange('number'))
			.mount(cardRef);
		elements.create('cardExpiry').mount(cardExpiryRef);
		elements.create('cardCvc').mount(cardCvvRef);
	}, [cardRef]);

	if (!stripe) {
		return <Loading>Loading payment provider</Loading>;
	}

	return (
		<form className="form-group">
			<div
				className="form-control"
				onChange={props.handleInputChange('number')}
				onFocus={props.handleInputFocus('number')}
				ref={(ref): void => setCardRef(ref)}
			></div>
			<div className="row">
				<div className="col-6">
					<div className="form-control" ref={(ref): void => setCardExpiryRef(ref)}></div>
				</div>
				<div className="col-6">
					<div
						className="form-control"
						onFocus={props.handleInputFocus('cvv')}
						ref={(ref): void => setCardCvvRef(ref)}
					></div>
				</div>
			</div>
		</form>
	);
};
