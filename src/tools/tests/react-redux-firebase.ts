import reactReduxFb from 'react-redux-firebase';
import firebase from './firebase';

export const mockRRFB = () => {
	const spy = jest.spyOn(reactReduxFb as any, 'useFirebase').mockImplementation(() => {
		return firebase;
	});
	const fsSpy = jest.spyOn(reactReduxFb as any, 'useFirestore').mockImplementation(() => {
		return firebase.firestore();
	});
	return () => {
		spy.mockRestore();
		fsSpy.mockRestore();
	};
};
