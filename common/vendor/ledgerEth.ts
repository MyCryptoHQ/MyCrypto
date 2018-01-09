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

// MEW - Require u2f instead of expecting it in global scope
import u2f from './u2f-api';

export default class LedgerEth {
  public comm;
  constructor(comm: any) {
    this.comm = comm;
    // comm.setScrambleKey('w0w');
  }

  //MEW - Add error handling method
  public getError = err => {
    return err.errorCode ? u2f.getErrorByCode(err.errorCode) : err;
  };

  public splitPath = path => {
    const result: number[] = [];
    const components = path.split('/');
    components.forEach(element => {
      let num = parseInt(element, 10);
      if (isNaN(num)) {
        return;
      }
      if (element.length > 1 && element[element.length - 1] === "'") {
        num += 0x80000000;
      }
      result.push(num);
    });
    return result;
  };

  // callback is function(response, error)
  public getAddress = (path, callback, boolDisplay, boolChaincode) => {
    const splitPath = this.splitPath(path);
    const buffer = new Buffer(5 + 1 + splitPath.length * 4);
    buffer[0] = 0xe0;
    buffer[1] = 0x02;
    buffer[2] = boolDisplay ? 0x01 : 0x00;
    buffer[3] = boolChaincode ? 0x01 : 0x00;
    buffer[4] = 1 + splitPath.length * 4;
    buffer[5] = splitPath.length;
    splitPath.forEach((element, index) => {
      buffer.writeUInt32BE(element, 6 + 4 * index);
    });
    const localCallback = (response, error) => {
      if (typeof error !== 'undefined') {
        callback(undefined, error);
      } else {
        const result: { [name: string]: string | null } = {
          publicKey: null,
          address: null,
          chainCode: null
        };
        response = new Buffer(response, 'hex');
        const sw = response.readUInt16BE(response.length - 2);
        if (sw !== 0x9000) {
          callback(
            undefined,
            'Invalid status ' +
              sw.toString(16) +
              '. Check to make sure the right application is selected ?'
          );
          return;
        }
        const publicKeyLength = response[0];
        const addressLength = response[1 + publicKeyLength];
        result.publicKey = response.slice(1, 1 + publicKeyLength).toString('hex');
        result.address =
          '0x' +
          response
            .slice(1 + publicKeyLength + 1, 1 + publicKeyLength + 1 + addressLength)
            .toString('ascii');
        if (boolChaincode) {
          result.chainCode = response
            .slice(
              1 + publicKeyLength + 1 + addressLength,
              1 + publicKeyLength + 1 + addressLength + 32
            )
            .toString('hex');
        }
        callback(result);
      }
    };
    this.comm.exchange(buffer.toString('hex'), localCallback);
  };

  // callback is function(response, error)
  public signTransaction = function(path, rawTxHex, callback) {
    const splitPath = this.splitPath(path);
    let offset = 0;
    const rawTx = new Buffer(rawTxHex, 'hex');
    const apdus: string[] = [];
    while (offset !== rawTx.length) {
      const maxChunkSize = offset === 0 ? 150 - 1 - splitPath.length * 4 : 150;
      const chunkSize = offset + maxChunkSize > rawTx.length ? rawTx.length - offset : maxChunkSize;
      const buffer = new Buffer(
        offset === 0 ? 5 + 1 + splitPath.length * 4 + chunkSize : 5 + chunkSize
      );
      buffer[0] = 0xe0;
      buffer[1] = 0x04;
      buffer[2] = offset === 0 ? 0x00 : 0x80;
      buffer[3] = 0x00;
      buffer[4] = offset === 0 ? 1 + splitPath.length * 4 + chunkSize : chunkSize;
      if (offset === 0) {
        buffer[5] = splitPath.length;
        splitPath.forEach((element, index) => {
          buffer.writeUInt32BE(element, 6 + 4 * index);
        });
        rawTx.copy(buffer, 6 + 4 * splitPath.length, offset, offset + chunkSize);
      } else {
        rawTx.copy(buffer, 5, offset, offset + chunkSize);
      }
      apdus.push(buffer.toString('hex'));
      offset += chunkSize;
    }
    const localCallback = (response, error) => {
      if (typeof error !== 'undefined') {
        callback(undefined, error);
      } else {
        response = new Buffer(response, 'hex');
        const sw = response.readUInt16BE(response.length - 2);
        if (sw !== 0x9000) {
          callback(
            undefined,
            'Invalid status ' + sw.toString(16) + '. Check to make sure contract data is on ?'
          );
          return;
        }
        if (apdus.length === 0) {
          const result: { [name: string]: number | null } = { v: null, r: null, s: null };
          result.v = response.slice(0, 1).toString('hex');
          result.r = response.slice(1, 1 + 32).toString('hex');
          result.s = response.slice(1 + 32, 1 + 32 + 32).toString('hex');
          callback(result);
        } else {
          this.comm.exchange(apdus.shift(), localCallback);
        }
      }
    };
    this.comm.exchange(apdus.shift(), localCallback);
  };

