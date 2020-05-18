import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty, isLoaded, useFirebase } from 'react-redux-firebase';
import { Loading } from '../../components/Loading/Loading';
import { refreshToken, wait } from '../../services/firebase/auth';
import './Refresh.scss';

interface RefreshProps {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const url = 'https://europe-west1-flashcards-1588528687957.cloudfunctions.net/googleAuth/refresh?token=';
// "http://localhost:5001/flashcards-1588528687957/europe-west1/googleAuth/refresh?token=";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Refresh: React.FC<RefreshProps> = (_props: RefreshProps) => {
    // const FBauth: Auth = {};//useStore().getState().root.auth;

    const firebase = useFirebase();
    const auth = useSelector((state: ReduxState) => state.firebase.auth);
    const google = useSelector((state: ReduxState) => state.google);

    const [res, setRes] = useState(null);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => wait(firebase, setIsAuth), []);

    if (!isLoaded(auth) || isEmpty(auth) || !isAuth) {
        console.log('Loading');
        return <Loading>Waiting for auth</Loading>;
    }

    if (!res) {
        console.log('Requesting');
        refreshToken(google.accessToken, setRes);
    }
    return <pre>{JSON.stringify(res, null, 4)}</pre>;
};
