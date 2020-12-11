import React, { useContext, useEffect, useReducer } from 'react';

import { parse } from 'query-string';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { GeneralStepper, TxReceiptWithProtectTx } from '@components';
import { IStepperPath } from '@components/GeneralStepper/types';
import { MANDATORY_TRANSACTION_QUERY_PARAMS, ROUTE_PATHS } from '@config';
import { ProtectTxContext } from '@features/ProtectTransaction/ProtectTxProvider';
import { withProtectTxProvider } from '@helpers';
import {
  ProviderHandler,
  StoreContext,
  useAccounts,
  useAssets,
  useFeatureFlags,
  useNetworks
} from '@services';
import { translateRaw } from '@translations';
import { IFormikFields, ISignedTx, ITxConfig, ITxReceipt, TxQueryTypes } from '@types';
import { getParam, isWeb3Wallet } from '@utils';
import { isEmpty } from '@vendor';

import {
  ConfirmTransactionWithProtectTx,
  SendAssetsFormWithProtectTx,
  SignTransactionWithProtectTx
} from './components';
import { parseQueryParams } from './helpers';
import { initialState, sendAssetsReducer } from './SendAssets.reducer';

function SendAssets({ location }: RouteComponentProps) {
  const [reducerState, dispatch] = useReducer(sendAssetsReducer, initialState);
  const {
    state: { enabled, protectTxShow, isPTXFree },
    setProtectTxTimeoutFunction
  } = useContext(ProtectTxContext);
  const { accounts } = useContext(StoreContext);
  const { assets } = useAssets();
  const { networks } = useNetworks();
  const { featureFlags } = useFeatureFlags();

  const query = parse(location.search);
  const res = MANDATORY_TRANSACTION_QUERY_PARAMS.reduce(
    (obj, param) => ({ ...obj, [param]: getParam(query, param) }),
    {}
  );

  useEffect(() => {
    const txConfigInit = parseQueryParams(parse(location.search))(networks, assets, accounts);
    if (
      !txConfigInit ||
      txConfigInit.type === reducerState.txQueryType ||
      ![TxQueryTypes.SPEEDUP, TxQueryTypes.CANCEL].includes(txConfigInit.type)
    )
      return;

    if (!txConfigInit.txConfig || isEmpty(txConfigInit.txConfig)) {
      console.debug(
        '[PrefilledTxs]: Error - Missing params. Requires gasPrice, gasLimit, to, data, nonce, from, value, and chainId'
      );
      return;
    }

    dispatch({
      type: sendAssetsReducer.actionTypes.SET_TXCONFIG,
      payload: { txConfig: txConfigInit.txConfig, txQueryType: txConfigInit.type }
    });
  }, [res]);

  // Due to MetaMask deprecating eth_sign method,
  // it has different step order, where sign and send are one panel
  const web3Steps: IStepperPath[] = [
    {
      label: 'Send Assets',
      component: SendAssetsFormWithProtectTx,
      props: (({ txConfig }) => ({ txConfig }))(reducerState),
      actions: (form: IFormikFields, cb: any) => {
        if (enabled && !isPTXFree) {
          form.nonceField = (parseInt(form.nonceField, 10) + 1).toString();
        }
        dispatch({ type: sendAssetsReducer.actionTypes.FORM_SUBMIT, payload: { form, assets } });
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
        dispatch({ type: sendAssetsReducer.actionTypes.WEB3_SIGN_SUCCESS, payload });
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
        if (enabled && !isPTXFree) {
          form.nonceField = (parseInt(form.nonceField, 10) + 1).toString();
        }
        dispatch({ type: sendAssetsReducer.actionTypes.FORM_SUBMIT, payload: { form, assets } });
        cb();
      }
    },
    {
      label: '',
      component: SignTransactionWithProtectTx,
      props: (({ txConfig }) => ({ txConfig }))(reducerState),
      actions: (payload: ITxConfig | ISignedTx, cb: any) => {
        dispatch({
          type: sendAssetsReducer.actionTypes.SIGN_SUCCESS,
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
          setProtectTxTimeoutFunction(() =>
            dispatch({ type: sendAssetsReducer.actionTypes.REQUEST_SEND, payload })
          );
        } else {
          dispatch({ type: sendAssetsReducer.actionTypes.REQUEST_SEND, payload });
        }
        if (cb) {
          cb();
        }
      }
    },
    {
      label: ' ',
      component: TxReceiptWithProtectTx,
      props: (({ txConfig, txReceipt, txQueryType }) => ({
        txConfig,
        txReceipt,
        txQueryType
      }))(reducerState)
    }
  ];

  const getPath = () => {
    const { senderAccount } = reducerState.txConfig!;
    const walletSteps =
      senderAccount && isWeb3Wallet(senderAccount.wallet) ? web3Steps : defaultSteps;
    if (
      reducerState.txQueryType &&
      [TxQueryTypes.CANCEL, TxQueryTypes.SPEEDUP].includes(reducerState.txQueryType)
    ) {
      return walletSteps.slice(1, walletSteps.length);
    }
    return walletSteps;
  };

  const { addTxToAccount } = useAccounts();

  // Adds TX to history
  useEffect(() => {
    if (reducerState.txReceipt) {
      addTxToAccount(reducerState.txConfig!.senderAccount, reducerState.txReceipt);
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
        .then((payload) => dispatch({ type: sendAssetsReducer.actionTypes.SEND_SUCCESS, payload }));
    }
  }, [reducerState.send]);

  return (
    <GeneralStepper
      steps={getPath()}
      txNumber={reducerState.txNumber}
      defaultBackPath={ROUTE_PATHS.DASHBOARD.path}
      defaultBackPathLabel={translateRaw('DASHBOARD')}
      completeBtnText={translateRaw('SEND_ASSETS_SEND_ANOTHER')}
      wrapperClassName={`send-assets-stepper ${protectTxShow ? 'has-side-panel' : ''}`}
      basic={featureFlags.PROTECT_TX}
    />
  );
}

export default withRouter(withProtectTxProvider(SendAssets));
