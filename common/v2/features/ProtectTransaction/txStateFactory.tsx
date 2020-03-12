import { useCallback, useContext } from 'react';
import { Arrayish, hexlify } from 'ethers/utils';

import { fromTxReceiptObj, makeTxConfigFromSignedTx, TUseStateReducerFactory } from 'v2/utils';
import { AssetContext } from 'v2/services/Store/Asset';
import {
  IFormikFields,
  ISignedTx,
  ITxConfig,
  ITxObject,
  ITxReceipt,
  Asset,
  ITxStatus
} from 'v2/types';
import { hexWeiToString } from 'v2/services/EthService/utils';
import { processFormDataToTx } from 'v2/features/SendAssets/helpers';
import { getBaseAssetByNetwork, NetworkContext } from 'v2/services/Store/Network';
import { ProviderHandler } from 'v2/services/EthService/network';
import { AccountContext } from 'v2/services/Store/Account';
import { getNonce } from 'v2/services/EthService';
// import { PROTECTED_TX_FEE_ADDRESS } from 'v2/config';
import { StoreContext } from 'v2/services/Store';

const protectedTxConfigInitialState = {
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

const ProtectedTxConfigFactory: TUseStateReducerFactory<State> = ({ state, setState }) => {
  const { assets } = useContext(AssetContext);
  const { networks } = useContext(NetworkContext);
  const { accounts } = useContext(StoreContext);
  const { addNewTransactionToAccount } = useContext(AccountContext);

  const handleProtectedTransactionSubmit = useCallback(
    async (payload: IFormikFields): Promise<void> => {
      // Use actual recipient address for sending FEE, for our QA
      /*payload.address = {
        display: PROTECTED_TX_FEE_ADDRESS,
        value: PROTECTED_TX_FEE_ADDRESS
      };*/

      const {
        gasEstimates: { safeLow },
        network,
        account
      } = payload;
      const transSafeLow = Math.min(safeLow, 10);

      payload = {
        ...payload,
        nonceField: (await getNonce(network, account)).toString()
      };

      if (payload.advancedTransaction) {
        payload = {
          ...payload,
          gasPriceField: transSafeLow.toString()
        };
      } else {
        payload = {
          ...payload,
          gasPriceSlider: transSafeLow.toString()
        };
      }

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

      return Promise.resolve();
    },
    [state, setState, assets]
  );

  const handleProtectedTransactionConfirmAndSend = useCallback(
    (payload: Arrayish | ITxConfig, cb: () => void, isWeb3Wallet: boolean = false) => {
      if (isWeb3Wallet) {
        setState((prevState: State) => ({
          ...prevState,
          txReceipt: payload as ITxConfig
        }));

        // Payload is tx hash or receipt
        // @ts-ignore
        const txReceipt =
          typeof payload === 'string'
            ? {
                ...state.txConfig,
                hash: payload,
                to: state.txConfig.receiverAddress,
                from: state.txConfig.senderAccount.address
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
      } else {
        const provider = new ProviderHandler(state.txConfig.network);

        const signedTx = hexlify(payload as Arrayish);

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
              txConfig: makeTxConfigFromSignedTx(
                payload as Arrayish,
                assets,
                networks,
                accounts,
                prevState.txConfig
              ),
              txReceipt,
              signedTx
            }));
          })
          .finally(cb);
      }
    },
    [state, setState, assets, networks, addNewTransactionToAccount, accounts]
  );

  const txFactoryState: State = {
    txConfig: state.txConfig,
    txReceipt: state.txReceipt,
    signedTx: state.signedTx
  };

  return {
    handleProtectedTransactionSubmit,
    handleProtectedTransactionConfirmAndSend,
    protectedTransactionTxFactoryState: txFactoryState
  };
};

export { protectedTxConfigInitialState, ProtectedTxConfigFactory };
