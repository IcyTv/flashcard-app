/* eslint-disable @typescript-eslint/camelcase */
//import { OAuth2Client } from "google-auth-library";
import * as express from 'express';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';
import { asyncRoute } from './tools';
// import fetch from "node-fetch";
import IdTokenVer from 'idtoken-verifier';

const config = {
	web: {
		client_id: '145284732434-ujbm8amrgngq2h8lfjnnj6echof0nkd4.apps.googleusercontent.com',
		project_id: 'flashcards-1588528687957',
		auth_uri: 'https://accounts.google.com/o/oauth2/auth',
		token_uri: 'https://oauth2.googleapis.com/token',
		auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
		client_secret: 'LqVmsMc5k5vB2izRkyvqsmmj',
	},
};

export const googleapi = asyncRoute(async (req: express.Request, res: express.Response) => {
	const url = req.protocol + '://' + req.get('host') + '/googleAuth' + req.baseUrl;
	console.log(url);
	let redirectUrl = req.query.redirect_uri as string;
	const state = req.query.state as string;

	const oauth = new google.auth.OAuth2(config.web.client_id, config.web.client_secret, url);

	if (!redirectUrl && !state) {
		res.status(400);
		res.setHeader('Content-Type', 'application/json');
		res.send({
			type: 'error',
			message: 'please provide a valid redirect_uri',
		});
		res.end();
		console.log('no redirect_uri');
		return;
	} else if (state) {
		try {
			redirectUrl = JSON.parse(decodeURI(state)).redirect_uri;
		} catch (e) {
			res.status(400);
			res.setHeader('Content-Type', 'application/json');
			res.send({
				type: 'error',
				message: 'please provide a valid redirect_uri',
			});
			res.end();
		}
	}

	if (!req.query.code) {
		const scopes = [
			'https://www.googleapis.com/auth/drive.file',
			// "https://www.googleapis.com/auth/spreadsheets",
			'https://www.googleapis.com/auth/userinfo.profile',
			// "https://www.googleapis.com/auth/drive.metadata.readonly", //ONLY TEMPORARY, until PICKER is working
		];
		const authUrl = oauth.generateAuthUrl({
			access_type: 'offline',
			scope: scopes,
			state: JSON.stringify({
				redirect_uri: redirectUrl,
			}),
		});
		res.redirect(authUrl);
	} else {
		console.log('Processing code');

		const code: string = req.query.code as string;
		const token = await oauth.getToken(code);
		oauth.setCredentials(token.tokens);

		const oauthInstance = google.oauth2({
			auth: oauth,
			version: 'v2',
		});

		const userInfo = (await oauthInstance.userinfo.get()).data;

		if (token.tokens.refresh_token) {
			await admin
				.database()
				.ref('auth/' + userInfo.id + '/refresh')
				.set(token.tokens.refresh_token);
		} else {
			console.log('No refresh token provided');
			const refreshToken = await admin
				.database()
				.ref('auth/' + userInfo.id + '/refresh')
				.once('value');

			Object.assign(token.tokens, {
				refresh_token: refreshToken.val(),
			});
			oauth.setCredentials(token.tokens);
		}

		res.setHeader('access_token', (await oauth.getAccessToken()).token!);

		console.log('Redirect URI', redirectUrl);

		res.redirect(
			redirectUrl + '?accessToken=' + (await oauth.getAccessToken()).token + '&tokenId=' + token.tokens.id_token,
		);
		res.end();
	}
});

export const refreshAccessToken = asyncRoute(async (req, res) => {
	try {
		const oauth = new google.auth.OAuth2(config.web.client_id, config.web.client_secret, req.baseUrl + '/auth');
		const accessToken = req.query.token as string;
		if (!accessToken) {
			throw new Error('no access token provided');
		}

		// console.log(accessToken);

		// const info = await oauth.getTokenInfo(accessToken);

		// const dec = base64urlDecode(accessToken);
		const verifier = new IdTokenVer();

		const info = verifier.decode(accessToken).payload;
		// console.log("refresh info", info);

		// console.log(info);

		const refreshToken = await admin
			.database()
			.ref('auth/' + info.sub + '/refresh')
			.once('value');

		if (!refreshToken) {
			throw new Error('No refresh token found');
		}

		oauth.setCredentials({
			// access_token: accessToken,
			refresh_token: refreshToken.val() as string,
			token_type: 'Bearer',
			// token_type: info.access_type,
			// expiry_date: info.expiry_date,
		});

		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Content-Type', 'application/json');
		const token = await oauth.getAccessToken();
		console.log('New access Token', token);
		res.send(token.token);
	} catch (e) {
		console.error('Refresh Error at ' + e.lineNumber, e);
		res.status(400);
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Content-Type', 'application/json');
		res.send({
			type: 'error',
			message: e.message,
		});
		res.end();
	}
});
