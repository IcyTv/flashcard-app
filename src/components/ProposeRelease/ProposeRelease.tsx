import { IonButton, IonLabel, IonModal, IonTitle } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Plugins } from '@capacitor/core';
import './ProposeRelease.scss';
import { useSelector } from 'react-redux';
const { Browser } = Plugins;

// const version = '%%VERSION%%';
const publishedAt = new Date('2020-06-07T15:51:00Z');

interface ProposeReleaseProps {
	onLoad?: () => void;
}

export const ProposeRelease: React.FC<ProposeReleaseProps> = (props: ProposeReleaseProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const preRelease = useSelector((state: ReduxState) => state.settings.preReleases);

	useEffect(() => {
		const func = async (): Promise<void> => {
			const data: { tag_name: string; created_at: string; prerelease: boolean }[] = await (
				await fetch('https://api.github.com/repos/IcyTv/flashcard-app/releases', {
					headers: {
						Authorization: 'token c5990cd4c2a5c9b395e1fac48572887df6a72bbe',
					},
				})
			).json();

			console.log(data);

			const log = (v: unknown): string => {
				console.log(v);
				return v as string;
			};

			const fdata = data
				.filter((v) => !v.prerelease || preRelease)
				.map((v) => v.created_at)
				.map(log)
				.filter((v) => new Date(v) >= publishedAt);
			console.log(fdata);

			if (fdata.length > 0) {
				setIsOpen(true);
			}

			if (props.onLoad) {
				props.onLoad();
			}
		};
		func();
	}, []);

	const install = async (): Promise<void> => {
		const result: {
			created_at: string;
			prerelease: boolean;
			assets: {
				browser_download_url: string;
			}[];
		}[] = await (await fetch('https://api.github.com/repos/IcyTv/flashcard-app/releases')).json();
		console.log(result);
		let max: {
			date: Date;
			url: string;
		} = {
			date: new Date(0),
			url: '',
		};
		for (const s of result) {
			if (new Date(s.created_at) >= max.date && (!s.prerelease || preRelease)) {
				console.log(
					'max',
					s.assets.filter((v) => v.browser_download_url.indexOf('apk') >= 0),
				);
				max = {
					date: new Date(s.created_at),
					url: s.assets.filter((v) => v.browser_download_url.indexOf('apk') >= 0)[0].browser_download_url,
				};
			}
		}
		Browser.open({
			url: max.url,
		});
	};

	return (
		<IonModal isOpen={isOpen}>
			<div>
				<IonTitle>New Release available</IonTitle>
				<IonLabel>Do you want to install?</IonLabel>
				<div>
					<IonButton onClick={install}>Yes</IonButton>
					<IonButton onClick={(): void => setIsOpen(false)}>No</IonButton>
				</div>
			</div>
		</IonModal>
	);
};
