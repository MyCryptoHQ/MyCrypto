import { AppState } from 'reducers';

const getSwap = (state: AppState) => state.swap;
export const getOrigin = (state: AppState) => getSwap(state).origin;
export const getPaymentAddress = (state: AppState) => getSwap(state).paymentAddress;
