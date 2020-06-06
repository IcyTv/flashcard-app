import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ccValid from 'card-validator';
import classname from 'classnames';
import './CreditCardForm.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import SyncLoader from 'react-spinners/SyncLoader';

interface CreditCardForms {
	number: string;
	name: string;
	expiry: string;
	cvc: string;
}
interface CreditCardFormProps {
	handleSubmit: (ev: CreditCardForms) => void;
	handleInputChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
	handleInputFocus: (ev: React.FocusEvent<HTMLInputElement>) => void;
}

const validate = (val: string): boolean => {
	console.log(ccValid.number(val.replace(' ', '')));
	return ccValid.number(val.replace(' ', '')).isPotentiallyValid;
};

const validateFocusLost = (name: string, val: string): boolean => {
	if (name === 'number') {
		console.log(ccValid.number(val));
		return ccValid.number(val.replace(' ', '')).isValid;
	} else if (name === 'cvc') {
		if (val.length == 3) {
			return ccValid.cvv(val).isValid;
		}
		return ccValid.cvv(val, 4).isValid;
	} else if (name === 'expiry') {
		return ccValid.expirationDate(val).isValid;
	} else {
		return true;
	}
};

const validateCVV = (val: string): boolean => {
	console.log(ccValid.cvv(val, 4));
	return ccValid.cvv(val, 4).isPotentiallyValid;
};

const validateExpiration = (val: string): boolean => {
	console.log(ccValid.expirationDate(val));
	return ccValid.expirationDate(val).isPotentiallyValid;
};

export const CreditCardForm: React.FC<CreditCardFormProps> = (props: CreditCardFormProps) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const onSubmit = (ev: { cvc: string; expiry: string; name: string; number: string }): void => {
		setSubmitting(true);
		console.log(ev);
		props.handleSubmit(ev);
	};

	const renderError = (error: boolean, message: string): JSX.Element => {
		if (error) {
			return <p className="error">{message}</p>;
		} else {
			return null;
		}
	};

	const { register, handleSubmit, errors, triggerValidation, getValues, setError, clearError } = useForm();

	const onChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
		triggerValidation(ev.target.name);
		props.handleInputChange(ev);
	};
	const onBlur = (ev: React.FocusEvent<HTMLInputElement>): void => {
		const values = getValues();
		if (!validateFocusLost(ev.target.name, values[ev.target.name])) {
			setError(ev.target.name, ev.target.name + ' is invalid!');
		} else {
			clearError(ev.target.name);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="form-group">
				<input
					type="tel"
					name="number"
					className={classname('form-control', errors.number ? 'is-invalid' : null)}
					placeholder="Card Number"
					pattern="[\d| ]{16,22}"
					required
					onChange={onChange}
					onBlur={onBlur}
					onFocus={props.handleInputFocus}
					ref={register({
						required: true,
						// pattern: /[\d| ]{16,22}/g,
						validate: validate,
					})}
				/>
				{renderError(errors.number, 'Credit card number is invalid')}
				<small>E.g.: 49..., 51..., 36..., 37...</small>
			</div>
			<div className="form-group">
				<input
					type="text"
					name="name"
					className={classname('form-control')}
					placeholder="Name"
					required
					onChange={onChange}
					onFocus={props.handleInputFocus}
					ref={register({
						required: true,
					})}
				/>
				{renderError(errors.name, 'Name is required')}
			</div>
			<div className="row">
				<div className="col-6">
					<input
						type="tel"
						name="expiry"
						className={classname('form-control', errors.expiry ? 'is-invalid' : null)}
						placeholder="Valid Thru"
						pattern="\d\d/\d\d"
						required
						onChange={onChange}
						onBlur={onBlur}
						onFocus={props.handleInputFocus}
						ref={register({
							required: true,
							validate: validateExpiration,
						})}
					/>
					{renderError(errors.expiry, 'Expiry date is invalid')}
				</div>
				<div className="col-6">
					<input
						type="tel"
						name="cvc"
						className={classname('form-control', errors.cvc ? 'is-invalid' : null)}
						placeholder="CVC"
						pattern="\d{3,4}"
						required
						onChange={onChange}
						onBlur={onBlur}
						onFocus={props.handleInputFocus}
						ref={register({
							required: true,
							validate: validateCVV,
						})}
					/>
					{renderError(errors.cvc, 'CVC is invalid')}
				</div>
			</div>
			<div className="form-actions">
				<button className="btn btn-primary btn-block" disabled={isSubmitting} hidden={isSubmitting}>
					PAY
				</button>
				{isSubmitting && <SyncLoader color="var(--ion-color-warning)"></SyncLoader>}
			</div>
		</form>
	);
};
