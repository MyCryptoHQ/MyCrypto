import { AxiosInstance } from 'axios';
import { toChecksumAddress } from 'ethereumjs-util';

import { UNISWAP_TOKEN_DISTRIBUTOR, UNISWAP_UNI_CLAIM_API } from '@config/data';
import { ApiService } from '@services/ApiService';
import { ProviderHandler } from '@services/EthService';
import { UniDistributor } from '@services/EthService/contracts';
import { ITxValue, Network, TAddress } from '@types';
import { mapAsync } from '@utils/asyncFilter';

let instantiated = false;

interface Response {
  success: boolean;
  claims: Record<string, UniClaim | null>;
}

interface UniClaim {
  Index: number;
  Amount: ITxValue; // HEX
  // proof: ITxData[]; @todo
  Flags: {
    IsSOCKS: boolean;
    ISLP: boolean;
    IsUser: boolean;
  };
}

export enum ClaimState {
  NO_CLAIM = 'NO_CLAIM',
  UNCLAIMED = 'UNCLAIMED',
  CLAIMED = 'CLAIMED'
}
export interface UniClaimResult {
  address: TAddress;
  state: ClaimState;
  amount: ITxValue;
}

export default class UniswapService {
  public static instance = new UniswapService();

  private service: AxiosInstance = ApiService.generateInstance({
    baseURL: UNISWAP_UNI_CLAIM_API,
    timeout: 10000
  });

  constructor() {
    if (instantiated) {
      throw new Error(`UniswapService has already been instantiated.`);
    } else {
      instantiated = true;
    }
  }

  public getClaims(addresses: TAddress[]) {
    return this.service
      .post('', {
        addresses: addresses.map((a) => toChecksumAddress(a))
      })
      .then((res) => res.data)
      .then(({ claims }: Response) => {
        return claims;
      })
      .catch((err) => {
        console.debug('[UniswapService]: Get Claims failed: ', err);
        return null;
      });
  }

  public isClaimed(
    network: Network,
    claims: Record<string, UniClaim | null>
  ): Promise<UniClaimResult[]> {
    const provider = new ProviderHandler(network);
    return mapAsync(Object.entries(claims), async ([address, claim]) => {
      if (claim !== null) {
        const claimed = await provider
          .call({
            to: UNISWAP_TOKEN_DISTRIBUTOR,
            data: UniDistributor.isClaimed.encodeInput({ index: claim.Index })
          })
          .then((data) => UniDistributor.isClaimed.decodeOutput(data))
          .then(({ claimed }) => claimed);
        return {
          address,
          state: claimed ? ClaimState.CLAIMED : ClaimState.UNCLAIMED,
          amount: claim.Amount
        };
      }
      return { address, state: ClaimState.NO_CLAIM, amount: '0x0' };
    });
  }
}
