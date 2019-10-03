import React, { useContext } from 'react';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import { SwapFromToDiagram } from './fields';
import { ISwapAsset } from '../types';
import { AccountDropdown } from 'v2/components';
import { StoreContext } from 'v2';
import { ExtendedAccount, StoreAccount } from 'v2/types';

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
  asset: ISwapAsset;
  receiveAsset: ISwapAsset;
  sendAmount: string;
  receiveAmount: string;
  setAccount(account: ExtendedAccount): void;
  goToNextStep(): void;
}

export default function SelectAddress(props: Props) {
  const {
    goToNextStep,
    account,
    setAccount,
    asset,
    receiveAsset,
    sendAmount,
    receiveAmount
  } = props;

  const { accounts } = useContext(StoreContext);

  return (
    <div>
      <SwapFromToDiagram
        fromSymbol={asset.symbol}
        toSymbol={receiveAsset.symbol}
        fromAmount={sendAmount}
        toAmount={receiveAmount}
      />
      <Label>Select Address</Label>
      <AccountDropdown
        name={'account'}
        value={account}
        accounts={accounts}
        onSelect={(option: ExtendedAccount) => {
          setAccount(option);
        }}
      />

      <StyledButton onClick={goToNextStep}>Next</StyledButton>
    </div>
  );
}
