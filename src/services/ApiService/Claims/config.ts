import {
  DAPPNODE_CLAIM_API,
  DAPPNODE_TOKEN_DISTRIBUTOR,
  UNISWAP_TOKEN_DISTRIBUTOR,
  UNISWAP_UNI_CLAIM_API
} from '@config';
import { ClaimType } from '@types';

export const CLAIM_CONFIG = {
  [ClaimType.UNI]: {
    api: UNISWAP_UNI_CLAIM_API,
    tokenDistributor: UNISWAP_TOKEN_DISTRIBUTOR
  },
  [ClaimType.NODE]: {
    api: DAPPNODE_CLAIM_API,
    tokenDistributor: DAPPNODE_TOKEN_DISTRIBUTOR
  }
};
