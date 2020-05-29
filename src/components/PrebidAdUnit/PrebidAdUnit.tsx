import React from 'react';
import './PrebidAdUnit.scss';
import { Bling as GPT } from 'react-gpt';
import config from './config.json';
// import 'src/bidders/prebid';

interface PrebidAdUnitProps {}
GPT.enableSingleRequest();

export const PrebidAdUnit: React.FC<PrebidAdUnitProps> = (props) => {
	return (
		<>
			<div id="ad-1">
				<GPT adUnitPath="/4595/nfl.test.open" slotSize={[728, 90]} />
			</div>
			<div id="ad-2">
				<GPT adUnitPath="/4595/nfl.test.open" slotSize={[300, 250]} />
			</div>
		</>
	);
};
