//import { OAuth2Client } from "google-auth-library";
import * as express from "express";
import * as admin from "firebase-admin";
import { google } from "googleapis";
import { asyncRoute } from "./tools";

const config = {
	web: {
		client_id: "145284732434-ujbm8amrgngq2h8lfjnnj6echof0nkd4.apps.googleusercontent.com",
		project_id: "flashcards-1588528687957",
		auth_uri: "https://accounts.google.com/o/oauth2/auth",
		token_uri: "https://oauth2.googleapis.com/token",
		auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
		client_secret: "LqVmsMc5k5vB2izRkyvqsmmj",
	},
};

export const googleapi = asyncRoute(async (req: express.Request, res: express.Response) => {
	const url = req.protocol + "://" + req.get("host") + req.baseUrl;
	const oauth = new google.auth.OAuth2(config.web.client_id, config.web.client_secret, url);
	if (!req.query.code) {
		const scopes = [
			"https://www.googleapis.com/auth/drive.metadata.readonly",
			"https://www.googleapis.com/auth/spreadsheets.readonly",
			"https://www.googleapis.com/auth/userinfo.profile",
		];
		let url = oauth.generateAuthUrl({
			access_type: "offline",
			scope: scopes,
		});
		res.redirect(url);
	} else {
		console.log("Processing code");

		const code: string = req.query.code as string;
		let token = await oauth.getToken(code);
		oauth.setCredentials(token.tokens);

		const oauthInstance = google.oauth2({
			auth: oauth,
			version: "v2",
		});

		let userInfo = (await oauthInstance.userinfo.get()).data;

		if (token.tokens.refresh_token) {
			await admin
				.database()
				.ref("auth/" + userInfo.id + "/refresh")
				.set(token.tokens.refresh_token);
		} else {
			console.log("No refresh token provided");
			let refreshToken = await admin
				.database()
				.ref("auth/" + userInfo.id + "/refresh")
				.once("value");

			Object.assign(token.tokens, { refresh_token: refreshToken.val() });
			oauth.setCredentials(token.tokens);
		}

		res.setHeader("Content-Type", "application/json");
		res.send(await oauth.getAccessToken());
		res.end();
	}
});

export const refreshAccessToken = asyncRoute(async (req, res) => {
	try {
		const oauth = new google.auth.OAuth2(config.web.client_id, config.web.client_secret, req.baseUrl + "/oauth");
		const accessToken = req.query.token as string;
		if (!accessToken) {
			throw new Error("no access token provided");
		}
		const info = await oauth.getTokenInfo(accessToken);
		const refreshToken = await admin
			.database()
			.ref("auth/" + info.user_id + "/refresh")
			.once("value");

		oauth.setCredentials({
			access_token: accessToken,
			refresh_token: refreshToken.val() as string,
		});

		res.setHeader("Content-Type", "application/json");
		res.send(await oauth.getAccessToken());
	} catch (e) {
		console.error(e);
		res.status(400);
		res.setHeader("Content-Type", "application/json");
		res.send({
			type: "error",
			message: e.message,
		});
		res.end();
	}
});

//TODO do i need this?
export const setActive = asyncRoute(async (req, res) => {
	try {
		const oauth = new google.auth.OAuth2(config.web.client_id, config.web.client_secret, req.baseUrl + "/oauth");
		const active = req.query.active as string;
		const accessToken = req.query.code as string;
		const info = await oauth.getTokenInfo(accessToken);

		admin
			.database()
			.ref("auth/" + info.user_id + "/active")
			.set(active === "true");

		res.setHeader("Content-Type", "application/json");
		res.send({
			type: "success",
			active: active === "true",
		});
		res.end();
	} catch (e) {
		console.error(e);
		res.status(400);
		res.setHeader("Content-Type", "application/json");
		res.send({
			type: "error",
			message: e.message,
		});
		res.end();
	}
});
