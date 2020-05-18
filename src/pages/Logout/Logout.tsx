/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IonContent, IonTitle } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import { Redirect } from 'react-router';
import { analytics, auth } from '../../services/firebase';
import './Logout.scss';

export const Logout: React.FC = () => {
    const [redirect, setRedirect] = useState(false);
    const [errors, setErrors] = useState<any>();
    const store = useStore();

    useEffect(() => {
        analytics.setCurrentScreen('create_screen');
    }, []);

    if (redirect) {
        return <Redirect to="/login" />;
    }

    if (errors) {
        return (
            <IonContent>
                <IonTitle color="danger">{'' + errors}</IonTitle>
            </IonContent>
        );
    }
    return <IonContent></IonContent>;
};
