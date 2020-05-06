import React, { useContext, useEffect, useRef, useState } from 'react';
import isFunction from 'lodash/isFunction';

import { GeneralStepper, TxReceipt, ConfirmTransaction } from 'v2/components';
import { ROUTE_PATHS } from 'v2/config';
import { translateRaw } from 'v2/translations';
import {
  fromSignedTxToTxConfig,
  fromSignedTxToTxObject,
  useTxMulti,
  fromTxParcelToTxReceipt,
  getCurrentTxFromTxMulti
} from 'v2/utils';
import { IStepperPath } from 'v2/components/GeneralStepper/types';
import { ITxConfig, ITxSigned, Network, NetworkId } from 'v2/types';
import { StoreContext, AssetContext, NetworkContext } from 'v2/services';

import { BroadcastTx } from './components';

const BroadcastTransactionFlow = () => {
  const { networks, getNetworkById } = useContext(NetworkContext);
  const { assets } = useContext(AssetContext);
  const { accounts } = useContext(StoreContext);

  const goToNextStep = useRef<() => void>();
  const [signedTx, setSignedTx] = useState<ITxSigned | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const { state, init, prepareTx, sendTx, reset } = useTxMulti();
  const { transactions, _currentTxIdx, network } = state;

  const txConfig = fromSignedTxToTxConfig(signedTx!, assets, networks, accounts, {
    network
  } as ITxConfig);
  const txParcel = getCurrentTxFromTxMulti(transactions, _currentTxIdx);
  const txReceipt = fromTxParcelToTxReceipt(txParcel, txConfig?.senderAccount);

  useEffect(() => {
    if (isFunction(goToNextStep.current) && selectedNetwork && signedTx && txConfig) {
      const nextStep = goToNextStep.current;
      goToNextStep.current = undefined;
      const initializeTx = async () => {
        const txObject = fromSignedTxToTxObject(signedTx);
        await init([{}], txConfig?.senderAccount, selectedNetwork);
        await prepareTx(txObject);

        nextStep();
      };

      initializeTx();
    }
  }, [goToNextStep, selectedNetwork, signedTx, txConfig]);

  const steps: IStepperPath[] = [
    {
      label: translateRaw('BROADCAST_TX_TITLE'),
      component: BroadcastTx,
      props: {
        signedTx,
        network
      },
      actions: async (payload: { signedTx: string; networkId: NetworkId }, cb: any) => {
        const { signedTx: txSigned, networkId } = payload;

        setSignedTx(txSigned);
        setSelectedNetwork(getNetworkById(networkId));

        goToNextStep.current = cb;
      }
    },
    {
      label: translateRaw('CONFIRM_TX_MODAL_TITLE'),
      component: ConfirmTransaction,
      props: { txConfig },
      actions: async (_: any, cb: any) => {
        await sendTx(signedTx!);

        if (cb) {
          cb();
        }
      }
    },
    {
      label: translateRaw('BROADCAST_TX_RECEIPT_TITLE'),
      component: TxReceipt,
      props: { txConfig, txReceipt },
      actions: async (cb: any) => {
        await reset();
        if (cb) {
          cb();
        }
      }
    }
  ];

  return (
    <GeneralStepper
      steps={steps}
      defaultBackPath={ROUTE_PATHS.DASHBOARD.path}
      defaultBackPathLabel={translateRaw('DASHBOARD')}
      completeBtnText={translateRaw('BROADCAST_TX_BROADCAST_ANOTHER')}
    />
  );
};

export default BroadcastTransactionFlow;
