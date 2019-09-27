import { useContext } from 'react';

import { TUseStateReducerFactory } from 'v2/utils';
import { Asset, Network, ITxReceipt } from 'v2/types';
import {
  getNetworkByChainId,
  getAssetByContractAndNetwork,
  decodeTransfer,
  toWei,
  fromTokenBase,
  getDecimalFromEtherUnit,
  gasPriceToBase,
  hexWeiToString,
  getAccountByAddressAndNetworkName,
  getBaseAssetByNetwork,
  AccountContext
} from 'v2/services';
import { DEFAULT_ASSET_DECIMAL } from 'v2/config';
import { ProviderHandler } from 'v2/services/EthService';

import { ITxConfig, IFormikFields, TStepAction, ISignedTx, ITxObject } from './types';
import { processFormDataToTx, decodeTransaction, fromTxReceiptObj } from './helpers';

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
  const { addNewTransactionToAccount } = useContext(AccountContext);
  const handleFormSubmit: TStepAction = (payload: IFormikFields, after) => {
    const rawTransaction: ITxObject = processFormDataToTx(payload);
    const baseAsset: Asset | undefined = getBaseAssetByNetwork(payload.network);
    setState((prevState: State) => ({
      ...prevState,
      txConfig: {
        rawTransaction,
        amount: payload.amount,
        senderAccount: payload.account,
        receiverAddress: payload.receiverAddress.value,
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

    after();
  };

  // For Metamask
  const handleConfirmAndSign: TStepAction = (payload: ITxConfig, after) => {
    setState((prevState: State) => ({
      ...prevState,
      txReceipt: payload
    }));

    after();
  };

  // For Other Wallets
  // tslint:disable-next-line
  const handleConfirmAndSend: TStepAction = (_, after) => {
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
        const txReceipt = fromTxReceiptObj(retrievedTransactionReceipt);
        addNewTransactionToAccount(state.txConfig.senderAccount, txReceipt || {});
        setState((prevState: State) => ({
          ...prevState,
          txReceipt
        }));
      })
      .finally(after);
  };

  const handleSignedTx: TStepAction = (payload: ISignedTx, after) => {
    const decodedTx = decodeTransaction(payload);
    const networkDetected = getNetworkByChainId(decodedTx.chainId);
    const contractAsset = getAssetByContractAndNetwork(decodedTx.to || undefined, networkDetected);
    const baseAsset = getBaseAssetByNetwork(networkDetected || ({} as Network));

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

    after();
  };

  const handleSignedWeb3Tx: TStepAction = (payload: ITxReceipt | string, after) => {
    // Payload is tx hash or receipt
    const txReceipt = typeof payload === 'string' ? { hash: payload } : fromTxReceiptObj(payload);
    addNewTransactionToAccount(state.txConfig.senderAccount, txReceipt || {});
    setState((prevState: State) => ({
      ...prevState,
      txReceipt
    }));
    after();
  };

  return {
    handleFormSubmit,
    handleConfirmAndSign,
    handleConfirmAndSend,
    handleSignedTx,
    handleSignedWeb3Tx,
    txConfig: state.txConfig,
    txReceipt: state.txReceipt
  };
};

export { txConfigInitialState, TxConfigFactory };
