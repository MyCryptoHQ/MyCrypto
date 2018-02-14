declare module 'ledgerco' {
  export const comm_u2f: any;
  export class eth {
    constructor(transport: any);
    getAddress_async(
      path: string,
      boolDisplay?: boolean,
      boolChaincode?: boolean
    ): Promise<{
      publicKey: string;
      address: string;
      chainCode: string;
    }>;

    signTransaction_async(
      path: string,
      rawTxHex: string
    ): Promise<{
      s: string;
      v: string;
      r: string;
    }>;

    getAppConfiguration_async(): Promise<{
      arbitraryDataEnabled: number;
      version: string;
    }>;

    signPersonalMessage_async(
      path: string,
      messageHex: string
    ): Promise<{
      v: number;
      s: string;
      r: string;
    }>;
  }
}
