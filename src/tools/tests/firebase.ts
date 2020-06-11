/* eslint-disable @typescript-eslint/no-empty-function */
import firebase from 'firebase';

type DeepPartial<T> = T extends Function ? T : T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

export const mockFb = (mockCurrentUser?: boolean) => {
	const onAuthStateChanged = jest.fn();

	const getRedirectResult = jest.fn(() => {
		return Promise.resolve({
			user: {
				displayName: 'redirectResultTestDisplayName',
				email: 'redirectTest@test.com',
				emailVerified: true,
			},
		});
	});

	const sendEmailVerification = jest.fn(() => {
		return Promise.resolve('result of sendEmailVerification');
	});

	const sendPasswordResetEmail = jest.fn(() => Promise.resolve());

	const createUserWithEmailAndPassword = jest.fn(() => {
		return Promise.resolve('result of createUserWithEmailAndPassword');
	});

	const signInWithEmailAndPassword = jest.fn(() => {
		return Promise.resolve('result of signInWithEmailAndPassword');
	});

	const signInWithRedirect = jest.fn(() => {
		return Promise.resolve('result of signInWithRedirect');
	});

	const signInWithCredential = jest.fn(
		(cred: string): Promise<DeepPartial<firebase.auth.UserCredential>> => {
			return new Promise((resolve, reject) => {
				resolve({
					credential: {
						providerId: 'google.com',
						signInMethod: 'google',
					},
					additionalUserInfo: {
						isNewUser: true,
					},
					user: {
						uid: '12312312312',
						displayName: 'Test User',
						email: 'test@test.test',
						emailVerified: true,
					},
				});
			});
		},
	);

	const initializeApp = jest.spyOn(firebase as any, 'initializeApp').mockImplementation(() => {
		return {
			auth: () => {
				return {
					createUserWithEmailAndPassword,
					signInWithEmailAndPassword,
					currentUser: {
						sendEmailVerification,
					},
					signInWithRedirect,
					signInWithCredential,
				};
			},
		};
	});

	const spy = jest.spyOn(firebase as any, 'auth').mockImplementation(() => {
		return {
			onAuthStateChanged,
			currentUser: mockCurrentUser
				? {
						displayName: 'testDisplayName',
						email: 'test@test.com',
						emailVerified: true,
				  }
				: undefined,
			getRedirectResult,
			sendPasswordResetEmail,
			signInWithCredential,
		};
	});

	// const collection = jest.spyOn(admin.firestore(), 'collection').mockReturnValue((({ doc } as unknown) as any);

	const firestoreSpy = jest.spyOn(firebase as any, 'firestore').mockImplementation(() => {
		const update = jest.fn();
		const set = jest.fn((data: unknown) => Promise.resolve());
		const doc = jest.fn(() => ({ update, set }));
		return {
			collection: jest.fn().mockReturnValue(({ doc } as unknown) as any),
			doc,
			update,
			set,
		};
	});
	(firebase.auth as any).FacebookAuthProvider = jest.fn(() => {});
	(firebase.auth as any).GoogleAuthProvider = jest.fn(() => {});
	(firebase.auth as any).GoogleAuthProvider.credential = jest.fn((tokenId: string) => tokenId);

	return () => {
		spy.mockRestore();
		firestoreSpy.mockRestore();
	};
};
export default firebase;
