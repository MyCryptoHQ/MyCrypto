import { EnclaveMethods, EnclaveMethodParams, EnclaveResponse } from 'shared/enclave/types';
import { PROTOCOL_NAME } from 'shared/enclave/utils';

export function makeRequest<T>(type: EnclaveMethods, params: EnclaveMethodParams): Promise<T> {
  return fetch(`${PROTOCOL_NAME}://${type}`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
    .then(res => res.json())
    .then((res: EnclaveResponse<T>) => {
      const { error, data } = res;
      if (data) {
        return data;
      }
      throw new Error(error!.message || 'Unknown response from server');
    });
}
