import { AppState } from 'features/reducers';

const getGas = (state: AppState) => state.gas;

export const getEstimates = (state: AppState) => getGas(state).estimates;
export const getIsEstimating = (state: AppState) => getGas(state).isEstimating;
