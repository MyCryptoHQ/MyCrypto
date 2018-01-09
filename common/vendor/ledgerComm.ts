/********************************************************************************
 *   Ledger Communication toolkit
 *   (c) 2016 Ledger
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/

'use strict';

// MEW - Require u2f instead of expecting it in global scope
import u2f from './u2f-api';

export default class LedgerComm {
  public scrambleKey;
  public timeoutSeconds;
  constructor(scrambleKey, timeoutSeconds?) {
    this.scrambleKey = new Buffer(scrambleKey, 'ascii');
    this.timeoutSeconds = timeoutSeconds;
  }

  public wrapApdu = (apdu, key) => {
    const result = new Buffer(apdu.length);
    for (let i = 0; i < apdu.length; i++) {
      // TODO: replace xor bitwise operator (^)
      // tslint:disable-next-line:no-bitwise
      result[i] = apdu[i] ^ key[i % key.length];
    }
    return result;
  };

  // Convert from normal to web-safe, strip trailing "="s
  public webSafe64 = base64 => {
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  // Convert from web-safe to normal, add trailing "="s
  public normal64 = base64 => {
    return (
      base64.replace(/\-/g, '+').replace(/_/g, '/') + '=='.substring(0, (3 * base64.length) % 4)
    );
  };

  public u2fCallback = function(response, callback) {
    if (typeof response.signatureData !== 'undefined') {
      const data = new Buffer(this.normal64(response.signatureData), 'base64');
      callback(data.toString('hex', 5));
    } else {
      callback(undefined, response);
    }
  };

  // callback is function(response, error)
  public exchange = function(apduHex, callback) {
    const apdu = new Buffer(apduHex, 'hex');
    const keyHandle = this.wrapApdu(apdu, this.scrambleKey);
    const challenge = new Buffer(
      '0000000000000000000000000000000000000000000000000000000000000000',
      'hex'
    );
    const key: { [name: string]: any } = {};
    key.version = 'U2F_V2';
    key.keyHandle = this.webSafe64(keyHandle.toString('base64'));
    const localCallback = result => {
      this.u2fCallback(result, callback);
    };
    u2f.sign(
      location.origin,
      this.webSafe64(challenge.toString('base64')),
      [key],
      localCallback,
      this.timeoutSeconds
    );
  };
}
