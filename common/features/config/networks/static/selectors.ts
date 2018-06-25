import uniqBy from 'lodash/uniqBy';

import { EXTRA_PATHS } from 'config/dpaths';
import { stripWeb3Network } from 'libs/nodes';
import { StaticNetworkIds } from 'types/network';
import { AppState } from 'features/reducers';
import { PathType } from './types';

function getNetworks(state: AppState) {
  return state.config.networks;
}

export function getStaticNetworkConfigs(state: AppState) {
  return getNetworks(state).staticNetworks;
}

export function isStaticNetworkId(
  state: AppState,
  networkId: string
): networkId is StaticNetworkIds {
  return Object.keys(getStaticNetworkConfigs(state)).includes(stripWeb3Network(networkId));
}

export function getPaths(state: AppState, pathType: PathType): DPath[] {
  const paths = Object.values(getStaticNetworkConfigs(state))
    .reduce((networkPaths: DPath[], { dPathFormats }): DPath[] => {
      if (dPathFormats && dPathFormats[pathType]) {
        return [...networkPaths, dPathFormats[pathType] as DPath];
      }
      return networkPaths;
    }, [])
    .concat(EXTRA_PATHS);
  return uniqBy(paths, p => `${p.label}${p.value}`);
}
