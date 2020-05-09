import { useContext } from 'react';

import { TUseStateReducerFactory, fromTxReceiptObj, makeTxConfigFromSignedTx } from '@utils';
import { ITxReceipt, ITxConfig, ISignedTx, NetworkId } from '@types';
import { DEFAULT_NETWORK } from '@config';
import { NetworkContext, AssetContext, StoreContext } from '@services/Store';
import { ProviderHandler } from '@services/EthService';
import { ToastContext } from '@features/Toasts';

const broadcastTxInitialState: State = {
  network: DEFAULT_NETWORK,
  txReceipt: undefined,
  txConfig: undefined,
  signedTx: ''
};

interface State {
  network: NetworkId;
  txConfig: ITxConfig | undefined;
  txReceipt: ITxReceipt | undefined;
  signedTx: ISignedTx;
}

const BroadcastTxConfigFactory: TUseStateReducerFactory<State> = ({ state, setState }) => {
  const { networks, getNetworkById } = useContext(NetworkContext);
  const { assets } = useContext(AssetContext);
  const { displayToast, toastTemplates } = useContext(ToastContext);
  const { accounts } = useContext(StoreContext);

  const handleNetworkChanged = (network: NetworkId) => {
    setState((prevState: State) => ({
      ...prevState,
      network
    }));
  };

  const handleSendClicked = (signedTx: ISignedTx, cb: any) => {
    const { network } = state;
    const txConfig = makeTxConfigFromSignedTx(signedTx, assets, networks, accounts, {
      network: getNetworkById(network)
    } as ITxConfig);

    setState((prevState: State) => ({
      ...prevState,
      txConfig,
      signedTx
    }));

    cb();
  };

  const handleConfirmClick = async (cb: any) => {
    const { txConfig, signedTx } = state;
    const provider = new ProviderHandler(txConfig!.network);

    try {
      const response = await provider.sendRawTx(signedTx);
      const txReceipt = fromTxReceiptObj(response)(assets, networks) || {};
      setState((prevState: State) => ({
        ...prevState,
        txReceipt
      }));
      cb();
    } catch (err) {
      console.debug(`[BroadcastTx] ${err}`);
      displayToast(toastTemplates.failedTransaction);
    }
  };

  const handleResetFlow = (cb: any) => {
    setState(broadcastTxInitialState);
    cb();
  };

  return {
    handleNetworkChanged,
    handleSendClicked,
    handleConfirmClick,
    handleResetFlow,
    broadcastTxState: state
  };
};

export { broadcastTxInitialState, BroadcastTxConfigFactory };
