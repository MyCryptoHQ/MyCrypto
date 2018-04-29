import { EnclaveMethods, EnclaveMethodParams, EnclaveResponse } from 'shared/enclave/types';
import { PROTOCOL_NAME } from 'shared/enclave/utils';

export function makeRequest<T>(type: EnclaveMethods, params: EnclaveMethodParams): Promise<T> {
  return fetch(`${PROTOCOL_NAME}://${type}`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
    .then(res => res.json())
    .then((res: EnclaveResponse<T>) => {
      if (res.error) {
        throw new Error(res.error.message);
      } else if (res.data) {
        return res.data;
      } else {
        throw new Error('Unknown response from server');
      }
    });
}
