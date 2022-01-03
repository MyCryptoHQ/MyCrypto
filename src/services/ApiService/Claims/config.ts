import {
  DAPPNODE_CLAIM_API,
  DAPPNODE_TOKEN_DISTRIBUTOR,
  ENS_CLAIM_API,
  ENS_TOKEN_DISTRIBUTOR,
  GIV_TOKEN_DISTRIBUTOR,
  UNISWAP_TOKEN_DISTRIBUTOR,
  UNISWAP_UNI_CLAIM_API
} from '@config';
import { ClaimType, NetworkId } from '@types';

interface ClaimConfig {
  // Base URL
  api: string;
  // Contract Address
  tokenDistributor: string;
  network: NetworkId;
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
    api: ENS_CLAIM_API, // @todo Change
    tokenDistributor: GIV_TOKEN_DISTRIBUTOR,
    network: 'xDAI'
  }
};
