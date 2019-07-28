/* tslint:disable */
import { useContext } from 'react';

import { NetworkContext } from 'v2/services/Store';
import { TUseApiFactory } from 'v2/services';
import { ITxConfig, ITxReceipt, IFormikFields, TStepAction } from './types';

const txConfigInitialState = {
  gasLimit: null,
  gasPrice: null,
  nonce: null,
  amount: null,
  data: null,
  receiverAddress: null,
  senderAccount: null,
  network: undefined,
  asset: null
};

interface State {
  txConfig: ITxConfig;
  txReceipt?: ITxReceipt;
}

const TxConfigFactory: TUseApiFactory<State> = ({ state, setState }) => {
  const { getNetworkByName } = useContext(NetworkContext);

  const handleFormSubmit: TStepAction = (payload: IFormikFields, after) => {
    const data = {
      gasLimit: payload.gasLimitField, // @TODO update with correct value.
      gasPrice: payload.gasPriceField, // @TODO update with correct value.
      nonce: payload.nonceField, // @TODO update with correct value.
      data: payload.txDataField,
      amount: payload.amount,
      senderAccount: payload.account,
      receiverAddress: payload.receiverAddress,
      network: getNetworkByName(payload.account.network),
      asset: payload.asset
    };

    setState((prevState: State) => ({
      ...prevState,
      txConfig: data
    }));
    after();
  };

  // For Metamask
  const handleConfirmAndSign: TStepAction = (payload: ITxReceipt, after) => {
    setState((prevState: State) => ({
      ...prevState,
      txReceipt: payload
    }));

    after();
  };

  // For Other Wallets
  // @ts-ignore
  const handleConfirmAndSend: TStepAction = (payload, after) => {};

  // @ts-ignore
  const handleSignedTx: TStepAction = (payload, after) => {};

  return {
    handleFormSubmit,
    handleConfirmAndSign,
    handleConfirmAndSend,
    handleSignedTx,
    txConfig: state.txConfig,
    txReceipt: state.txReceipt
  };
};

export { txConfigInitialState, TxConfigFactory };

/* tslint:enable */
