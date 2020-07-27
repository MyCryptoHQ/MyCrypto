import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Panel } from '@mycrypto/ui';

import {
  IFormikFields,
  ISignedTx,
  IStepComponentProps,
  ITxHash,
  ITxObject,
  ITxReceipt,
  ITxSigned
} from '@types';
import { isWeb3Wallet, useTxMulti, useScreenSize } from '@utils';
import { BREAK_POINTS } from '@theme';
import { processFormDataToTx } from '@features/SendAssets/helpers';
import { PROTECTED_TX_FEE_ADDRESS } from '@config';
import { StoreContext, useFeatureFlags } from '@services';
import { ContentPanel } from '@components';

import { ProtectTxProtection } from './ProtectTxProtection';
import { ProtectTxSign } from './ProtectTxSign';
import { ProtectTxReport } from './ProtectTxReport';
import { ProtectTxContext } from '../ProtectTxProvider';
import ProtectTxModalBackdrop from './ProtectTxModalBackdrop';
import { ProtectTxStepper } from './ProtectTxStepper';

const WithProtectTxWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;

  div > section {
    margin-bottom: 0;
    height: 100%;
  }
`;

const WithProtectTxMain = styled.div<{ protectTxShow: boolean }>`
  position: relative;
  flex: 0 0 100%;
  width: 100%;
  max-width: 100%;

  @media (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    flex: 0 0 calc(650px - 4.5rem);
    width: calc(650px - 4.5rem);
    max-width: calc(650px - 4.5rem);
  }
`;

const WithProtectTxSide = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 375px;
  min-width: 375px;
  max-width: 100vw;

  @media (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    position: initial;
    width: 375px;
    margin-left: 1rem;
    min-height: calc(100% + 115px);
    transform: unset;

    section {
      position: relative;
      height: 100%;
      padding: 30px 15px 15px;
    }
  }
`;

interface Props extends IStepComponentProps {
  customDetails?: JSX.Element;
}

export function withProtectTx(WrappedComponent: React.ComponentType<Props>, heading: string = '') {
  return function WithProtectTransaction({
    txConfig: txConfigMain,
    signedTx: signedTxMain,
    txReceipt: txReceiptMain,
    onComplete: onCompleteMain,
    customDetails,
    resetFlow
  }: Props) {
    const { isMyCryptoMember } = useContext(StoreContext);
    const [protectTx, setProtectTx] = useState<ITxObject | null>(null);
    const { state, initWith, prepareTx, sendTx } = useTxMulti();
    const { transactions, _currentTxIdx, account, network } = state;

    const {
      state: { protectTxShow, stepIndex },
      setWeb3Wallet,
      goToNextStep,
      handleTransactionReport,
      showHideProtectTx
    } = useContext(ProtectTxContext);

    const { IS_ACTIVE_FEATURE } = useFeatureFlags();

    // Wait for useTxMulti to finish initWith
    useEffect(() => {
      if (account && network && protectTx) {
        prepareTx(protectTx);
        setWeb3Wallet(isWeb3Wallet(account.wallet), account.wallet);
        goToNextStep();
      }
    }, [account, network, protectTx]);

    const reportStep = {
      component: ProtectTxReport
    };

    const protectTxStepperSteps = isMyCryptoMember
      ? [
          {
            component: ProtectTxProtection,
            actions: {
              handleProtectTxSubmit: async () => {
                await handleTransactionReport();
                goToNextStep();
              }
            }
          },
          reportStep
        ]
      : [
          {
            component: ProtectTxProtection,
            actions: {
              handleProtectTxSubmit: async (payload: IFormikFields) => {
                const { account: formAccount, network: formNetwork } = payload;
                // @todo: initWith requires some object for every tx, because of R.adjust can't operate on empty array
                await initWith(() => Promise.resolve([{}]), formAccount, formNetwork);
                setProtectTx({
                  ...processFormDataToTx(payload),
                  to: PROTECTED_TX_FEE_ADDRESS
                });
              }
            }
          },
          {
            component: ProtectTxSign,
            props: {
              txConfig: transactions[_currentTxIdx] && transactions[_currentTxIdx].txRaw,
              account,
              network
            },
            actions: {
              handleProtectTxConfirmAndSend: async (payload: ITxHash | ITxSigned) => {
                await handleTransactionReport();
                await sendTx(payload);
                goToNextStep();
              }
            }
          },
          reportStep
        ];

    const { isMdScreen } = useScreenSize();

    const toggleProtectTxShow = useCallback(
      (e) => {
        e.preventDefault();

        if (showHideProtectTx) {
          showHideProtectTx(!protectTxShow);
        }
      },
      [showHideProtectTx]
    );

    return (
      <WithProtectTxWrapper>
        <ContentPanel heading={heading} basic={!IS_ACTIVE_FEATURE.PROTECT_TX}>
          <WithProtectTxMain protectTxShow={protectTxShow}>
            <WrappedComponent
              txConfig={txConfigMain}
              signedTx={signedTxMain}
              txReceipt={txReceiptMain}
              onComplete={(values: IFormikFields | ITxReceipt | ISignedTx | null) => {
                onCompleteMain(values);
              }}
              customDetails={customDetails}
              resetFlow={resetFlow}
            />
          </WithProtectTxMain>
        </ContentPanel>
        {protectTxShow && (
          <>
            {!isMdScreen && <ProtectTxModalBackdrop onBackdropClick={toggleProtectTxShow} />}
            <WithProtectTxSide>
              <Panel>
                <ProtectTxStepper currentStepIndex={stepIndex} steps={protectTxStepperSteps} />
              </Panel>
            </WithProtectTxSide>
          </>
        )}
      </WithProtectTxWrapper>
    );
  };
}
