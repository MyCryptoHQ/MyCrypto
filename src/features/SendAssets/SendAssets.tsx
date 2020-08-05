import React, { useContext, useReducer, useEffect } from 'react';

import { GeneralStepper, TxReceiptWithProtectTx } from '@components';
import { isWeb3Wallet, withProtectTxProvider } from '@utils';
import { ITxReceipt, ISignedTx, IFormikFields, ITxConfig } from '@types';
import { translateRaw } from '@translations';
import { ROUTE_PATHS } from '@config';
import { IStepperPath } from '@components/GeneralStepper/types';
import { ProtectTxContext } from '@features/ProtectTransaction/ProtectTxProvider';
import {
  StoreContext,
  useFeatureFlags,
  AccountContext,
  AssetContext,
  NetworkContext,
  ProviderHandler
} from '@services';

import { sendAssetsReducer, initialState } from './SendAssets.reducer';
import {
  ConfirmTransactionWithProtectTx,
  SendAssetsFormWithProtectTx,
  SignTransactionWithProtectTx
} from './components';
import { ActionType } from './types';

function SendAssets() {
  const [reducerState, dispatch] = useReducer(sendAssetsReducer, initialState);
  const {
    state: { protectTxEnabled, protectTxShow },
    setProtectTxTimeoutFunction
  } = useContext(ProtectTxContext);
  const { isMyCryptoMember, accounts } = useContext(StoreContext);
  const { assets } = useContext(AssetContext);
  const { networks } = useContext(NetworkContext);
  const { IS_ACTIVE_FEATURE } = useFeatureFlags();

  // Due to MetaMask deprecating eth_sign method,
  // it has different step order, where sign and send are one panel
  const web3Steps: IStepperPath[] = [
    {
      label: 'Send Assets',
      component: SendAssetsFormWithProtectTx,
      props: (({ txConfig }) => ({ txConfig }))(reducerState),
      actions: (form: IFormikFields, cb: any) => {
        if (protectTxEnabled && !isMyCryptoMember) {
          form.nonceField = (parseInt(form.nonceField, 10) + 1).toString();
        }
        dispatch({ type: ActionType.FORM_SUBMIT, payload: { form, assets } });
        cb();
      }
    },
    {
      label: translateRaw('CONFIRM_TX_MODAL_TITLE'),
      component: ConfirmTransactionWithProtectTx,
      props: (({ txConfig }) => ({ txConfig }))(reducerState),
      actions: (_: ITxConfig, cb: any) => cb()
    },
    {
      label: '',
      component: SignTransactionWithProtectTx,
      props: (({ txConfig }) => ({ txConfig }))(reducerState),
      actions: (payload: ITxReceipt | ISignedTx, cb: any) => {
        dispatch({ type: ActionType.WEB3_SIGN, payload });
        cb();
      }
    },
    {
      label: translateRaw('TRANSACTION_BROADCASTED'),
      component: TxReceiptWithProtectTx,
      props: (({ txConfig, txReceipt }) => ({ txConfig, txReceipt }))(reducerState)
    }
  ];

  const defaultSteps: IStepperPath[] = [
    {
      label: 'Send Assets',
      component: SendAssetsFormWithProtectTx,
      props: (({ txConfig }) => ({ txConfig }))(reducerState),
      actions: (form: IFormikFields, cb: any) => {
        if (protectTxEnabled && !isMyCryptoMember) {
          form.nonceField = (parseInt(form.nonceField, 10) + 1).toString();
        }
        dispatch({ type: ActionType.FORM_SUBMIT, payload: { form, assets } });
        cb();
      }
    },
    {
      label: '',
      component: SignTransactionWithProtectTx,
      props: (({ txConfig }) => ({ txConfig }))(reducerState),
      actions: (payload: ITxConfig | ISignedTx, cb: any) => {
        dispatch({
          type: ActionType.SIGN,
          payload: { signedTx: payload, assets, networks, accounts }
        });
        cb();
      }
    },
    {
      label: translateRaw('CONFIRM_TX_MODAL_TITLE'),
      component: ConfirmTransactionWithProtectTx,
      props: (({ txConfig, signedTx }) => ({ txConfig, signedTx }))(reducerState),
      actions: (payload: ITxConfig | ISignedTx, cb: any) => {
        if (setProtectTxTimeoutFunction) {
          setProtectTxTimeoutFunction(() => dispatch({ type: ActionType.SEND, payload }));
        } else {
          dispatch({ type: ActionType.SEND, payload });
        }
        if (cb) {
          cb();
        }
      }
    },
    {
      label: ' ',
      component: TxReceiptWithProtectTx,
      props: (({ txConfig, txReceipt }) => ({
        txConfig,
        txReceipt,
        pendingButton: {
          text: translateRaw('TRANSACTION_BROADCASTED_RESUBMIT'),
          action: (cb: any) => {
            dispatch({ type: ActionType.RESUBMIT, payload: {} });
            cb();
          }
        }
      }))(reducerState)
    }
  ];

  const getPath = () => {
    const { senderAccount } = reducerState.txConfig!;
    return senderAccount && isWeb3Wallet(senderAccount.wallet) ? web3Steps : defaultSteps;
  };

  const { addNewTxToAccount } = useContext(AccountContext);

  // Adds TX to history
  useEffect(() => {
    if (reducerState.txReceipt) {
      addNewTxToAccount(reducerState.txConfig!.senderAccount, reducerState.txReceipt);
    }
  }, [reducerState.txReceipt]);

  // Sends signed TX
  useEffect(() => {
    if (
      reducerState.send &&
      reducerState.signedTx &&
      !isWeb3Wallet(reducerState.txConfig!.senderAccount.wallet)
    ) {
      const { txConfig, signedTx } = reducerState;
      const provider = new ProviderHandler(txConfig!.network);

      provider
        .sendRawTx(signedTx)
        .then((payload) => dispatch({ type: ActionType.AFTER_SEND, payload }));
    }
  }, [reducerState.send]);

  return (
    <GeneralStepper
      steps={getPath()}
      defaultBackPath={ROUTE_PATHS.DASHBOARD.path}
      defaultBackPathLabel={translateRaw('DASHBOARD')}
      completeBtnText={translateRaw('SEND_ASSETS_SEND_ANOTHER')}
      wrapperClassName={`send-assets-stepper ${protectTxShow ? 'has-side-panel' : ''}`}
      basic={IS_ACTIVE_FEATURE.PROTECT_TX}
    />
  );
}

export default withProtectTxProvider(SendAssets);
