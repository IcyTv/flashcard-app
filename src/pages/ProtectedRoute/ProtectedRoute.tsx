/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/typedef */
import React from 'react';
import './ProtectedRoute.scss';
import { useSelector } from 'react-redux';

import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import { parse } from 'query-string';
import { useNetwork } from '../../services/network';

export const ProtectedRoute: React.FC<{ children: JSX.Element; [x: string]: any } & RouteProps> = ({
	children,
	...rest
}) => {
	const location = useLocation();
	const auth = useSelector((state: ReduxState) => state.firebase.auth);
	const isRedirected = parse(location.search).oauthToken;
	const online = useNetwork();
	return (
		<Route
			{...rest}
			render={({ location }): JSX.Element =>
				(isLoaded(auth) || isRedirected || !online) && (!isEmpty(auth) || isRedirected || !online) ? (
					children
				) : (
					<Redirect to={{ pathname: '/login', state: { from: location } }} />
				)
			}
		></Route>
	);
};
