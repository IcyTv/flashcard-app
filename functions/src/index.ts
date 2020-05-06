import * as cors from "cors";
import * as express from "express";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { googleapi, refreshAccessToken } from "./googleapi";
import { protectedRoute } from "./tools";

// const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp();
const app = express();

app.use(cors({ origin: true }));

app.use("/auth", googleapi);

app.use("/refresh", protectedRoute(refreshAccessToken));

// app.use("/", (req, res) => res.send("Hello"));

export const googleAuth = functions.region("europe-west1").https.onRequest(app);

// export const deleteOldItems = functions.pubsub.schedule("0 0 1,16 * *").onRun((context) => {
// 	const ref = admin.database().ref("auth");
// 	const now = Date.now();
// 	const cutoff = now - 15552000000; // 6 Months
// 	const oldItemsQuery = ref.orderByChild("timestamp").endAt(cutoff);
// 	return oldItemsQuery.once("value", function (snapshot) {
// 		// create a map with all children that need to be removed
// 		var updates = {};
// 		snapshot.forEach(function (child) {
// 			updates[child.key] = null;
// 		});
// 		// execute all updates in one go and return the result to end the function
// 		return ref.update(updates);
// 	});
// });
