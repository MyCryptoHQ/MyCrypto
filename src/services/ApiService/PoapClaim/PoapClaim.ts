import { POAP_CLAIM_API } from '@config';
import { getUUID } from '@utils';

import { default as ApiService } from '../ApiService';
import { PoapClaimResult } from './types';

export const PoapClaimService = () => {
  const service = ApiService.generateInstance({
    baseURL: POAP_CLAIM_API,
    timeout: 15000
  });

  const claim = async (id: string): Promise<PoapClaimResult | null> => {
    try {
      const { data } = await service.post('', {
        uniqueId: getUUID(id)
      });
      return data;
    } catch (e) {
      console.debug('[PoapClaim]: Claiming POAP failed: ', e);
      return null;
    }
  };

  return { claim };
};

export default PoapClaimService();
