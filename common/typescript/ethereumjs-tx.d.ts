declare module 'ethereumjs-tx' {
  import BN from 'bn.js';
  import { Buffer } from 'buffer';

  /*
  type fieldName =
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

  export interface TxObj {
    chainId: number;
    gasLimit: Buffer | BN | string | number;
    gasPrice: Buffer | BN | string | number;
    to: Buffer | BN | string | number;
    nonce: Buffer | BN | string | number;
    data?: Buffer | BN | string | number;
    v?: Buffer | BN | string | number;
    r?: Buffer | BN | string | number;
    s?: Buffer | BN | string | number;
    value?: Buffer | BN | string | number;
  }

  class Base {
    public chainId: Number;
    public raw: Buffer;
    public gasLimit: Buffer;
    public gasPrice: Buffer;
    public to: Buffer;
    public nonce: Buffer;
    public data: Buffer;
    public value: Buffer;
    public from: Buffer;

    constructor(data: TxObj | string);

    /**
     * If the tx's `to` is to the creation address
     * @return {Boolean}
     */
    public toCreationAddress(): string;

    /**
     * Computes a sha3-256 hash of the serialized tx
     * @param {Boolean} [includeSignature=true] whether or not to inculde the signature
     * @return {Buffer}
     */
    public hash(bool: boolean): Buffer;

    /**
     * returns the public key of the sender
     * @return {Buffer}
     */
    public getChainId(): Buffer;

    /**
     * returns the sender's address
     * @return {Buffer}
     */
    public getSenderAddress(): Buffer;

    /**
     * returns the public key of the sender
     * @return {Buffer}
     */
    public getSenderPublicKey(): Buffer;

    /**
     * Determines if the signature is valid
     * @return {Boolean}
     */
    public verifySignature(): boolean;

    /**
     * sign a transaction with a given a private key
     * @param {Buffer} privateKey
     */
    public sign(privateKey: Buffer);

    /**
     * The amount of gas paid for the data in this tx
     * @return {BN}
     */
    public getDataFee(): BN;

    /**
     * the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)
     * @return {BN}
     */
    public getBaseFee(): BN;

    /**
     * the up front amount that an account must have for this transaction to be valid
     * @return {BN}
     */
    public getUpfrontCost(): BN;

    /**
     * validates the signature and checks to see if it has enough gas
     * @param {Boolean} [stringError=false] whether to return a string with a dscription of why the validation failed or return a Bloolean
     * @return {Boolean|String}
     */
    public validate(stringError: boolean): boolean | string;

    public toJSON(): any;

    public serialize(): Buffer;
  }

  export default Base;
}
