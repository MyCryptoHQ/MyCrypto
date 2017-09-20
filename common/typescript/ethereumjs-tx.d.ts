declare module 'ethereumjs-tx' {
  import { BigNumber } from 'bignumber.js';
  import BN = require('bn.js');
  import { Buffer } from 'buffer';
  /**
   *   type fieldName =
    | 'nonce'
    | 'gasPrice'
    | 'gasLimit'
    | 'to'
    | 'value'
    | 'data'
    | 'v'
    | 'r'
    | 's';

  type Field = {
    name: fieldName;
    length?: 32 | 20;
    allowLess?: boolean;
    allowZero?: boolean;
    default?: Buffer;
  };

   */
  type DataParamType = any; //TS complaining about big numbers heres
  interface Data {
    chainId: number;
    gasLimit: DataParamType;
    gasPrice: DataParamType;
    to: DataParamType;
    nonce: DataParamType;
    data: DataParamType;
    v?: DataParamType;
    r?: DataParamType;
    s?: DataParamType;
    value: DataParamType;
  }

  export = ITx;
  class ITx {
    constructor(data: Data);
    /**
     * If the tx's `to` is to the creation address
     * @return {Boolean}
     */
    toCreationAddress(): string;

    /**
     * Computes a sha3-256 hash of the serialized tx
     * @param {Boolean} [includeSignature=true] whether or not to inculde the signature
     * @return {Buffer}
     */
    hash(bool: boolean): Buffer;

    /**
     * returns the public key of the sender
     * @return {Buffer}
     */
    getChainId(): Buffer;

    /**
     * returns the sender's address
     * @return {Buffer}
     */
    getSenderAddress(): Buffer;

    /**
     * returns the public key of the sender
     * @return {Buffer}
     */
    getSenderPublicKey(): Buffer;

    /**
     * Determines if the signature is valid
     * @return {Boolean}
     */
    verifySignature(): boolean;

    /**
     * sign a transaction with a given a private key
     * @param {Buffer} privateKey
     */
    sign(privateKey: Buffer);

    /**
     * The amount of gas paid for the data in this tx
     * @return {BN}
     */
    getDataFee(): BN;

    /**
     * the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)
     * @return {BN}
     */
    getBaseFee(): BN;

    /**
   * the up front amount that an account must have for this transaction to be valid
   * @return {BN}
   */
    getUpfrontCost(): BN;

    /**
   * validates the signature and checks to see if it has enough gas
   * @param {Boolean} [stringError=false] whether to return a string with a dscription of why the validation failed or return a Bloolean
   * @return {Boolean|String}
   */
    validate(stringError: boolean): boolean | string;

    toJSON(): any;

    serialize(): Buffer;
  }
}
