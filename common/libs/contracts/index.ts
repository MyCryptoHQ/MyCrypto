import AbiFunction, { IUserSendParams, ISendParams } from './ABIFunction';
import { IWallet } from 'libs/wallet/IWallet';
import { RPCNode } from 'libs/nodes';
import { ABIFunction, ContractOutputMappings } from './types';
import { TBroadcastTx } from 'actions/wallet';
import { Wei } from 'libs/units';
const ABIFUNC_METHOD_NAMES = [
  'encodeInput',
  'decodeInput',
  'decodeOutput',
  'call'
];

type ABIType = ABIFunction[];

export interface ISetConfigForTx {
  wallet: IWallet;
  nodeLib: RPCNode;
  chainId: number;
  gasPrice: Wei;
  broadcastTx: TBroadcastTx;
}

enum ABIMethodTypes {
  FUNC = 'function'
}
export type TContract = typeof Contract;

export default class Contract {
  public static setConfigForTx = (
    contract: Contract,
    { wallet, nodeLib, chainId, gasPrice, broadcastTx }: ISetConfigForTx
  ): Contract =>
    contract
      .setWallet(wallet)
      .setNode(nodeLib)
      .setChainId(chainId)
      .setGasPrice(gasPrice)
      .setBroadcaster(broadcastTx);

  public static getFunctions = (contract: Contract) =>
    Object.getOwnPropertyNames(
      contract
    ).reduce((accu, currContractMethodName) => {
      const currContractMethod = contract[currContractMethodName];
      const methodNames = Object.getOwnPropertyNames(currContractMethod);

      const isFunc = ABIFUNC_METHOD_NAMES.reduce(
        (isAbiFunc, currAbiFuncMethodName) =>
          isAbiFunc && methodNames.includes(currAbiFuncMethodName),
        true
      );
      return isFunc
        ? { ...accu, [currContractMethodName]: currContractMethod }
        : accu;
    }, {});

  public address: string;
  public abi;
  private wallet: IWallet;
  private gasPrice: Wei;
  private chainId: number;
  private node: RPCNode;
  private broadcaster: TBroadcastTx;
  constructor(abi: ABIType, outputMappings: ContractOutputMappings = {}) {
    this.assignABIFuncs(abi, outputMappings);
  }

  public at = (addr: string) => {
    this.address = addr;
    return this;
  };
  /*
makeAndSignTx(wallet: IWallet, nodeLib: RpcNode, gasPrice: Wei,
   gasLimit: Big.BigNumber, chainId: number, transactionInput: TransactionInput,
    skipValidation?: boolean)
*/

  public setWallet = (w: IWallet) => {
    this.wallet = w;
    return this;
  };

  public setGasPrice = (gasPrice: Wei) => {
    this.gasPrice = gasPrice;
    return this;
  };

  public setChainId = (chainId: number) => {
    this.chainId = chainId;
    return this;
  };
  public setNode = (node: RPCNode) => {
    //TODO: caching
    this.node = node;
    return this;
  };
  public setBroadcaster = (b: TBroadcastTx) => {
    this.broadcaster = b;
    return this;
  };
  private assignABIFuncs = (
    abi: ABIType,
    outputMappings: ContractOutputMappings
  ) => {
    abi.forEach(currentABIMethod => {
      const { name, type } = currentABIMethod;
      if (type === ABIMethodTypes.FUNC) {
        //only grab the functions we need
        const {
          encodeInput,
          decodeInput,
          decodeOutput,
          call,
          send,
          funcParams,
          constant
        } = new AbiFunction(currentABIMethod, outputMappings[name]);

        const proxiedCall = new Proxy(call, {
          apply: this.applyTrapForCall
        });

        const proxiedSend = new Proxy(send, { apply: this.applyTrapForSend });

        const funcToAssign = {
          [name]: {
            encodeInput,
            decodeInput,
            decodeOutput,
            call: proxiedCall,
            send: proxiedSend,
            funcParams,
            constant
          }
        };
        Object.assign(this, funcToAssign);
      }
    });
  };

  private applyTrapForCall = (target, thisArg, argumentsList) => {
    return target(
      //TODO: pass object instead
      ...(argumentsList.length > 0 ? argumentsList : [null]),
      this.node,
      this.address
    );
  };

  private applyTrapForSend = (
    target: ISend,
    thisArg,
    [userSendParams]: [IUserSendParams]
  ) => {
    return target({
      broadcastTx: this.broadcaster,
      chainId: this.chainId,
      gasPrice: this.gasPrice,
      to: this.address,
      nodeLib: this.node,
      wallet: this.wallet,
      ...userSendParams
    });
  };
}
type ISend = (sendParams: ISendParams) => void;
type ISendUser = (userSendParams: IUserSendParams) => void;
