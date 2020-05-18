import React from 'react';
import { IonContent, IonIcon } from '@ionic/react';

import '../../theme/variables.css';
import './StoreLoading.scss';
import { Loading } from '../Loading/Loading';

interface StoreLoadingProps {}

export const StoreLoading: React.FC<StoreLoadingProps> = (props) => {
	return <Loading>Loading store</Loading>;
};
