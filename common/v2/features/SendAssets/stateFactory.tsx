import { useContext } from 'react';
import { FallbackProvider } from 'ethers/providers';

import { NetworksContext } from 'v2/providers';
import { TUseApiFactory } from 'v2/services';
import { allProviders } from 'v2/config/networks/globalProvider';
import { ITxObject, ITxConfig, IFormikFields, TStepAction } from './types';
import { fromStateToTxObject } from './helpers';

const txConfigInitialState = {
  gasLimit: null,
  gasPrice: null,
  nonce: null,
  amount: null,
  data: null,
  recipientAddress: null,
  senderAccount: null,
  network: undefined,
  asset: null
};

const TxConfigFactory: TUseApiFactory<ITxConfig> = ({ state, setState }) => {
  const { getNetworkByName } = useContext(NetworksContext);

  const handleFormSubmit: TStepAction = (payload: IFormikFields, after) => {
    const data = {
      gasLimit: payload.gasLimitField, // @TODO update with correct value.
      gasPrice: payload.gasPriceField, // @TODO update with correct value.
      nonce: payload.nonceField, // @TODO update with correct value.
      data: payload.txDataField,
      amount: payload.amount,
      senderAccount: payload.account,
      recipientAddress: payload.recipientAddress,
      network: getNetworkByName(payload.account.network),
      asset: payload.asset
    };

    setState((prevState: ITxConfig) => ({
      ...prevState,
      ...data
    }));
    after();
  };

  const handleConfirmAndSign: TStepAction = (payload, after) => {
    const txObject: ITxObject = fromStateToTxObject(state);
    const { network: { name: networkName } } = state;
    const txHash = sendTransaction(txObject, networkName);

    // updateState
    after();
  };

  // tslint:disable-next-line:
  const handleConfirmAndSend: TStepAction = (payload, after) => {};
  // tslint:disable-next-line:
  const handleSignedTx: TStepAction = (payload, after) => {};

  return {
    handleFormSubmit,
    handleConfirmAndSign,
    handleConfirmAndSend,
    handleSignedTx,
    state
  };
};

export { txConfigInitialState, TxConfigFactory };

// @TODO: Move to correct service
async function sendTransaction(signedTx, network) {
  const transactionProvider: FallbackProvider = allProviders[network];
  const broadcastTransaction = await transactionProvider.sendTransaction(signedTx);
  return broadcastTransaction;
}
