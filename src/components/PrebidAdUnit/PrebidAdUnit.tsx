import React from 'react';
import { Bling as GPT } from 'react-gpt';
import './PrebidAdUnit.scss';
// import 'src/bidders/prebid';

interface PrebidAdUnitProps {}
GPT.enableSingleRequest();

export const PrebidAdUnit: React.FC<PrebidAdUnitProps> = () => {
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
