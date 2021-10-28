import mockAxios from 'jest-mock-axios';

import { getUUID } from '@utils';

import { PoapClaimService } from '.';

describe('PoapClaim', () => {
  afterEach(() => {
    mockAxios.reset();
  });
  it('claim returns claim data', async () => {
    const promise = PoapClaimService.claim('foo');
    expect(mockAxios.post).toHaveBeenCalledWith('', { uniqueId: getUUID('foo') });
    const data = { success: true, claim: 'bar' };
    mockAxios.mockResponse({ data });
    const result = await promise;
    expect(result).toBe(data);
  });
});
