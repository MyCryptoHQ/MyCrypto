import React from 'react';
import styled from 'styled-components';

import { translate } from 'translations';

import { StoreAccount } from 'v2/types';
import { Spinner, Typography } from 'v2/components';

import { WALLET_STEPS } from '../helpers';

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
  account: StoreAccount;
  isSettingAllowance: boolean;
}

export default function SetAllowance(props: Props) {
  const { account, isSettingAllowance } = props;
  const Component: any = account && WALLET_STEPS[account.wallet];

  return (
    <AllowanceWrapper>
      <Component {...props} />
      {isSettingAllowance && (
        <Loader>
          <Spinner size={'x2'} />{' '}
          <LoaderText bold={true} fontSize="1.13em" value={translate('SWAP_SETTING_ALLOWANCE')} />
        </Loader>
      )}
    </AllowanceWrapper>
  );
}
