import { useContext } from 'react';
import { Transaction as EthTx } from 'ethereumjs-tx';
import { toBuffer, addHexPrefix } from 'ethereumjs-util';
import { parseTransaction, Transaction } from 'ethers/utils';
import BN from 'bn.js';

import { TUseStateReducerFactory, toChecksumAddressByChainId, fromTxReceiptObj } from 'v2/utils';
import { ITxReceipt, ITxConfig, ISignedTx, NetworkId } from 'v2/types';
import { DEFAULT_NETWORK } from 'v2/config';
import { translateRaw } from 'v2/translations';
import { NetworkContext, getAssetByUUID, AssetContext } from 'v2/services/Store';
import { fromWei, ProviderHandler } from 'v2/services/EthService';
import { ToastContext } from 'v2/features/Toasts';

const broadcastTxInitialState: State = {
  network: DEFAULT_NETWORK,
  txReceipt: undefined,
  txConfig: undefined,
  signedTransaction: '',
  transaction: undefined,
  networkSelectError: ''
};

interface State {
  network: NetworkId;
  txConfig: ITxConfig | undefined;
  txReceipt?: ITxReceipt;
  signedTransaction: ISignedTx;
  networkSelectError: string;
  transaction: EthTx | undefined;
}

const BroadcastTxConfigFactory: TUseStateReducerFactory<State> = ({ state, setState }) => {
  const { networks, getNetworkByChainId, getNetworkByName } = useContext(NetworkContext);
  const { assets } = useContext(AssetContext);
  const { displayToast, toastTemplates } = useContext(ToastContext);

  const handleNetworkChanged = (network: NetworkId) => {
    setState((prevState: State) => ({
      ...prevState,
      network
    }));
  };

  const handleSendClicked = (cb: any) => {
    const { transaction, network } = state;
    if (!transaction) return;

    const { to, value, gasPrice, gasLimit, nonce, data } = transaction;
    const chainId = transaction.getChainId();
    const from = transaction.getSenderAddress();

    const txNetwork = chainId ? getNetworkByChainId(chainId) : getNetworkByName(network);

    if (!txNetwork) {
      setState((prevState: State) => ({
        ...prevState,
        networkSelectError: translateRaw('BROADCAST_TX_INVALID_CHAIN_ID')
      }));
      return;
    }

    const txAmount = fromWei(new BN(value, 16), 'ether');
    const txBaseAsset = getAssetByUUID(assets)(txNetwork.baseAsset)!;
    const txToAddress = toChecksumAddressByChainId(to.toString('hex'), chainId);
    const txFromAddress = toChecksumAddressByChainId(from.toString('hex'), chainId);
    const txGasPrice = new BN(gasPrice, 16).toString();
    const txGasLimit = new BN(gasLimit, 16).toString();
    const txValue = new BN(value, 16).toString();
    const txNonce = new BN(nonce, 16).toString();
    const txData = addHexPrefix(data.toString('hex'));

    const txConfig: any = {
      amount: txAmount,
      receiverAddress: txToAddress,
      senderAccount: { address: txFromAddress, assets: [] },
      network: txNetwork,
      asset: txBaseAsset,
      baseAsset: txBaseAsset,
      gasPrice: txGasPrice,
      gasLimit: txGasLimit,
      value: txValue,
      nonce: txNonce,
      data: txData
    };

    setState((prevState: State) => ({
      ...prevState,
      networkSelectError: '',
      txConfig
    }));

    cb();
  };

  const handleSignedTxChanged = (signedTransaction: string) => {
    try {
      const bufferTransaction = toBuffer(signedTransaction);
      const decoded: Transaction = parseTransaction(bufferTransaction);
      const transaction = new EthTx(bufferTransaction, { chain: decoded.chainId });
      setState((prevState: State) => ({
        ...prevState,
        transaction,
        signedTransaction
      }));
    } catch (err) {
      setState((prevState: State) => ({
        ...prevState,
        transaction: undefined
      }));
      console.debug(`[BroadcastTx] ${err}`);
    }
  };

  const handleConfirmClick = async (cb: any) => {
    const { txConfig, signedTransaction } = state;
    const provider = new ProviderHandler(txConfig!.network);

    try {
      const response = await provider.sendRawTx(signedTransaction);
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
    handleSignedTxChanged,
    handleConfirmClick,
    handleResetFlow,
    broadcastTxState: state
  };
};

export { broadcastTxInitialState, BroadcastTxConfigFactory };
