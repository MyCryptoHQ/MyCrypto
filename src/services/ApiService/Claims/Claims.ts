import { AxiosInstance } from 'axios';
import { toChecksumAddress } from 'ethereumjs-util';

import { UNISWAP_UNI_CLAIM_API } from '@config/data';
import { ApiService } from '@services/ApiService';
import { ProviderHandler } from '@services/EthService';
import { UniDistributor } from '@services/EthService/contracts';
import { ClaimResult, ClaimState, ClaimType, Network, TAddress } from '@types';
import { mapAsync } from '@utils/asyncFilter';

import { CLAIM_CONFIG } from './config';
import { Claim, Response } from './types';

let instantiated = false;

export default class ClaimsService {
  public static instance = new ClaimsService();

  private service: AxiosInstance = ApiService.generateInstance({
    baseURL: UNISWAP_UNI_CLAIM_API,
    timeout: 20000
  });

  constructor() {
    if (instantiated) {
      throw new Error(`ClaimsService has already been instantiated.`);
    } else {
      instantiated = true;
    }
  }

  public getClaims(type: ClaimType, addresses: TAddress[]) {
    return this.service
      .post(
        '',
        {
          addresses: addresses.map((a) => toChecksumAddress(a))
        },
        { baseURL: CLAIM_CONFIG[type].api }
      )
      .then((res) => res.data)
      .then(({ claims }: Response) => {
        return claims;
      })
      .catch((err) => {
        console.debug('[Claims]: Get Claims failed: ', err);
        return null;
      });
  }

  public isClaimed(
    network: Network,
    type: ClaimType,
    claims: Record<string, Claim | null>
  ): Promise<ClaimResult[]> {
    const provider = new ProviderHandler(network);
    return mapAsync(Object.entries(claims), async ([address, claim]) => {
      if (claim !== null) {
        const claimed = await provider
          .call({
            to: CLAIM_CONFIG[type].tokenDistributor,
            data: UniDistributor.isClaimed.encodeInput({ index: claim.Index })
          })
          .then((data) => UniDistributor.isClaimed.decodeOutput(data))
          .then(({ claimed }) => claimed);
        const config = CLAIM_CONFIG[type];
        const amount = config.processAmount ? config.processAmount(claim.Amount) : claim.Amount;
        return {
          address,
          state: claimed ? ClaimState.CLAIMED : ClaimState.UNCLAIMED,
          amount,
          index: claim.Index
        };
      }
      return { address, state: ClaimState.NO_CLAIM, amount: '0x00' };
    });
  }
}
