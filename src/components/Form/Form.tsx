import React from 'react';
import './Form.scss';
import { IonButton } from '@ionic/react';

interface FormProps {
	onSubmit: (ev: React.FormEvent<HTMLFormElement>) => void;
	fields: {
		name: string;
		value: string;
		type?: string;
		onBlur?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
		onChange?: (ev: React.FocusEvent<HTMLInputElement>) => void;
		onFocus?: (ev: React.FocusEvent<HTMLInputElement>) => void;
		required?: boolean;
		pattern?: string;
	}[];
}

export const Form: React.FC<FormProps> = (props: FormProps) => {
	return (
		<form className="form-collection" onSubmit={props.onSubmit}>
			{props.fields.map((v) => {
				return [
					<label key={v.name + '-label'} htmlFor={v.name + '-form'}>
						{v.name}
					</label>,
					<input
						placeholder={v.value}
						onChange={v.onChange}
						onBlur={v.onBlur}
						type={v.type || 'text'}
						key={v.name}
						name={v.name}
						onFocus={v.onFocus}
						className="form-inp"
						required={v.required !== undefined ? v.required : true}
						pattern={v.pattern}
					/>,
				];
			})}
			<br />
			<IonButton type="submit">Submit</IonButton>
		</form>
	);
};
