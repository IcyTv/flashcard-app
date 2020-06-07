// import { FirebaseX } from '@ionic-native/firebase-x';
import { isPlatform } from '@ionic/core';
import { fromError } from 'stacktrace-js';

const formatErr = (msg: string, line?: number, col?: number, source?: string): string => {
	return `${source ? '' : source}${line ? (col ? '(' + line + ':' + col + ')' : '(' + line + ')') : ''}${
		source || line ? ' : ' : ''
	}${msg}`;
};

export const error = async (
	msg: string,
	trace?: Error,
	line?: number,
	col?: number,
	source?: string,
): Promise<void> => {
	if (isPlatform('mobile')) {
		let stacktrace = null;
		const fmsg = formatErr(msg, line, col, source);
		if (trace) {
			stacktrace = await fromError(trace);
		}
		console.error(fmsg, stacktrace);
		// FirebaseX.logError(fmsg, stacktrace);
	} else {
		console.error(msg, trace);
	}
};

export const overrideOnError = (): void => {
	window.onerror = async (ev, source, line, col, error): Promise<void> => {
		if (isPlatform('mobile')) {
			const trace = await fromError(error);
			const msg = `${error.name} (${source}:[${line}:${col}]) - ${error.message}`;
			console.error(msg);
			// FirebaseX.logError(msg, trace);
		}
	};
};
