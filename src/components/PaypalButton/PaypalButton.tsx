import React from 'react';

import './PaypalButton.scss';

interface PaypalButtonProps {}

export const PaypalButton: React.FC<PaypalButtonProps> = (props) => {
	return (
		<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
			<input type="hidden" name="cmd" value="_s-xclick" />
			<input type="hidden" name="hosted_button_id" value="6YRLRMA9UNPC2" />
			<input
				type="image"
				src="https://www.paypalobjects.com/en_US/DE/i/btn/btn_buynowCC_LG.gif"
				style={{ border: 0 }}
				name="submit"
				alt="PayPal - The safer, easier way to pay online!"
			/>
			<img
				alt=""
				style={{ border: 0 }}
				src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
				width="1"
				height="1"
			/>
		</form>
	);
};
