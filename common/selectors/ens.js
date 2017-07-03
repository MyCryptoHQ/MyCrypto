// @flow
import type { State } from 'reducers';

export function getEnsAddress(state: State, ensName: string): ?string {
    return state.ens[ensName];
}
