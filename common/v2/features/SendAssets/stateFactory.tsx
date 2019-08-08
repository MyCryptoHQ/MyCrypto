import { TUseApiFactory } from 'v2/services';
import { ProviderHandler } from 'v2/config';

import { ITxConfig, ITxReceipt, IFormikFields, TStepAction, ISignedTx } from './types';
import { processFormDataToTx } from './process';

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
  signedTx?: ISignedTx;
  txReceipt?: ITxReceipt;
}

const TxConfigFactory: TUseApiFactory<State> = ({ state, setState }) => {
  const handleFormSubmit: TStepAction = (payload: IFormikFields, after) => {
    const processedTx = processFormDataToTx(payload);
    const txConfigData: ITxConfig = {
      ...processedTx,
      amount: payload.amount,
      senderAccount: payload.account,
      receiverAddress: payload.receiverAddress,
      network: payload.network,
      asset: payload.asset
    };
    setState((prevState: State) => ({
      ...prevState,
      txConfig: txConfigData
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
  const handleConfirmAndSend: TStepAction = (_payload, after) => {
    const provider = new ProviderHandler(state.txConfig.network);
    if (state.signedTx) {
      provider
        .sendRawTx(state.signedTx)
        .then(transactionReceipt => {
          setState((prevState: State) => ({
            ...prevState,
            txReceipt: transactionReceipt
          }));
          after();
        })
        .catch(txHash => {
          // If rejected, data is a tx hash, not a receipt. Fetch the receipt, then save receipt for flow
          provider.getTransactionByHash(txHash).then(transactionReceipt => {
            setState((prevState: State) => ({
              ...prevState,
              txReceipt: transactionReceipt
            }));
            after();
          });
        });
    }
  };

  const handleSignedTx: TStepAction = (payload: ITxReceipt | ISignedTx | any, after) => {
    setState((prevState: State) => ({
      ...prevState,
      signedTx: payload
    }));
    after();
  };

  const handleSignedWeb3Tx: TStepAction = (payload: ITxReceipt | ISignedTx | any, after) => {
    setState((prevState: State) => ({
      ...prevState,
      txReceipt: payload
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
    txReceipt: state.txReceipt,
    signedTx: state.signedTx
  };
};

export { txConfigInitialState, TxConfigFactory };
