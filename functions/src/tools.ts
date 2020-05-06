import * as express from "express";
import * as admin from "firebase-admin";

const asyncRoute = (route: (req: express.Request, res: express.Response) => void) => (
	req: express.Request,
	res: express.Response,
	next = console.error
) => Promise.resolve(route(req, res)).catch(next);

const protectedRoute = (route: (req: express.Request, res: express.Response) => void) => async (
	req: express.Request,
	res: express.Response
) => {
	const tokenId = req.get("Autorization")?.split("Bearer ")[1];
	try {
		await admin.auth().verifyIdToken(tokenId!);
		route(req, res);
	} catch (e) {
		console.log("Authentication failiure on " + req.url);
		res.setHeader("Content-Type", "application/json");
		res.send({
			type: "error",
			message: e.message,
		});
		res.end();
	}
};

export { asyncRoute, protectedRoute };
