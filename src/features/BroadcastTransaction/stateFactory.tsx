import { useContext } from 'react';

import { TUseStateReducerFactory, makePendingTxReceipt, makeTxConfigFromSignedTx } from '@utils';
import { ITxReceipt, ITxConfig, ISignedTx, NetworkId, ITxType, ITxHash } from '@types';
import { DEFAULT_NETWORK } from '@config';
import { NetworkContext, StoreContext, useAssets } from '@services/Store';
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
  const { assets } = useAssets();
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
    try {
      const { txConfig, signedTx } = state;
      if (!txConfig) {
        throw new Error();
      }
      const provider = new ProviderHandler(txConfig.network);
      const response = await provider.sendRawTx(signedTx);
      const pendingTxReceipt = makePendingTxReceipt(response.hash as ITxHash)(
        ITxType.STANDARD,
        txConfig
      );
      setState((prevState: State) => ({
        ...prevState,
        txReceipt: pendingTxReceipt
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
