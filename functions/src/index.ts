/* eslint-disable @typescript-eslint/no-require-imports */
import cors from 'cors';
import express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
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

console.log(process.cwd());

const app = express();

app.use(cors({ origin: true, preflightContinue: true }));

app.use('/api/auth', googleapi);

app.use('/api/refresh', refreshAccessToken);

// app.use("/", (req, res) => res.send("Hello"));

export const googleAuth = functions.region('us-central1').https.onRequest(app);
export const payment = functions.https.onRequest(paymentHook);