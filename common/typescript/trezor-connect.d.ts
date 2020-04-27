declare module 'trezor-connect' {
  type Path = number[] | string;

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

  interface Transaction {
    nonce: string;
    gasPrice: string;
    gasLimit: string;
    to: string;
    value: string;
    data: string | null;
    chainId: number | null;
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
    export function manifest(data): void;

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

  export = TrezorConnect;
}
