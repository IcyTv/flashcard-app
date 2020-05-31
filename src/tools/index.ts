import { useState, useEffect } from 'react';

export const useAwait = <T>(func: (...args: any) => Promise<T>, ...args: any): T => {
	const [callback, setCallback] = useState(null);
	func(args).then((v) => {
		setCallback(v);
	});
	return callback;
};

export const useAsyncEffect = (func: () => unknown, deps?: React.DependencyList): void => {
	useEffect(() => {
		func();
	}, deps);
};
