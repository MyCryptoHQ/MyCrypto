import React, { useContext } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { SwapFromToDiagram } from './fields';
import { ISwapAsset } from '../types';
import { AccountDropdown, InlineErrorMsg } from 'v2/components';
import { ExtendedAccount, StoreAccount } from 'v2/types';
import { StoreContext } from 'v2/services';
import { WALLET_STEPS } from '../helpers';
import { weiToFloat } from 'v2/utils';
import { translate } from 'translations';

const Label = styled.div`
  font-size: 18px;
  width: 100%;
  line-height: 1;
  text-align: left;
  font-weight: normal;
  margin-bottom: 9px;
  color: ${props => props.theme.text};
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
  setAccount(account: ExtendedAccount): void;
  goToNextStep(): void;
}

export default function SelectAddress(props: Props) {
  const { goToNextStep, account, setAccount, fromAsset, toAsset, fromAmount, toAmount } = props;

  const { accounts } = useContext(StoreContext);

  // filter accounts based on wallet type and sufficient balance
  // TODO: include fees check
  const filteredAccounts = accounts.filter(acc => {
    if (!WALLET_STEPS[acc.wallet]) {
      return false;
    }

    const asset = acc.assets.find(x => x.ticker === fromAsset.symbol);
    if (!asset) {
      return false;
    }

    const amount = weiToFloat(asset.balance, asset.decimal);
    if (amount < Number(fromAmount)) {
      return false;
    }

    return true;
  });

  return (
    <div>
      <SwapFromToDiagram
        fromSymbol={fromAsset.symbol}
        toSymbol={toAsset.symbol}
        fromAmount={fromAmount}
        toAmount={toAmount}
      />
      <Label>{translate('ACCOUNT_SELECTION_PLACEHOLDER')}</Label>
      <AccountDropdown
        name="account"
        value={account}
        accounts={filteredAccounts}
        onSelect={(option: ExtendedAccount) => {
          setAccount(option);
        }}
      />
      {!filteredAccounts.length && (
        <InlineErrorMsg>{translate('ACCOUNT_SELECTION_NO_FUNDS')}</InlineErrorMsg>
      )}

      <StyledButton disabled={!account} onClick={goToNextStep}>
        {translate('ACTION_6')}
      </StyledButton>
    </div>
  );
}
