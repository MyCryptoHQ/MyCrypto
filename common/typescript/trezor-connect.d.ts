declare module 'vendor/trezor-connect' {
  type Path = number[] | string;

  interface TxSignature {
    r: number;
    s: string;
    v: string;
  }

  interface MessageSignature {
    signature: string;
    address: string;
  }

  interface PublicKey {
    xpubkey: string;
    path: string;
    serializedPath: string;
    chainCode: string;
    publicKey: string;
  }

  interface signTransactionMessage {
    path: Path;
    transaction: Transaction;
  }

  interface Transaction {
    nonce: string;
    gasPrice: string;
    gasLimit: string;
    to: string;
    value: string;
    data: string | null;
    chainId: number | null;
  }

  interface pathObj {
    path: Path;
  }

  interface ErrorResponse {
    success: false;
    error: string;
  }
  type SuccessResponse<T> = {
    success: true;
    error: undefined;
  } & T;
  type Response<T> = ErrorResponse | SuccessResponse<T>;

  namespace TrezorConnect {
    export function getPublicKey(pathObj): any;

    export function ethereumSignTransaction(signTransactionMessage): any;

    export function signMessage(
      path: Path,
      message: string,
      cb: (res: Response<MessageSignature>) => void,
      coin?: string,
      minFirmware?: string
    ): any;

    export function ethereumGetAddress(pathObj): any;
  }

  export default TrezorConnect;
}
