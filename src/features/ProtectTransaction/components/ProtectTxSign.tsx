import React, { FC, useCallback, useContext } from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';

import { SPACING } from '@theme';
import CloseIcon from '@components/icons/CloseIcon';
import ProtectIcon from '@components/icons/ProtectIcon';
import { ITxConfig, ITxHash, ITxSigned, Network, StoreAccount } from '@types';
import { WALLET_STEPS } from '@components/SignTransactionWallets';

import ProtectTxBase from './ProtectTxBase';
import { ProtectTxContext } from '../ProtectTxProvider';

const SignProtectedTransaction = styled(ProtectTxBase)`
  .SignTransactionKeystore {
    &-title {
      height: auto;
      margin-top: ${SPACING.SM};
    }
  }

  .SignTransactionWeb3 {
    &-img {
      min-width: 100%;
    }
  }
`;

const Loader = styled.div`
  margin-top: ${SPACING.BASE};
`;

interface Props {
  txConfig: ITxConfig;
  readonly account?: StoreAccount;
  readonly network?: Network;
  handleProtectTxConfirmAndSend(payload: ITxHash | ITxSigned): void;
}

export const ProtectTxSign: FC<Props> = (props) => {
  const { goToInitialStepOrFetchReport } = useContext(ProtectTxContext);

  const { txConfig, handleProtectTxConfirmAndSend, account, network } = props;

  const onProtectMyTransactionCancelClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement & SVGSVGElement, MouseEvent>) => {
      e.preventDefault();

      if (goToInitialStepOrFetchReport) {
        goToInitialStepOrFetchReport();
      }
    },
    []
  );

  const getSignComponent = useCallback(() => {
    if (!isEmpty(txConfig) && values(txConfig).length && account && network) {
      const SignComponent = WALLET_STEPS[account.wallet];
      const signComponentProps = {
        network,
        senderAccount: account,
        rawTransaction: txConfig,
        onSuccess: async (payload: ITxHash | ITxSigned) =>
          await handleProtectTxConfirmAndSend(payload)
      };

      // @ts-ignore
      return <SignComponent {...signComponentProps} />;
    }

    return <Loader className="loading" />;
  }, [txConfig, account, network]);

  return (
    <SignProtectedTransaction>
      <CloseIcon size="lg" onClick={onProtectMyTransactionCancelClick} />
      <ProtectIcon size="lg" />
      {getSignComponent()}
    </SignProtectedTransaction>
  );
};
