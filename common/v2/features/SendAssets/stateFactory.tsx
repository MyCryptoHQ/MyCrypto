import { TUseApiFactory } from 'v2/services';
import { ITxConfig, ITxReceipt, IFormikFields, TStepAction } from './types';
import { processFormDataToTx } from './process';
import { IHexStrTransaction } from 'mycrypto-shepherd/dist/lib/types';

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
  const handleFormSubmit: TStepAction = (payload: IFormikFields, after) => {
    const processedTx: IHexStrTransaction | undefined = processFormDataToTx(payload);
    let data: ITxConfig;
    if (processedTx) {
      data = {
        gasLimit: processedTx.gasLimit, // @TODO update with correct value.
        gasPrice: processedTx.gasPrice, // @TODO update with correct value.
        nonce: processedTx.nonce, // @TODO update with correct value.
        data: processedTx.data,
        value: processedTx.value,
        chainId: processedTx.chainId,
        to: processedTx.to,
        amount: processedTx.gasLimit,
        senderAccount: payload.account,
        receiverAddress: payload.receiverAddress,
        network: payload.network,
        asset: payload.asset
      };
    } else {
      data = {
        gasLimit: payload.gasLimitEstimated || payload.gasLimitField, // @TODO update with correct value.
        gasPrice: payload.gasPriceField, // @TODO update with correct value.
        nonce: payload.nonceField, // @TODO update with correct value.
        data: payload.txDataField,
        value: payload.amount,
        chainId: payload.network.chainId,
        to: payload.receiverAddress,
        amount: payload.amount,
        senderAccount: payload.account,
        receiverAddress: payload.receiverAddress,
        network: payload.network,
        asset: payload.asset
      };
    }
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

  /* tslint:disable */
  // @ts-ignore
  const handleConfirmAndSend: TStepAction = (payload, after) => {};

  // @ts-ignore
  const handleSignedTx: TStepAction = (payload, after) => {};
  /* tslint:enable */

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
