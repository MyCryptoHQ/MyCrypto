import EthTx, { TxObj } from 'ethereumjs-tx';
import { addHexPrefix, toBuffer } from 'ethereumjs-util';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import LedgerEth from '@ledgerhq/hw-app-eth';

import { translateRaw } from 'translations';
import { getTransactionFields } from 'libs/transaction';
import { HardwareWallet, ChainCodeResponse } from './hardware';

// Ledger throws a few types of errors
interface U2FError {
  metaData: {
    type: string;
    code: number;
  };
}

type LedgerError = U2FError | Error | string;

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
    t.v = Buffer.from([t._chainId]);
    t.r = toBuffer(0);
    t.s = toBuffer(0);

    try {
      const ethApp = await makeApp();
      const result = await ethApp.signTransaction(this.getPath(), t.serialize().toString('hex'));

      const txToSerialize: TxObj = {
        ...txFields,
        v: addHexPrefix(result.v),
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

  // Other
  return err.toString();
}
