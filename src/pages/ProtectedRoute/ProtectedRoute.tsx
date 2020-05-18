/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/typedef */
import React from 'react';
import './ProtectedRoute.scss';
import { useSelector } from 'react-redux';

import { Redirect, Route, RouteProps } from 'react-router-dom';
import { isLoaded, isEmpty } from 'react-redux-firebase';

export const ProtectedRoute: React.FC<{ children: JSX.Element; [x: string]: any } & RouteProps> = ({
    children,
    ...rest
}) => {
    const auth = useSelector((state) => (state as any).firebase.auth);
    return (
        <Route
            {...rest}
            render={({ location }): JSX.Element =>
                isLoaded(auth) && !isEmpty(auth) ? (
                    children
                ) : (
                    <Redirect to={{ pathname: '/login', state: { from: location } }} />
                )
            }
        ></Route>
    );
};
