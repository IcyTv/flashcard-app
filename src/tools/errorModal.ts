import SweetAlert from 'sweetalert2';
import * as Sentry from '@sentry/browser';

export const showErrorModal = (
	message?: string,
	error?: Error,
	fatal?: boolean,
	user?: {
		email: string;
		name: string;
	},
): void => {
	const onReport = (): void => {
		console.log('Report');
		Sentry.showReportDialog({
			dsn: 'https://4d92290421964df3bc443a8b8fba723b@o403798.ingest.sentry.io/5266816',
			successMessage: 'Submit',
			title: 'Error Report',
			eventId: '@SentrySdk.LastEventId',
			user: user,
		});
	};

	console.log(error.message);

	SweetAlert.fire({
		title: 'Ooops...',
		text: message || error.message || 'An Error occurred',
		icon: 'error',
		footer: '<a id="error-submit">Submit a report</a>',
		position: fatal ? 'center' : 'top-right',
		timer: fatal ? undefined : 2000,
		width: fatal ? undefined : '20rem',
		showConfirmButton: fatal,
		backdrop: fatal,
		allowOutsideClick: fatal,
		onOpen: (el) => {
			el.querySelector('a#error-submit').addEventListener('click', onReport);
		},
	});
};
