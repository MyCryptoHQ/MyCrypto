import {
  NetworkConfig,
  NetworkContract,
  NodeConfig,
  CustomNodeConfig,
  CustomNetworkConfig,
  Token,
  NetworkKeys,
  WalletName,
  SecureWalletName,
  InsecureWalletName,
  NETWORKS,
  DPathFormats
} from 'config';
import { INode } from 'libs/nodes/INode';
import { AppState } from 'reducers';
import { getUnit } from 'selectors/transaction/meta';
import { isEtherUnit } from 'libs/units';
import { SHAPESHIFT_TOKEN_WHITELIST } from 'api/shapeshift';
import { DPath } from 'config/dpaths';
import sortedUniq from 'lodash/sortedUniq';

export function getNode(state: AppState): string {
  return state.config.nodeSelection;
}

type PathType = keyof DPathFormats;

export function getPaths(pathType: PathType): DPath[] {
  const paths: DPath[] = [];
  Object.values(NETWORKS).forEach(networkConfig => {
    const path = networkConfig.dPathFormats ? networkConfig.dPathFormats[pathType] : [];
    if (!Array.isArray(path)) {
      paths.push(path);
    } else {
      paths.concat(path);
    }
  });
  return sortedUniq(paths);
}

type SingleDPathFormat = SecureWalletName.TREZOR | SecureWalletName.LEDGER_NANO_S;

export function getSingleDPathValue(format: SingleDPathFormat, network: NetworkKeys) {
  const dPathFormats = NETWORKS[network].dPathFormats;
  return dPathFormats ? dPathFormats[format].value : null;
}

type AnyDPathFormat =
  | SecureWalletName.TREZOR
  | SecureWalletName.LEDGER_NANO_S
  | InsecureWalletName.MNEMONIC_PHRASE;

export function getAnyDPath(format: AnyDPathFormat, network: NetworkKeys) {
  const dPathFormats = NETWORKS[network].dPathFormats;

  return dPathFormats ? dPathFormats[format] : null;
}

export function isSupportedWalletFormat(format: WalletName, network: NetworkKeys): boolean {
  const CHECK_FORMATS: AnyDPathFormat[] = [
    SecureWalletName.LEDGER_NANO_S,
    SecureWalletName.TREZOR,
    InsecureWalletName.MNEMONIC_PHRASE
  ];

  const validWalletFormat = (f: string): f is AnyDPathFormat =>
    CHECK_FORMATS.includes(f as AnyDPathFormat);

  if (validWalletFormat(format)) {
    return !!getAnyDPath(format, network);
  }

  if (format === SecureWalletName.WEB3) {
    if (network !== 'ETH') {
      // TODO -- determine if we can select testnets via MetaMask
      return false;
    }
  }
  return true;
}

export function getIsWeb3Node(state: AppState): boolean {
  return getNode(state) === 'web3';
}

export function getNodeConfig(state: AppState): NodeConfig {
  return state.config.node;
}

export function getNodeLib(state: AppState): INode {
  return getNodeConfig(state).lib;
}

export function getNetworkConfig(state: AppState): NetworkConfig {
  return state.config.network;
}

export function getNetworkContracts(state: AppState): NetworkContract[] | null {
  const network = getNetworkConfig(state);
  return network ? network.contracts : [];
}

export function getNetworkTokens(state: AppState): Token[] {
  const network = getNetworkConfig(state);
  return network ? network.tokens : [];
}

export function getAllTokens(state: AppState): Token[] {
  const networkTokens = getNetworkTokens(state);
  return networkTokens.concat(state.customTokens);
}

export function getSelectedTokenContractAddress(state: AppState): string {
  const allTokens = getAllTokens(state);
  const currentUnit = getUnit(state);

  if (currentUnit === 'ether') {
    return '';
  }

  return allTokens.reduce((tokenAddr, tokenInfo) => {
    if (tokenAddr && tokenAddr.length) {
      return tokenAddr;
    }

    if (tokenInfo.symbol === currentUnit) {
      return tokenInfo.address;
    }

    return tokenAddr;
  }, '');
}

export function tokenExists(state: AppState, token: string): boolean {
  const existInWhitelist = SHAPESHIFT_TOKEN_WHITELIST.includes(token);
  const existsInNetwork = !!getAllTokens(state).find(t => t.symbol === token);
  return existsInNetwork || existInWhitelist;
}

export function getLanguageSelection(state: AppState): string {
  return state.config.languageSelection;
}

export function getCustomNodeConfigs(state: AppState): CustomNodeConfig[] {
  return state.config.customNodes;
}

export function getCustomNetworkConfigs(state: AppState): CustomNetworkConfig[] {
  return state.config.customNetworks;
}

export function getOffline(state: AppState): boolean {
  return state.config.offline;
}

export function getAutoGasLimitEnabled(state: AppState): boolean {
  return state.config.autoGasLimit;
}

export function isSupportedUnit(state: AppState, unit: string) {
  const isToken: boolean = tokenExists(state, unit);
  const isEther: boolean = isEtherUnit(unit);
  if (!isToken && !isEther) {
    return false;
  }
  return true;
}
