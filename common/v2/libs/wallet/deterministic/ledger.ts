import EthTx, { TxObj } from 'ethereumjs-tx';
import { addHexPrefix, toBuffer } from 'ethereumjs-util';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import LedgerEth from '@ledgerhq/hw-app-eth';

import { translateRaw } from 'translations';
import { getTransactionFields } from 'libs/transaction';
import { HardwareWallet, ChainCodeResponse } from './hardware';
import { byContractAddress } from '@ledgerhq/hw-app-eth/erc20';

// Ledger throws a few types of errors
interface U2FError {
  metaData: {
    type: string;
    code: number;
  };
}

interface ErrorWithId {
  id: string;
  message: string;
  name: string;
  stack: string;
}

type LedgerError = U2FError | ErrorWithId | Error | string;

export class LedgerWallet extends HardwareWallet {
  public static async getChainCode(dpath: string): Promise<ChainCodeResponse> {
    return makeApp()
      .then(app => app.getAddress(dpath, false, true))
      .then(res => {
        return {
          publicKey: res.publicKey,
          chainCode: res.chainCode
        };
      })
      .catch((err: LedgerError) => {
        throw new Error(ledgerErrToMessage(err));
      });
  }

  constructor(address: string, dPath: string, index: number) {
    super(address, dPath, index);
  }

  public async signRawTransaction(t: EthTx): Promise<Buffer> {
    const txFields = getTransactionFields(t);
    t.v = toBuffer(t._chainId);
    t.r = toBuffer(0);
    t.s = toBuffer(0);

    try {
      const ethApp = await makeApp();

      if (t.getChainId() === 1) {
        const tokenInfo = byContractAddress(t.to.toString('hex'));
        if (tokenInfo) {
          await ethApp.provideERC20TokenInformation(tokenInfo);
        }
      }

      const result = await ethApp.signTransaction(this.getPath(), t.serialize().toString('hex'));

      let v = result.v;
      if (t._chainId > 0) {
        // EIP155 support. check/recalc signature v value.
        // Please see https://github.com/LedgerHQ/blue-app-eth/commit/8260268b0214810872dabd154b476f5bb859aac0
        // currently, ledger returns only 1-byte truncated signatur_v
        const rv = parseInt(v, 16);
        let cv = t._chainId * 2 + 35; // calculated signature v, without signature bit.
        /* tslint:disable no-bitwise */
        if (rv !== cv && (rv & cv) !== rv) {
          // (rv !== cv) : for v is truncated byte case
          // (rv & cv): make cv to truncated byte
          // (rv & cv) !== rv: signature v bit needed
          cv += 1; // add signature v bit.
        }
        v = cv.toString(16);
      }

      const txToSerialize: TxObj = {
        ...txFields,
        v: addHexPrefix(v),
        r: addHexPrefix(result.r),
        s: addHexPrefix(result.s)
      };

      return new EthTx(txToSerialize).serialize();
    } catch (err) {
      throw Error(err + '. Check to make sure contract data is on');
    }
  }

  public async signMessage(msg: string): Promise<string> {
    if (!msg) {
      throw Error('No message to sign');
    }

    try {
      const msgHex = Buffer.from(msg).toString('hex');
      const ethApp = await makeApp();
      const signed = await ethApp.signPersonalMessage(this.getPath(), msgHex);
      const combined = addHexPrefix(signed.r + signed.s + signed.v.toString(16));
      return combined;
    } catch (err) {
      throw new Error(ledgerErrToMessage(err));
    }
  }

  public async displayAddress() {
    const path = `${this.dPath}/${this.index}`;

    try {
      const ethApp = await makeApp();
      await ethApp.getAddress(path, true, false);
      return true;
    } catch (err) {
      console.error('Failed to display Ledger address:', err);
      return false;
    }
  }

  public getWalletType(): string {
    return translateRaw('X_LEDGER');
  }
}

async function makeApp() {
  const transport = await TransportU2F.create();
  return new LedgerEth(transport);
}

const isU2FError = (err: LedgerError): err is U2FError => !!err && !!(err as U2FError).metaData;
const isStringError = (err: LedgerError): err is string => typeof err === 'string';
const isErrorWithId = (err: LedgerError): err is ErrorWithId =>
  err.hasOwnProperty('id') && err.hasOwnProperty('message');
function ledgerErrToMessage(err: LedgerError) {
  // https://developers.yubico.com/U2F/Libraries/Client_error_codes.html
  if (isU2FError(err)) {
    // Timeout
    if (err.metaData.code === 5) {
      return translateRaw('LEDGER_TIMEOUT');
    }

    return err.metaData.type;
  }

  if (isStringError(err)) {
    // Wrong app logged into
    if (err.includes('6804')) {
      return translateRaw('LEDGER_WRONG_APP');
    }
    // Ledger locked
    if (err.includes('6801')) {
      return translateRaw('LEDGER_LOCKED');
    }

    return err;
  }

  if (isErrorWithId(err)) {
    // Browser doesn't support U2F
    if (err.message.includes('U2F not supported')) {
      return translateRaw('U2F_NOT_SUPPORTED');
    }
  }

  // Other
  return err.toString();
}
