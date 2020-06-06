import React from 'react';
import '../../theme/variables.scss';
import { Loading } from '../Loading/Loading';
import './StoreLoading.scss';

interface StoreLoadingProps {}

export const StoreLoading: React.FC<StoreLoadingProps> = () => {
	return <Loading>Loading store</Loading>;
};
