import React from 'react';

import styled from 'styled-components';

import { Spinner, Typography, WALLET_STEPS } from '@components';
import translate from '@translations';
import { StoreAccount } from '@types';

const AllowanceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Loader = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const LoaderText = styled(Typography)`
  margin-left: 8px;
`;

interface Props {
  senderAccount: StoreAccount;
  isSubmitting: boolean;
}

export default function SetAllowance(props: Props) {
  const { senderAccount, isSubmitting } = props;
  const Component: any = WALLET_STEPS[senderAccount.wallet];

  return (
    <AllowanceWrapper>
      <Component {...props} />
      {isSubmitting && (
        <Loader>
          <Spinner size={2} />{' '}
          <LoaderText bold={true} fontSize="1.13em" value={translate('SWAP_SETTING_ALLOWANCE')} />
        </Loader>
      )}
    </AllowanceWrapper>
  );
}
