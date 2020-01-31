import { useContext } from 'react';

import { TUseStateReducerFactory, fromTxReceiptObj } from 'v2/utils';
import {
  Asset,
  Network,
  ITxReceipt,
  ITxConfig,
  IFormikFields,
  ISignedTx,
  ITxObject,
  ITxStatus
} from 'v2/types';
import {
  getNetworkByChainId,
  getAssetByContractAndNetwork,
  decodeTransfer,
  toWei,
  fromTokenBase,
  getDecimalFromEtherUnit,
  gasPriceToBase,
  hexWeiToString,
  getBaseAssetByNetwork,
  AccountContext,
  AssetContext,
  NetworkContext
} from 'v2/services';
import { DEFAULT_ASSET_DECIMAL } from 'v2/config';
import { ProviderHandler } from 'v2/services/EthService';

import { TStepAction } from './types';
import { processFormDataToTx, decodeTransaction } from './helpers';

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

  const { addNewTransactionToAccount, getAccountByAddressAndNetworkName } = useContext(
    AccountContext
  );

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
        addNewTransactionToAccount(
          state.txConfig.senderAccount,
          { ...txReceipt, stage: ITxStatus.PENDING } || {}
        );
        setState((prevState: State) => ({
          ...prevState,
          txReceipt
        }));
      })
      .finally(cb);
  };

  const handleSignedTx: TStepAction = (payload: ISignedTx, cb) => {
    const decodedTx = decodeTransaction(payload);
    const networkDetected = getNetworkByChainId(decodedTx.chainId, networks);
    const contractAsset = getAssetByContractAndNetwork(
      decodedTx.to || undefined,
      networkDetected
    )(assets);
    const baseAsset = getBaseAssetByNetwork({
      network: networkDetected || ({} as Network),
      assets
    });

    setState((prevState: State) => ({
      ...prevState,
      signedTx: payload, // keep a reference to signedTx;
      txConfig: {
        rawTransaction: prevState.txConfig.rawTransaction,
        receiverAddress: contractAsset ? decodeTransfer(decodedTx.data)._to : decodedTx.to,
        amount: contractAsset
          ? fromTokenBase(
              toWei(decodeTransfer(decodedTx.data)._value, 0),
              contractAsset.decimal || DEFAULT_ASSET_DECIMAL
            )
          : decodedTx.value,
        network: networkDetected || prevState.txConfig.network,
        value: toWei(decodedTx.value, getDecimalFromEtherUnit('ether')).toString(),
        asset: contractAsset || prevState.txConfig.asset,
        baseAsset: baseAsset || prevState.txConfig.baseAsset,
        senderAccount:
          decodedTx.from && networkDetected
            ? getAccountByAddressAndNetworkName(decodedTx.from, networkDetected.name) ||
              prevState.txConfig.senderAccount
            : prevState.txConfig.senderAccount,
        gasPrice: gasPriceToBase(parseInt(decodedTx.gasPrice, 10)).toString(),
        gasLimit: decodedTx.gasLimit,
        data: decodedTx.data,
        nonce: decodedTx.nonce.toString(),
        from: decodedTx.from || prevState.txConfig.from
      }
    }));

    cb();
  };

  const handleSignedWeb3Tx: TStepAction = (payload: ITxReceipt | string, cb) => {
    // Payload is tx hash or receipt
    const txReceipt =
      typeof payload === 'string'
        ? {
            ...state.txConfig,
            hash: payload,
            to: state.txConfig.senderAccount.address,
            from: state.txConfig.receiverAddress
          }
        : fromTxReceiptObj(payload);
    addNewTransactionToAccount(
      state.txConfig.senderAccount,
      { ...txReceipt, stage: ITxStatus.PENDING } || {}
    );

    setState((prevState: State) => ({
      ...prevState,
      txReceipt
    }));
    cb();
  };

  const txFactoryState = {
    txConfig: state.txConfig,
    txReceipt: state.txReceipt
  };

  return {
    handleFormSubmit,
    handleConfirmAndSign,
    handleConfirmAndSend,
    handleSignedTx,
    handleSignedWeb3Tx,
    txFactoryState
  };
};

export { txConfigInitialState, TxConfigFactory };
