import { useState, useEffect } from 'react';

export const useAwait = <T>(func: (...args: unknown[]) => Promise<T>, ...args: unknown[]): T => {
	const [callback, setCallback] = useState(null);
	func(args).then((v) => {
		setCallback(v);
	});
	return callback;
};

export const useAsyncEffect = (func: () => unknown, deps?: React.DependencyList): void => {
	useEffect(() => {
		func();
		// eslint-disable-next-line
	}, deps.concat(func));
};
