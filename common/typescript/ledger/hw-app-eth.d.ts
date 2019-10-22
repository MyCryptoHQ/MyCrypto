declare module '@ledgerhq/hw-app-eth' {
  import LedgerTransport from '@ledgerhq/hw-transport';
  import { TokenInfo } from '@ledgerhq/hw-app-eth/erc20';

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
    public getAddress<BoolChaincode extends boolean>(
      path: string,
      boolDisplay?: boolean,
      boolChaincode?: BoolChaincode
    ): Promise<{
      publicKey: string;
      address: string;
      chainCode: BoolChaincode extends true ? string : undefined;
    }>;

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

    /**
     * @description provides a trusted description of an ERC-20 token
     * @param {TokenInfo} tokenInfo
     * @returns {Promise<boolean>}
     * @memberOf Eth
     */
    public provideERC20TokenInformation(tokenInfo: TokenInfo): Promise<boolean>;
  }
}

declare module '@ledgerhq/hw-app-eth/erc20' {
  interface TokenInfo {
    contractAddress: string;
    ticker: string;
    decimals: number;
    chainId: number;
    signature: Buffer;
    data: Buffer;
  }

  /**
   * @description retrieve the token information by a given contract address if any
   * @param {string} address
   * @returns {TokenInfo | undefined}
   */
  export function byContractAddress(address: string): TokenInfo | undefined;
}
