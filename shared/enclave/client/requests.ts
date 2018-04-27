import EventEmitter from 'events';
import { EnclaveEvents, EventParams, RpcEvent, RpcRequest } from 'shared/enclave/types';
import { idGeneratorFactory } from 'shared/enclave/utils';

let isListening = false;
const ee = new EventEmitter();
const genId = idGeneratorFactory();
const resEventPrefix = 'enclave-response:';

export function listenForResponses() {
  if (isListening) {
    return;
  }
  isListening = true;

  window.addEventListener('message', ev => {
    // Only take in messages from preload
    if (ev.origin !== window.location.origin) {
      return;
    }
    try {
      const response = JSON.parse(ev.data);
      if (response && response.isResponse && response.id) {
        ee.emit(`${resEventPrefix}${response.id}`, response as RpcEvent);
      }
    } catch (err) {
      // no-op, not meant for us
    }
  });
}

export function makeRequest(type: EnclaveEvents, params: EventParams): RpcRequest {
  const id = genId();
  const req: RpcRequest = {
    id,
    type,
    params,
    isRequest: true
  };
  window.postMessage(JSON.stringify(req), window.location.origin);
  return req;
}

export function makeRequestExpectingResponse<T>(
  type: EnclaveEvents,
  params: EventParams,
  timeout: number = 10000
): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = makeRequest(type, params);
    const eventName = `${resEventPrefix}${req.id}`;
    console.log('Listening for', eventName);

    ee.once(eventName, (res: RpcEvent<T>) => {
      if (res.payload) {
        resolve(res.payload);
      } else if (res.errMsg) {
        reject(new Error(res.errMsg));
      }
    });

    setTimeout(() => {
      ee.removeAllListeners(eventName);
      reject(new Error('Request timed out'));
    }, timeout);
  });
}
