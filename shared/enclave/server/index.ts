import handlers from './handlers';
import { isValidEventType } from 'shared/enclave/utils';
import { RpcRequest, RpcEventSuccess, RpcEventFailure, EventResponse } from 'shared/enclave/types';

function processRequest(req: RpcRequest) {
  try {
    const data = handlers[req.type](req.params);
    if (data) {
      respondWithPayload(req, data);
    }
  } catch (err) {
    respondWithError(req, err.toString());
  }
}

function respondWithPayload(req: RpcRequest, payload: EventResponse) {
  const response: RpcEventSuccess = {
    id: req.id,
    isResponse: true,
    errMsg: undefined,
    payload
  };
  window.postMessage(JSON.stringify(response), window.location.origin);
}

function respondWithError(req: RpcRequest, errMsg: string) {
  const response: RpcEventFailure = {
    id: req.id,
    isResponse: true,
    payload: undefined,
    errMsg
  };
  window.postMessage(JSON.stringify(response), window.location.origin);
}

export function registerServer() {
  window.addEventListener('message', (ev: MessageEvent) => {
    // Only take in messages from the webview
    if (ev.origin !== window.location.origin) {
      return;
    }

    try {
      const request = JSON.parse(ev.data);
      if (request && request.isRequest && isValidEventType(request.type)) {
        processRequest(request as RpcRequest);
      }
    } catch (err) {
      // no-op, not meant for us
    }
  });
}
