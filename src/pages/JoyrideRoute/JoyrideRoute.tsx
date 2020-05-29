import { isPlatform, menuController } from '@ionic/core';
import React, { useState } from 'react';
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS, Step } from 'react-joyride';
import { useHistory } from 'react-router';
import SelectSheet from '../SelectSheet';
import './JoyrideRoute.scss';

interface JoyrideRouteProps {}

//VARS REMOVED BY UGLIFIER
const MENU_INDEX = 0;

const steps: Step[] = [
	{
		content: <h2>Let&apos;s start the tour</h2>,
		placement: 'center',
		target: 'body',
		title: 'Flashcards App Tour',
		showSkipButton: true,
	},
	{
		content: <h2>This is the menu</h2>,
		placement: 'right',
		target: 'ion-menu ion-header',
	}, //TODO Add menu items
	{
		content: (
			<div>
				<h4>This is your network status</h4>
				<p>Be aware that without premium, you only have 2 downloads</p>
			</div>
		),
		target: 'ion-icon.connected',
	},
	{
		content: (
			<div>
				<h3>Select your google sheet here</h3>
			</div>
		),
		placement: 'bottom',
		target: '.step-1 ion-list ion-button',
		title: 'Flashcards App Tour',
		placementBeacon: 'top',
	},
	{
		content: (
			<>
				<h3>Add new sheets</h3>
				<span>
					<p color="red">Warning: </p>
					<p>Right now, the app is only using the first worksheet</p>
				</span>
			</>
		),
		target: 'ion-button.new-sheet',
		placement: 'top',
	},
	{
		content: (
			<div>
				<h1>End</h1>
				<p>Have fun</p>
			</div>
		),
		target: 'body',
		placement: 'center',
	},
];

const toggleMenu = async (open: boolean): Promise<void> => {
	const menu = await menuController.get('first');
	if (open) {
		await menu.open(true);
	} else {
		await menu.close(true);
	}
	console.log('Toggle');
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const JoyrideRoute: React.FC<JoyrideRouteProps> = (_props: JoyrideRouteProps) => {
	const [sHidden, setSHidden] = useState(true);
	const [run, setRun] = useState(true);
	const [stepIndex, setStepIndex] = useState(0);

	const history = useHistory();

	const handleJoyrideCallback = (ev: CallBackProps): void => {
		const { action, index, type, status } = ev;
		if (status === STATUS.FINISHED) {
			// Need to set our running state to false, so we can restart if we click start again.
			// this.setState({ run: false });
			// setRun(false);
			console.log('Finished');
			history.push('/select');
		} else if (status === STATUS.SKIPPED) {
			setStepIndex(steps.length - 1);
			setRun(true);
			history.push('/select');
		} else if (type === EVENTS.STEP_BEFORE && index === 0) {
			setSHidden(false);
		} else if (type === EVENTS.STEP_AFTER) {
			// this.setState({ run: false, loading: true });
			if (index === MENU_INDEX && action === ACTIONS.NEXT) {
				toggleMenu(true).then(() => {
					setStepIndex(index + 1);
				});
			} else if (index >= MENU_INDEX + 1) {
				toggleMenu(false).then(() => {
					setStepIndex(index + 1);
				});
			} else {
				setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
			}
		} else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
			// Update state to advance the tour
			// this.setState({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
			setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
		} else if (type === EVENTS.TOOLTIP_CLOSE) {
			// this.setState({ stepIndex: index + 1 });
			// setStepIndex(index + 1);
			console.log('close');
		} else if (type === EVENTS.TOUR_END) {
			console.log('end');
			// history.goBack();
			history.push('/select');
		}
	};
	return (
		<>
			<SelectSheet
				className="step-1"
				hidden={sHidden}
				predefinedSheets={[
					{ name: 'English German Vocabulary', id: '' + Math.floor(Math.random() * Math.pow(10, 9)) },
					{ name: 'Chemistry Elements', id: '' + Math.floor(Math.random() * Math.pow(10, 9)) },
				]}
			/>
			<Joyride
				steps={steps}
				callback={handleJoyrideCallback}
				run={run}
				stepIndex={stepIndex}
				disableOverlayClose
				hideBackButton
				showSkipButton
				spotlightClicks
				showProgress
				continuous
			/>
		</>
	);
};
