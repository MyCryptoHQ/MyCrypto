import React, { useContext, useState } from 'react';

import { GeneralStepper, TxReceipt, ConfirmTransaction } from 'v2/components';
import { ROUTE_PATHS } from 'v2/config';
import { translateRaw } from 'v2/translations';
import {
  fromSignedTxToTxObject,
  fromTxObjectToTxConfig,
  fromTxParcelToTxReceipt,
  getCurrentTxFromTxMulti,
  useTxMulti
} from 'v2/utils';
import { IStepperPath } from 'v2/components/GeneralStepper/types';
import { ITxSigned, NetworkId } from 'v2/types';

import { BroadcastTx } from './components';
import { NetworkContext } from '../../services/Store/Network';

const BroadcastTransactionFlow = () => {
  const { getNetworkById } = useContext(NetworkContext);

  const [signedTx, setSignedTx] = useState<ITxSigned | null>(null);
  const { state, initWith, prepareTx, sendTx, reset } = useTxMulti();
  const { transactions, _currentTxIdx, account, network } = state;

  const txParcel = getCurrentTxFromTxMulti(transactions, _currentTxIdx);
  const { txRaw } = txParcel;
  const txConfig = fromTxObjectToTxConfig(txRaw, account);
  const txReceipt = fromTxParcelToTxReceipt(txParcel, account);

  const steps: IStepperPath[] = [
    {
      label: translateRaw('BROADCAST_TX_TITLE'),
      component: BroadcastTx,
      props: {
        signedTx,
        network
      },
      actions: async (txSigned: ITxSigned, networkId: NetworkId, cb: any) => {
        const txObject = fromSignedTxToTxObject(txSigned);
        const selectedNetwork = getNetworkById(networkId);

        await initWith(() => Promise.resolve([{}]), selectedNetwork);
        await prepareTx(txObject);
        setSignedTx(txSigned);

        if (cb) {
          cb();
        }
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
