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
    export function getXPubKey(
      path: Path,
      cb: (res: Response<PublicKey>) => void,
      minFirmware?: string
    ): void;

    export function ethereumSignTx(
      path: Path,
      nonce: string,
      gasPrice: string,
      gasLimit: string,
      to: string,
      value: string,
      data: string | null,
      chainId: number | null,
      cb: (signature: Response<TxSignature>) => void,
      minFirmware?: string
    ): void;

    export function signMessage(
      path: Path,
      message: string,
      cb: (res: Response<MessageSignature>) => void,
      coin?: string,
      minFirmware?: string
    ): void;

    export function ethereumGetAddress(
      path: Path,
      cb: (res: Response<{ address: string }>) => void,
      minFirmware?: string
    ): void;
  }

  export default TrezorConnect;
}
