// @flow
import type { State } from 'reducers';
import { getChainId } from 'selectors/config';

export function getEnsAddress(state: State, ensName: string): ?string {
  const chainId = getChainId(state);
  return state.ens[chainId] && state.ens[chainId].names[ensName];
}
