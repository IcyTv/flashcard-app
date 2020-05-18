import { useEffect, useState } from 'react';
import { Network } from '@ionic-native/network';

export const useNetwork = (): boolean => {
	const [online, setOnline] = useState(Network.type !== 'none');
	useEffect(() => {
		Network.onChange().subscribe((v) => {
			if (v === 'none') {
				setOnline(false);
			} else {
				setOnline(true);
			}
		});
	});
	return online && !window.networkDev;
};
