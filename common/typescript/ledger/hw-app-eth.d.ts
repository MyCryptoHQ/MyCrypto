declare module '@ledgerhq/hw-app-eth' {
  import LedgerTransport from '@ledgerhq/hw-transport';

  export default class Eth<T extends LedgerTransport<any>> {
    constructor(transport: T);

    /**
     *
     * @description get Ethereum address for a given BIP 32 path.
     * @param {string} path a path in BIP 32 format
     * @param {boolean} [boolDisplay]  enable or not the display
     * @param {boolean} [boolChaincode]  enable or not the chaincode request
     * @returns {Promise<{ publicKey: string; address: string; chainCode?: string }>}
     * @memberof Eth
     */
    public getAddress(
      path: string,
      boolDisplay?: boolean,
      boolChaincode?: boolean
    ): Promise<{ publicKey: string; address: string; chainCode?: string }>;

    /**
     *
     * @description signs a raw transaction and returns v,r,s
     * @param {string} path
     * @param {string} rawTxHex
     * @returns {Promise<{s: string, v: string, r: string}>}
     * @memberof Eth
     */
    public signTransaction(
      path: string,
      rawTxHex: string
    ): Promise<{ s: string; v: string; r: string }>;

    /**
     *
     *
     * @returns {Promise<{ arbitraryDataEnabled: number; version: string }>}
     * @memberof Eth
     */
    public getAppConfiguration(): Promise<{ arbitraryDataEnabled: number; version: string }>;

    /**
     *
     * @description sign a message according to eth_sign RPC call
     * @param {string} path
     * @param {string} messageHex
     * @returns {Promise<{v: number, s: string, r: string}>}
     * @memberof Eth
     */
    public signPersonalMessage(
      path: string,
      messageHex: string
    ): Promise<{ v: number; s: string; r: string }>;
  }
}
