import * as functions from 'firebase-functions';
import express from "express";

const paymentHook = (req: functions.https.Request, res: express.Response<any>) => {

	let event;

	try {
		event = JSON.parse(req.body);
	} catch(err) {
		res.status(400).send(`Webhook error: ${err.message}`).end();
		return;
	}

	switch(event.type) {
		case 'payment_intent.succeeded':
			const paymentIntent = event.data.object;
			console.log(paymentIntent);
			break;
		default:
			return res.status(400).end();
	}

	res.json({received: true});

}

export default paymentHook;