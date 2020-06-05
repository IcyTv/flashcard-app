import { SagaMiddleware } from 'redux-saga';
import { refreshContinually } from '../firebase/redux';

export default (sagaMiddleware: SagaMiddleware, rehydrationComplete: Promise<void>): void => {
	sagaMiddleware.run(refreshContinually(rehydrationComplete));
};
