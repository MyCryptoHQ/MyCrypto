import React, { useContext } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import translate, { translateRaw } from 'v2/translations';

import { AccountDropdown, InlineErrorMsg, Typography } from 'v2/components';
import { StoreAccount } from 'v2/types';
import { StoreContext } from 'v2/services';

import { getAccountsWithAssetBalance } from '../helpers';
import { SwapFromToDiagram } from './fields';
import { ISwapAsset } from '../types';

const Label = styled(Typography)`
  line-height: 1;
  color: ${props => props.theme.text};
`;

const LabelWrapper = styled.div`
  width: 100%;
  text-align: left;
  margin-bottom: 9px;
`;

const StyledButton = styled(Button)`
  margin-top: 28px;
  width: 100%;
`;
interface Props {
  account: StoreAccount;
  fromAsset: ISwapAsset;
  toAsset: ISwapAsset;
  fromAmount: string;
  toAmount: string;
  handleAccountSelected(account: StoreAccount): void;
  onSuccess(): void;
}

export default function SelectAddress(props: Props) {
  const {
    account,
    fromAsset,
    toAsset,
    fromAmount,
    toAmount,
    handleAccountSelected,
    onSuccess
  } = props;

  const { accounts, assets } = useContext(StoreContext);
  const filteredAccounts = getAccountsWithAssetBalance(accounts, fromAsset, fromAmount);

  return (
    <div>
      <SwapFromToDiagram
        fromSymbol={fromAsset.symbol}
        toSymbol={toAsset.symbol}
        fromAmount={fromAmount}
        toAmount={toAmount}
      />
      <LabelWrapper>
        <Label value={translateRaw('ACCOUNT_SELECTION_PLACEHOLDER')} fontSize="1.13em" />
      </LabelWrapper>
      <AccountDropdown
        name="account"
        value={account}
        accounts={filteredAccounts}
        onSelect={(option: StoreAccount) => {
          handleAccountSelected(option);
        }}
        asset={assets().find(x => x.ticker === fromAsset.symbol)}
      />
      {!filteredAccounts.length && (
        <InlineErrorMsg>{translate('ACCOUNT_SELECTION_NO_FUNDS')}</InlineErrorMsg>
      )}

      <StyledButton disabled={!account} onClick={onSuccess}>
        {translate('ACTION_6')}
      </StyledButton>
    </div>
  );
}
