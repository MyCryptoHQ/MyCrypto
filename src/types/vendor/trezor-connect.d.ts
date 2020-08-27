/**
 * TODO: These declarations are pretty broken since `Path` is not defined. Adding a definition for
 * `Path`, e.g. `type Path = string | number[];` results in other code being broken, so this should
 * be fixed in the future.
 */
declare module 'trezor-connect' {
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

  interface TrezorData<Payload> {
    id: number;
    payload: Payload;
    success: boolean;
  }

  interface GetPublicKeyPayload {
    serializedPath: string;
    chainCode: string;
    publicKey: string;
  }

  interface pathObj {
    path: string | number[];
  }

  interface EthereumGetAddressPayload {
    address: string;
    path: number[];
    serializedPath: string;
  }

  namespace TrezorConnect {
    export function manifest(manifest: { email: string; appUrl: string }): void;

    export function getPublicKey(params: Path): Promise<TrezorData<GetPublicKeyPayload>>;
    export function getPublicKey(params: {
      bundle: Path[];
    }): Promise<TrezorData<GetPublicKeyPayload[]>>;

    export function ethereumSignTransaction(signTransactionMessage): any;
    export function ethereumSignMessage(params: {
      path: string | number[];
      message: string;
    }): Promise<TrezorData<MessageSignature>>;

    export function ethereumGetAddress(pathObj): Promise<TrezorData<EthereumGetAddressPayload>>;
  }

  export default TrezorConnect;
}
