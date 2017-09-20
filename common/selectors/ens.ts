import { State } from 'reducers';

export function getEnsAddress(state: State, ensName: string): null | string {
  return state.ens[ensName];
}
