declare module '@ledgerhq/hw-app-eth' {
  import Transport from '@ledgerhq/hw-transport';
  import { TokenInfo } from '@ledgerhq/hw-app-eth/erc20';

  interface Signature {
    v: string;
    s: string;
    r: string;
  }

  export default class EthereumApp {
    public transport: Transport<any>;

    /**
     * Create a new instance of EthereumApp.
     *
     * @param {Transport<any>} transport The Transport to use.
     * @param {string} scrambleKey An optional scramble key to use. This may not be implemented by
     *   all transports.
     */
    public constructor(transport: Transport<any>, scrambleKey?: string);

    /**
     * Get an Ethereum address for a given BIP-32 path.
     *
     * @param {string} path The path in BIP-32 format.
     * @param display Whether to display the address on the device or not.
     * @param chainCode Whether to request the chain code or not.
     * @return {Promise<{ publicKey: string, address: string, chainCode?: string }>} A Promise with
     *   the publicKey and address, and optional chain code.
     */
    public getAddress(
      path: string,
      display?: boolean,
      chainCode?: boolean
    ): Promise<{ publicKey: string; address: string; chainCode?: string }>;

    /**
     * Provide a trusted description of an ERC-20 token to associate a contract address with a
     * ticker and number of decimals. It should be run immediately before performing a transaction
     * involving a contract.
     *
     * @param {TokenInfo} tokenInfo The token info that contains all the token information.
     */
    public provideERC20TokenInformation(tokenInfo: TokenInfo): Promise<boolean>;

    /**
     * Sign a transaction and retrieve v, r and s given the raw transaction and the BIP-32 path of
     * the account to sign with.
     *
     * @param {string} path The path in BIP-32 format.
     * @param {string} rawTransactionHex The raw unsigned transaction as hexadecimal string.
     * @return {Promise<Signature>} A Promise with the Signature.
     */
    public signTransaction(path: string, rawTransactionHex: string): Promise<Signature>;

    /**
     * Get the configuration for the Ethereum app on the Ledger device.
     *
     * @return {Promise<{ arbitraryDataEnabled: number, version: string }>} A Promise with the
     *   configuration info.
     */
    public getAppConfiguration(): Promise<{ arbitraryDataEnabled: number; version: string }>;

    /**
     * Sign a message according to the `eth_sign` RPC call and retrieve v, r and s given the
     * message and the BIP-32 path of the account to sign with.
     *
     * @param {string} path The path in BIP-32 format.
     * @param {string} messageHex The raw unsigned message as hexadecimal string.
     * @return {Promise<Signature>} A Promise with the Signature.
     */
    public signPersonalMessage(path: string, messageHex: string): Promise<Signature>;
  }
}
