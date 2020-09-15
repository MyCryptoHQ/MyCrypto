import { App, protocol } from 'electron';
import { EnclaveMethodParams, EnclaveMethods, EnclaveResponse } from 'shared/enclave/types';
import { isValidEventType, PROTOCOL_NAME } from 'shared/enclave/utils';

import handlers from './handlers';

export function registerServer(app: App) {
  // Register protocol scheme
  protocol.registerSchemesAsPrivileged([
    {
      scheme: PROTOCOL_NAME,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        corsEnabled: true
      }
    }
  ]);

  app.on('ready', () => {
    // Register custom protocol behavior
    protocol.registerStringProtocol(PROTOCOL_NAME, async (req, cb) => {
      let res: EnclaveResponse;

      try {
        const method = getMethod(req);
        const params = getParams(method, req);
        const data = await handlers[method](params);
        res = { data };
      } catch (err) {
        console.error(`Request to '${req.url}' failed with error:`, err);
        res = {
          error: {
            code: 500,
            type: err.name,
            message: err.message
          }
        };
      }

      cb(JSON.stringify(res));
    });
  });
}

function getMethod(req: Electron.Request): EnclaveMethods {
  const urlSplit = req.url.split(`${PROTOCOL_NAME}://`);

  if (!urlSplit[1]) {
    throw new Error('No method provided');
  }

  const method = urlSplit[1].replace('/', '');
  if (!isValidEventType(method)) {
    throw new Error(`Invalid or unknown method '${method}'`);
  }

  return method;
}

function getParams(method: EnclaveMethods, req: Electron.Request): EnclaveMethodParams {
  const data = req.uploadData.find((d) => !!d.bytes);

  if (!data) {
    throw new Error(`No data provided for '${method}'`);
  }

  try {
    // @todo: Validate params based on provided method
    const params = JSON.parse(data.bytes.toString());
    return params as EnclaveMethodParams;
  } catch (err) {
    throw new Error(`Invalid JSON blob provided for '${method}': ${err.message}`);
  }
}
