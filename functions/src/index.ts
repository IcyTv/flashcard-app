/* eslint-disable @typescript-eslint/no-require-imports */
import cors from 'cors';
import express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as Sentry from "@sentry/node";
import { googleapi, refreshAccessToken } from './googleapi';
import paymentHook from './payment';
// import { protectedRoute } from "./tools";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('./serviceAccountKey.json');

// const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://flashcards-1588528687957.firebaseio.com',
});


Sentry.init({
	dsn: 'https://4d92290421964df3bc443a8b8fba723b@o403798.ingest.sentry.io/5266816',
	attachStacktrace: true,
	environment: process.env.NODE_ENV || "production",  
});

console.log(process.cwd());

const app = express();

app.use(Sentry.Handlers.requestHandler({
	user: true,
	request: true,
}))

app.use(Sentry.Handlers.errorHandler())

app.use(cors({ origin: true, preflightContinue: true }));

app.use('/api/auth', googleapi);

app.use('/api/refresh', refreshAccessToken);

// app.use("/", (req, res) => res.send("Hello"));

export const googleAuth = functions.region('us-central1').https.onRequest(app);
export const payment = functions.https.onRequest(paymentHook);