import { useContext } from 'react';
import { Arrayish, hexlify, bigNumberify } from 'ethers/utils';

import { TUseStateReducerFactory, fromTxReceiptObj, makeTxConfigFromSignedTx } from 'v2/utils';
import {
  Asset,
  ITxReceipt,
  ITxConfig,
  IFormikFields,
  ISignedTx,
  ITxObject,
  ITxStatus,
  ITxType
} from 'v2/types';
import {
  hexWeiToString,
  getBaseAssetByNetwork,
  AccountContext,
  AssetContext,
  NetworkContext,
  StoreContext
} from 'v2/services';
import {
  ProviderHandler,
  inputGasPriceToHex,
  bigNumGasPriceToViewableGwei
} from 'v2/services/EthService';

import { TStepAction } from './types';
import { processFormDataToTx } from './helpers';

const txConfigInitialState = {
  tx: {
    gasLimit: null,
    gasPrice: null,
    nonce: null,
    data: null,
    to: null
  },
  amount: null,
  receiverAddress: null,
  senderAccount: null,
  network: undefined,
  asset: null
};

interface State {
  txConfig: ITxConfig;
  txReceipt?: ITxReceipt;
  signedTx: ISignedTx; // make sure signedTx is only used within stateFactory
}

const TxConfigFactory: TUseStateReducerFactory<State> = ({ state, setState }) => {
  const { assets } = useContext(AssetContext);
  const { networks } = useContext(NetworkContext);
  const { accounts } = useContext(StoreContext);
  const { addNewTransactionToAccount } = useContext(AccountContext);

  const handleFormSubmit: TStepAction = (payload: IFormikFields, cb: any) => {
    const rawTransaction: ITxObject = processFormDataToTx(payload);
    const baseAsset: Asset | undefined = getBaseAssetByNetwork({
      network: payload.network,
      assets
    });
    setState((prevState: State) => ({
      ...prevState,
      txConfig: {
        rawTransaction,
        amount: payload.amount,
        senderAccount: payload.account,
        receiverAddress: payload.address.value,
        network: payload.network,
        asset: payload.asset,
        baseAsset: baseAsset || ({} as Asset),
        from: payload.account.address,
        gasPrice: hexWeiToString(rawTransaction.gasPrice),
        gasLimit: payload.gasLimitField,
        nonce: payload.nonceField,
        data: rawTransaction.data,
        value: hexWeiToString(rawTransaction.value)
      }
    }));

    cb();
  };

  // For Metamask
  const handleConfirmAndSign: TStepAction = (payload: ITxConfig, cb) => {
    setState((prevState: State) => ({
      ...prevState,
      txReceipt: payload
    }));
    cb();
  };

  // For Other Wallets
  // tslint:disable-next-line
  const handleConfirmAndSend: TStepAction = (_, cb) => {
    const { signedTx } = state;
    if (!signedTx) {
      return;
    }

    const provider = new ProviderHandler(state.txConfig.network);

    provider
      .sendRawTx(signedTx)
      .then(retrievedTxReceipt => retrievedTxReceipt)
      .catch(txHash => provider.getTransactionByHash(txHash))
      .then(retrievedTransactionReceipt => {
        const txReceipt = fromTxReceiptObj(retrievedTransactionReceipt)(assets, networks);
        addNewTransactionToAccount(state.txConfig.senderAccount, {
          ...txReceipt,
          to: state.txConfig.receiverAddress,
          from: state.txConfig.senderAccount.address,
          amount: state.txConfig.amount,
          txType: ITxType.STANDARD,
          stage: ITxStatus.PENDING
        });
        setState((prevState: State) => ({
          ...prevState,
          txReceipt
        }));
      })
      .finally(cb);
  };

  const handleSignedTx: TStepAction = (payload: Arrayish, cb) => {
    const signedTx = hexlify(payload);
    // Used when signedTx is a buffer instead of a string.
    // Hardware wallets return a buffer.

    setState((prevState: State) => ({
      ...prevState,
      signedTx, // keep a reference to signedTx;
      txConfig: makeTxConfigFromSignedTx(payload, assets, networks, accounts, prevState.txConfig)
    }));

    cb();
  };

  const handleSignedWeb3Tx: TStepAction = (payload: ITxReceipt | string, cb) => {
    // Payload is tx hash or receipt
    // @ts-ignore
    const txReceipt =
      typeof payload === 'string'
        ? {
            ...state.txConfig,
            hash: payload,
            to: state.txConfig.receiverAddress,
            from: state.txConfig.senderAccount.address
          }
        : fromTxReceiptObj(payload);
    addNewTransactionToAccount(state.txConfig.senderAccount, {
      ...txReceipt,
      txType: ITxType.STANDARD,
      stage: ITxStatus.PENDING
    });

    setState((prevState: State) => ({
      ...prevState,
      txReceipt
    }));
    cb();
  };

  const handleResubmitTx: TStepAction = cb => {
    const { txConfig } = state;
    const rawTransaction = txConfig.rawTransaction;
    // add 10 gwei to current gas price
    const resubmitGasPrice =
      parseFloat(bigNumGasPriceToViewableGwei(bigNumberify(rawTransaction.gasPrice))) + 10;
    const hexGasPrice = inputGasPriceToHex(resubmitGasPrice.toString());

    setState((prevState: State) => ({
      ...prevState,
      txConfig: {
        ...txConfig,
        rawTransaction: { ...rawTransaction, gasPrice: hexGasPrice }
      }
    }));
    cb();
  };

  const txFactoryState: State = {
    txConfig: state.txConfig,
    txReceipt: state.txReceipt,
    signedTx: state.signedTx
  };

  return {
    handleFormSubmit,
    handleConfirmAndSign,
    handleConfirmAndSend,
    handleSignedTx,
    handleSignedWeb3Tx,
    handleResubmitTx,
    txFactoryState
  };
};

export { txConfigInitialState, TxConfigFactory };
