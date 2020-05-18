import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Plugins, AppUrlOpen } from '@capacitor/core';
const { App: CapApp } = Plugins;

export const AppUrlListener: React.FC<unknown> = () => {
    const history = useHistory();
    useEffect(() => {
        CapApp.addListener('appUrlOpen', (data: AppUrlOpen) => {
            console.log(data);
            if (data.url.startsWith('flashcards://')) {
                history.push(data.url.replace('flashcards:/', ''));
            }
        });
    }, []);

    return null;
};
