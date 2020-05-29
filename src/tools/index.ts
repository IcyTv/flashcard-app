import { useState } from 'react';

export const useAwait = <T>(func: (...args: any) => Promise<T>, ...args: any): T => {
	const [callback, setCallback] = useState(null);
	func(args).then((v) => {
		setCallback(v);
	});
	return callback;
};
