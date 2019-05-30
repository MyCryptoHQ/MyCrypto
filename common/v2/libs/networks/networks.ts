import { getCache } from 'v2/services/LocalCache';
import { NetworkOptions } from 'v2/services/NetworkOptions/types';
import { SecureWalletName, InsecureWalletName } from 'config/data';
import * as types from './types';
import { WalletName } from 'v2/features/Wallets/types';
import { NodeOptions } from 'v2/services/NodeOptions/types';

export const getAllNetworks = () => {
  return Object.values(getCache().networkOptions);
};

export const getNetworkByChainId = (chainId: string): NetworkOptions | undefined => {
  const networks = getAllNetworks() || [];
  return networks.find((network: NetworkOptions) => network.chainId === parseInt(chainId, 16));
};

export const getNetworkByName = (name: string): NetworkOptions | undefined => {
  const networks = getAllNetworks() || [];
  return networks.find((network: NetworkOptions) => network.name === name);
};

export const isWalletFormatSupportedOnNetwork = (
  network: NetworkOptions,
  format: WalletName
): boolean => {
  const chainId = network ? network.chainId : 0;

  const CHECK_FORMATS: types.DPathFormat[] = [
    SecureWalletName.LEDGER_NANO_S,
    SecureWalletName.TREZOR,
    SecureWalletName.SAFE_T,
    InsecureWalletName.MNEMONIC_PHRASE
  ];

  const isHDFormat = (f: string): f is types.DPathFormat =>
    CHECK_FORMATS.includes(f as types.DPathFormat);

  // Ensure DPath's are found
  if (isHDFormat(format)) {
    if (!network) {
      return false;
    }
    const dPath: DPath | undefined = network.dPathFormats && network.dPathFormats[format];
    return !!dPath;
  }

  // Parity signer on RSK
  if ((chainId === 30 || chainId === 31) && format === SecureWalletName.PARITY_SIGNER) {
    return false;
  }

  // All other wallet formats are supported
  return true;
};

export const getAllNodes = () => {
  return Object.values(getCache().nodeOptions);
};

export const getNodeByName = (name: string): NodeOptions | undefined => {
  const nodes = getAllNodes() || [];
  return nodes.find((node: NodeOptions) => node.name === name);
};
