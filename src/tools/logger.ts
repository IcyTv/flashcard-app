import { FirebaseX } from '@ionic-native/firebase-x';
import { isPlatform } from '@ionic/core';
import { fromError } from 'stacktrace-js';

export const error = (msg: string, trace?: Error): void => {
	if (isPlatform('mobile')) {
		let stacktrace = null;
		if (trace) {
			fromError(trace).then((trace) => {
				stacktrace = trace;
				FirebaseX.logError(msg, stacktrace);
			});
		} else {
			FirebaseX.logError(msg, stacktrace);
		}
	} else {
		console.error(msg, trace);
	}
};

export const overrideOnError = (): void => {
	window.onerror = async (ev, source, line, col, error): Promise<void> => {
		if (isPlatform('mobile')) {
			const trace = await fromError(error);
			const msg = `${error.name} (${source}:[${line}:${col}]) - ${error.message}`;
			FirebaseX.logError(msg, trace);
		}
	};
};
