import { SignatureLike } from '@ethersproject/bytes';
import {
  serialize as serializeTransaction,
  UnsignedTransaction
} from '@ethersproject/transactions';
import LedgerEth from '@ledgerhq/hw-app-eth';
import { byContractAddress } from '@ledgerhq/hw-app-eth/erc20';
import Transport from '@ledgerhq/hw-transport';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { addHexPrefix, stripHexPrefix } from 'ethereumjs-util';

import { translateRaw } from '@translations';

import { ChainCodeResponse, HardwareWallet } from './hardware';

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
      .then((app) => app.getAddress(dpath, false, true))
      .then((res) => {
        return {
          publicKey: res.publicKey,
          chainCode: res.chainCode as string
        };
      })
      .catch((err: LedgerError) => {
        throw new Error(ledgerErrToMessage(err));
      });
  }

  constructor(address: string, dPath: string, index: number) {
    super(address, dPath, index);
  }

  public async signRawTransaction(t: UnsignedTransaction): Promise<Buffer> {
    const { to, chainId } = t;

    if (!chainId) {
      throw Error('Missing chainId on tx');
    }

    try {
      const ethApp = await makeApp();

      if (chainId === 1 && to) {
        const tokenInfo = byContractAddress(to);
        if (tokenInfo) {
          await ethApp.provideERC20TokenInformation(tokenInfo);
        }
      }

      const result = await ethApp.signTransaction(
        this.getPath(),
        stripHexPrefix(serializeTransaction(t))
      );

      const signature: SignatureLike = {
        v: parseInt(result.v, 16),
        r: addHexPrefix(result.r),
        s: addHexPrefix(result.s)
      };

      const serializedTx = serializeTransaction(t, signature);

      return Buffer.from(stripHexPrefix(serializedTx), 'hex');
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
      // @ts-expect-error: There is a type mismatch between Signature and how we use it. @todo: resolve conflicts.
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

const getTransport = async (): Promise<Transport<any>> => {
  try {
    // @todo - fix this import
    // if (await TransportWebHID.isSupported()) {
    //   return TransportWebHID.create();
    // }

    if (await TransportWebUSB.isSupported()) {
      return TransportWebUSB.create();
    }
  } catch {
    // Fallback to U2F
  }

  return TransportU2F.create();
};

async function makeApp() {
  const transport = await getTransport();
  return new LedgerEth(transport);
}

export const isU2FError = (err: LedgerError): err is U2FError =>
  !!err && !!(err as U2FError).metaData;
export const isStringError = (err: LedgerError): err is string => typeof err === 'string';
export const isErrorWithId = (err: LedgerError): err is ErrorWithId =>
  Object.prototype.hasOwnProperty.call(err, 'id') &&
  Object.prototype.hasOwnProperty.call(err, 'message');

export const ledgerErrToMessage = (err: LedgerError) => {
  // https://developers.yubico.com/U2F/Libraries/Client_error_codes.html
  if (isU2FError(err)) {
    // Timeout
    if (err.metaData.code === 5) {
      return translateRaw('LEDGER_TIMEOUT');
    }

    return err.metaData.type;
  }

  console.error(err);

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
};
