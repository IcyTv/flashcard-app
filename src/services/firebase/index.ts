import firebase from 'firebase/app';
// import "firebase/analytics";
import 'firebase/firestore';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyA4KzXo_KtFruElIAlAfvM2ulNyqiuPpds',
	authDomain: 'flashcards.icytv.de',
	databaseURL: 'https://flashcards-1588528687957.firebaseio.com',
	projectId: 'flashcards-1588528687957',
	storageBucket: 'flashcards-1588528687957.appspot.com',
	messagingSenderId: '145284732434',
	appId: '1:145284732434:web:a12cf43bf534a7246a6acb',
	measurementId: 'G-9SPSXMWG7G',
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
auth.useDeviceLanguage();
export const analytics = firebase.analytics();
analytics.setAnalyticsCollectionEnabled(process.env.NODE_ENV !== 'development');

export const firestore = firebase.firestore();
firestore.enablePersistence({
	synchronizeTabs: true,
});
export default firebase;
