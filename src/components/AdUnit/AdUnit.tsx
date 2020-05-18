import React from 'react';
import './AdUnit.scss';

interface AdUnitProps {}

export const AdUnit: React.FC<AdUnitProps> = (props) => {
	return (
		<div className="ad">
			<amp-ad
				width="100vw"
				height="320"
				type="adsense"
				data-ad-client="ca-pub-8416850325225336"
				data-ad-slot="4828996839"
				data-auto-format="rspv"
				data-full-width=""
				data-adtest="on"
				data-ad-test="on"
				ad-test="on"
				adtest="on"
			>
				<div></div>
			</amp-ad>

			<ins
				className="adsbygoogle"
				style={{
					display: 'inline-block',
					width: '336px',
					height: '280px',
				}}
				data-adtest="on"
				data-ad-client="ca-pub-8416850325225336"
				data-ad-slot="4828996839"
				data-ad-test="on"
				ad-test="on"
			></ins>
			<ins
				className="adsbygoogle"
				style={{ display: 'block' }}
				data-ad-client="ca-pub-8416850325225336"
				data-ad-slot="4828996839"
				data-ad-format="auto"
				data-full-width-responsive="true"
			></ins>
			<amp-auto-ads type="adsense" data-ad-client="ca-pub-8416850325225336"></amp-auto-ads>
			<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
		</div>
	);
};
