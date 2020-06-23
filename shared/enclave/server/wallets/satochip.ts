import { WalletLib } from 'shared/enclave/types';
import BN from 'bn.js';
import EthTx, { TxObj } from 'ethereumjs-tx';
import { addHexPrefix, toBuffer, sha3, hashPersonalMessage } from 'ethereumjs-util';
import mapValues from 'lodash/mapValues';

const WebSocket = require('isomorphic-ws');

export class SatochipSession {
  public static resolveMap: Map<number, any>;
  public static requestID: number;
  public static isConnected: boolean;
  public static ws: WebSocket;
  public static reconnectInterval: number;
  public static connect: any;
}

SatochipSession.isConnected = false;
SatochipSession.requestID = 0;
SatochipSession.resolveMap = new Map();
SatochipSession.reconnectInterval = (1 * 1000 * 60) / 4;
SatochipSession.connect = () => {
  console.log('Satochip: /shared/enclave/server/wallets/satochip.ts: connect()');

  return new Promise(resolve => {
    if (!SatochipSession.isConnected) {
      SatochipSession.ws = new WebSocket('ws://localhost:8000/');

      SatochipSession.ws.onopen = function open() {
        console.log('connected');
        SatochipSession.isConnected = true;
        const msg: any = { requestID: SatochipSession.requestID++, action: 'get_status' };
        const data: string = JSON.stringify(msg);

        SatochipSession.ws.send(data);
        console.log('Request:' + data);
        resolve(SatochipSession.ws);
      };

      SatochipSession.ws.onmessage = function incoming(data: any) {
        console.log('in /shared/enclave/server/wallets/satochip.ts'); //debugSatochip
        console.log('ONMESSAGE: message received!');
        //console.log('TYPEOF DATA:' + typeof data); // typeof data: object
        //console.log('TYPEOF DATA.DATA:' + typeof data.data); // typeof data.data: string
        console.log('Reply:' + data.data); // should be string

        const response = JSON.parse(data.data);
        console.log('Reply JSON:', response);
        console.log('Reply requestID:', response.requestID);
        //console.log('Assert: resolveMap is a Map?'); //true
        //console.log(SatochipSession.resolveMap instanceof Map);

        try {
          console.log(
            'Assert: resolveMap has key: ' +
              response.requestID +
              '?' +
              SatochipSession.resolveMap.has(response.requestID)
          );
          if (SatochipSession.resolveMap.has(response.requestID)) {
            console.log(
              'typeof(resolveMap.get()):' +
                typeof SatochipSession.resolveMap.get(response.requestID)
            );
            SatochipSession.resolveMap.get(response.requestID)(response);
            SatochipSession.resolveMap.delete(response.requestID);
          }
        } catch (error) {
          console.error(error);
        }
      };

      SatochipSession.ws.onclose = function close(event) {
        console.log('disconnected with code:' + event.code);
        SatochipSession.isConnected = false;
        setTimeout(SatochipSession.connect, SatochipSession.reconnectInterval);
      };

      SatochipSession.ws.onerror = function error() {
        console.log('disconnected with error!');
        SatochipSession.isConnected = false;
      };
    } else {
      resolve(SatochipSession.ws);
    }
  });
}; //end connect()

// start connection as soon as MyCrypto launches
//SatochipSession.connect();