  // callback is function(response, error)
  public getAppConfiguration = function(callback) {
    const buffer = new Buffer(5);
    buffer[0] = 0xe0;
    buffer[1] = 0x06;
    buffer[2] = 0x00;
    buffer[3] = 0x00;
    buffer[4] = 0x00;
    const localCallback = (response, error) => {
      if (typeof error !== 'undefined') {
        callback(undefined, error);
      } else {
        response = new Buffer(response, 'hex');
        const result: { [name: string]: string | null } = {
          arbitraryDataEnabled: null,
          version: null
        };
        const sw = response.readUInt16BE(response.length - 2);
        if (sw !== 0x9000) {
          callback(
            undefined,
            'Invalid status ' +
              sw.toString(16) +
              '. Check to make sure the right application is selected ?'
          );
          return;
        }
        result.arbitraryDataEnabled = response[0] + 0x01;
        result.version = '' + response[1] + '.' + response[2] + '.' + response[3];
        callback(result);
      }
    };
    this.comm.exchange(buffer.toString('hex'), localCallback);
  };

  public signPersonalMessageAsync = function(path, messageHex, callback) {
    let offset = 0;
    const splitPath = this.splitPath(path);
    const message = new Buffer(messageHex, 'hex');
    const apdus: string[] = [];
    while (offset !== message.length) {
      const maxChunkSize = offset === 0 ? 150 - 1 - splitPath.length * 4 - 4 : 150;
      const chunkSize =
        offset + maxChunkSize > message.length ? message.length - offset : maxChunkSize;
      const buffer = new Buffer(
        offset === 0 ? 5 + 1 + splitPath.length * 4 + 4 + chunkSize : 5 + chunkSize
      );
      buffer[0] = 0xe0;
      buffer[1] = 0x08;
      buffer[2] = offset === 0 ? 0x00 : 0x80;
      buffer[3] = 0x00;
      buffer[4] = offset === 0 ? 1 + splitPath.length * 4 + 4 + chunkSize : chunkSize;
      if (offset === 0) {
        buffer[5] = splitPath.length;
        splitPath.forEach((element, index) => {
          buffer.writeUInt32BE(element, 6 + 4 * index);
        });
        buffer.writeUInt32BE(message.length, 6 + 4 * splitPath.length);
        message.copy(buffer, 6 + 4 * splitPath.length + 4, offset, offset + chunkSize);
      } else {
        message.copy(buffer, 5, offset, offset + chunkSize);
      }
      apdus.push(buffer.toString('hex'));
      offset += chunkSize;
    }
    const localCallback = (response, error) => {
      if (typeof error !== 'undefined') {
        callback(undefined, error);
      } else {
        response = new Buffer(response, 'hex');
        const sw = response.readUInt16BE(response.length - 2);
        if (sw !== 0x9000) {
          callback(
            undefined,
            'Invalid status ' +
              sw.toString(16) +
              '. Check to make sure the right application is selected ?'
          );
          return;
        }
        if (apdus.length === 0) {
          const result: { [name: string]: string | null } = { v: null, r: null, s: null };
          result.v = response.slice(0, 1).toString('hex');
          result.r = response.slice(1, 1 + 32).toString('hex');
          result.s = response.slice(1 + 32, 1 + 32 + 32).toString('hex');
          callback(result);
        } else {
          this.comm.exchange(apdus.shift(), localCallback);
        }
      }
    };
    this.comm.exchange(apdus.shift(), localCallback);
  };
}
