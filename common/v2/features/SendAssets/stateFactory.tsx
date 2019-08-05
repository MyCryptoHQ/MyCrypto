import { TUseApiFactory } from 'v2/services';
import { ITxConfig, ITxReceipt, IFormikFields, TStepAction, ISignedTx } from './types';
import { processFormDataToWeb3Tx, processFormDataToTx } from './process';
import ProviderHandler from 'v2/config/networks/providerHandler';

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
    const isWeb3Account = payload.account.wallet === 'web3';
    const processedTx = isWeb3Account
      ? processFormDataToWeb3Tx(payload)
      : processFormDataToTx(payload);
    /* TODO: If tx processing fails, trigger error message to user */
    const data: ITxConfig = {
      gasLimit: processedTx
        ? 'gas' in processedTx
          ? processedTx.gas
          : processedTx.gasLimit
        : payload.gasLimitField,
      gasPrice: processedTx ? processedTx.gasPrice : payload.gasPriceField,
      nonce: processedTx ? processedTx.nonce : payload.nonceField,
      data: processedTx ? processedTx.data : payload.txDataField,
      value: processedTx ? processedTx.value : payload.amount,
      chainId: processedTx ? processedTx.chainId : payload.network.chainId,
      to: processedTx ? processedTx.to : payload.receiverAddress,
      amount: payload.amount,
      senderAccount: payload.account,
      receiverAddress: payload.receiverAddress,
      network: payload.network,
      asset: payload.asset
    };
    setState((prevState: State) => ({
      ...prevState,
      txConfig: data
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
  const handleConfirmAndSend: TStepAction = (payload, after) => {
    const provider = new ProviderHandler(state.txConfig.network);
    // tslint:disable-next-line:no-console
    console.log('payload: ' + payload);
    if (state.signedTx) {
      provider.sendRawTx(state.signedTx).then(returnedData => {
        let txReceipt: any;
        if (typeof returnedData === 'string') {
          // If returned data is a tx hash, not a receipt, then fetch the receipt and set to state
          provider.getTransactionByHash(returnedData).then(txData => {
            txReceipt = txData;
          });
        } else {
          txReceipt = returnedData;
        }
        setState((prevState: State) => ({
          ...prevState,
          txReceipt
        }));
        after();
      });
    }
  };

  const handleSignedTx: TStepAction = (payload: ITxReceipt | ISignedTx | any, after) => {
    if (typeof payload !== 'string' && 'hash' in payload) {
      setState((prevState: State) => ({
        ...prevState,
        txReceipt: payload
      }));

      after();
    } else if (typeof payload === 'string') {
      setState((prevState: State) => ({
        ...prevState,
        signedTx: payload
      }));
      after();
    }
  };

  return {
    handleFormSubmit,
    handleConfirmAndSign,
    handleConfirmAndSend,
    handleSignedTx,
    txConfig: state.txConfig,
    txReceipt: state.txReceipt,
    signedTx: state.signedTx
  };
};

export { txConfigInitialState, TxConfigFactory };