const Satochip: WalletLib = {
  getChainCode(dpath) {
    console.log('Satochip: /shared/enclave/server/wallets/satochip.ts: in getChainCode()'); //debugSatochip
    console.log('Satochip: /shared/enclave/server/wallets/satochip.ts: dpath:' + dpath); //debugSatochip

    return SatochipSession.connect().then((ws: any) => {
      const msg: any = {
        requestID: SatochipSession.requestID++,
        action: 'get_chaincode',
        path: dpath
      };
      const request: string = JSON.stringify(msg);

      return new Promise(resolve => {
        //const ccr= {} as ChainCodeResponse;
        // send request to device and keep a ref of the resolve function in a map
        const response = new Promise(resolve2 => {
          console.log('Satochip: resolveMap.size - before:' + SatochipSession.resolveMap.size);
          SatochipSession.resolveMap.set(msg.requestID, resolve2);
          //SatochipSession.ws.send(request);
          ws.send(request);
          console.log('Satochip: request sent:' + request);
          //console.log('Satochip: typeof(resolve2):' + typeof resolve2); // resolve2:function
          console.log('Satochip: resolveMap.size - after:' + SatochipSession.resolveMap.size);
        }).then((res: any) => {
          console.log('Satochip: pubkey:' + res.pubkey);
          console.log('Satochip: chaincode:' + res.chaincode);
          resolve({
            publicKey: res.pubkey,
            chainCode: res.chaincode
          });
        });
      });
    });
  },

  async signTransaction(tx, dpath) {
    console.log('Satochip: /shared/enclave/server/wallets/satochip.ts: in signTransaction()');
    console.log('Satochip: dpath:' + dpath);
    if (!SatochipSession.isConnected) {
      SatochipSession.connect();
    }

    const { chainId, ...strTx } = tx;
    const signedTx = new EthTx({
      ...strTx,
      v: toBuffer(chainId), //v: chainId,
      r: toBuffer(0),
      s: toBuffer(0)
    });
    console.log('Satochip: tx:' + signedTx.toJSON());
    console.log('Satochip: chainId:' + chainId);
    console.log('Satochip: serializedTx: ' + signedTx.serialize().toString('hex'));
    console.log('Satochip: serializedTx hash(false) : ' + signedTx.hash(false).toString('hex'));
    console.log('Satochip: serializedTx hash(true) : ' + signedTx.hash(true).toString('hex'));

    const msg: any = {
      requestID: SatochipSession.requestID++,
      action: 'sign_tx_hash',
      tx: signedTx.serialize().toString('hex'),
      hash: signedTx.hash(true).toString('hex'),
      path: dpath,
      alt: 'etherlike',
      chainid: chainId
    };
    const request: string = JSON.stringify(msg);

    return new Promise(resolve => {
      // send request to device and keep a ref of the resolve function in a map
      const response = new Promise(resolve2 => {
        console.log('Satochip: resolveMap.size - before:' + SatochipSession.resolveMap.size);
        SatochipSession.resolveMap.set(msg.requestID, resolve2);
        SatochipSession.ws.send(request);
        console.log('Satochip: request sent:' + request);
        console.log('Satochip: typeof(resolve2):' + typeof resolve2);
        console.log('Satochip: resolveMap.size - after:' + SatochipSession.resolveMap.size);
      }).then((res: any) => {
        // extracts usefull data from device response and resolve original promise
        console.log('Satochip: reply: v: ' + res.v);
        console.log('Satochip: reply: r: ' + res.r);
        console.log('Satochip: reply: s: ' + res.s);
        try {
          if (parseInt(res.v, 16) <= 1) {
            //if (Number(res.v) <= 1) {
            //  for larger chainId, only signature_v returned. simply recalc signature_v
            res.v = parseInt(res.v, 16) + 2 * chainId + 35; //res.v += 2 * chainId + 35;
          }

          signedTx.v = res.v;
          signedTx.r = Buffer.from(res.r, 'hex');
          signedTx.s = Buffer.from(res.s, 'hex');
          console.log('Satochip: serializedTx TEST2');
          console.log('Satochip: tx:' + signedTx.toJSON());
          console.log('Satochip: txraw:' + signedTx.raw.toString('hex'));
          console.log('Satochip: v:' + signedTx.v);
          console.log('Satochip: r:' + signedTx.r);
          console.log('Satochip: s:' + signedTx.s);
          console.log('Satochip: serializedTx: ' + signedTx.serialize().toString('hex'));
          console.log(
            'Satochip: serializedTx hash(false) : ' + signedTx.hash(false).toString('hex')
          );
          console.log('Satochip: serializedTx hash(true) : ' + signedTx.hash(true).toString('hex'));
          resolve({
            signedTransaction: signedTx.serialize().toString('hex')
          });
        } catch (err) {
          console.log(err);
        }
      });
    });
  },

  async signMessage(msgToSign, keyPath) {
    console.log('Satochip: /shared/enclave/server/wallets/satochip.ts: in signMessage()');
    if (!msgToSign) {
      throw Error('No message to sign');
    }
    if (!SatochipSession.isConnected) {
      SatochipSession.connect();
    }

    const data: any = {
      requestID: SatochipSession.requestID++,
      action: 'sign_msg_hash',
      msg: msgToSign,
      hash: hashPersonalMessage(toBuffer(msgToSign)).toString('hex'),
      path: keyPath,
      alt: 'etherlike'
    };
    const request: string = JSON.stringify(data);

    return new Promise(resolve => {
      // send request to device and keep a ref of the resolve function in a map
      const response = new Promise(resolve2 => {
        SatochipSession.resolveMap.set(data.requestID, resolve2);
        SatochipSession.ws.send(request);
        console.log('Satochip: request sent:' + request);
      }).then((res: any) => {
        // extracts usefull data from device response and resolve original promise
        const r = res.r;
        const s = res.s;
        const v = ('0' + res.v.toString(16)).slice(-2); //padd with '0'
        const combined = addHexPrefix(r + s + v);
        resolve({ signedMessage: combined });
      });
    });
  },

  async displayAddress() {
    //throw new Error('Not yet implemented');
    console.log(
      'Satochip: shared/enclave/server/wallets/Satochip.ts: displayAddress() not implemented'
    );
    return Promise.reject(new Error('displayAddress via Satochip not supported.'));
  }
};

export default Satochip;
