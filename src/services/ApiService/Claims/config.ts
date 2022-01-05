import {
  DAPPNODE_CLAIM_API,
  DAPPNODE_TOKEN_DISTRIBUTOR,
  ENS_CLAIM_API,
  ENS_TOKEN_DISTRIBUTOR,
  GIV_CLAIM_API,
  GIV_TOKEN_DISTRIBUTOR,
  UNISWAP_TOKEN_DISTRIBUTOR,
  UNISWAP_UNI_CLAIM_API
} from '@config';
import { ClaimType, NetworkId } from '@types';
import { bigify, hexlify } from '@utils';

interface ClaimConfig {
  // Base URL
  api: string;
  // Contract Address
  tokenDistributor: string;
  network: NetworkId;
  // In case the amounts need extra processing
  processAmount?(hex: string): string;
}

export const CLAIM_CONFIG: Record<ClaimType, ClaimConfig> = {
  [ClaimType.UNI]: {
    api: UNISWAP_UNI_CLAIM_API,
    tokenDistributor: UNISWAP_TOKEN_DISTRIBUTOR,
    network: 'Ethereum'
  },
  [ClaimType.NODE]: {
    api: DAPPNODE_CLAIM_API,
    tokenDistributor: DAPPNODE_TOKEN_DISTRIBUTOR,
    network: 'Ethereum'
  },
  [ClaimType.ENS]: {
    api: ENS_CLAIM_API,
    tokenDistributor: ENS_TOKEN_DISTRIBUTOR,
    network: 'Ethereum'
  },
  [ClaimType.GIV]: {
    api: GIV_CLAIM_API,
    tokenDistributor: GIV_TOKEN_DISTRIBUTOR,
    network: 'xDAI',
    processAmount: (hex) => hexlify(bigify(hex).div(10))
  }
};
