import { useEffect, useState } from 'react';
import { Network } from '@ionic-native/network';
import { useSelector } from 'react-redux';

export const useNetwork = (): boolean => {
	const [online, setOnline] = useState(Network.type !== 'none');
	const networkDev = useSelector((state: ReduxState) => state.debug.networkDev);
	useEffect(() => {
		Network.onChange().subscribe((v) => {
			if (v === 'none') {
				setOnline(false);
			} else {
				setOnline(true);
			}
		});
	});
	return online && !networkDev;
};
