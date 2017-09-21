import { AppState } from 'reducers';

export function getEnsAddress(state: AppState, ensName: string): null | string {
  return state.ens[ensName];
}
